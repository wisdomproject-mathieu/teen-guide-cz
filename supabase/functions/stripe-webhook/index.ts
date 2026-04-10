import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, stripe-signature",
};

type StripeSubscriptionStatus = "active" | "trialing" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "paused";

type StripeSubscription = {
  id: string;
  customer: string;
  status: StripeSubscriptionStatus;
  metadata?: Record<string, string>;
  current_period_start?: number;
  current_period_end?: number;
  trial_start?: number | null;
  trial_end?: number | null;
  items?: {
    data: Array<{
      price?: {
        id?: string;
        recurring?: { interval?: string | null } | null;
      } | null;
    }>;
  };
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function hexFromBuffer(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const pieces = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = pieces.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = pieces
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
    .filter(Boolean);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = hexFromBuffer(digest);
  return signatures.includes(expected);
}

function normalizeStatus(status: StripeSubscriptionStatus) {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trial";
    case "canceled":
      return "cancelled";
    case "incomplete_expired":
    case "past_due":
    case "unpaid":
      return "expired";
    case "paused":
      return "expired";
    case "incomplete":
    default:
      return "free";
  }
}

function resolvePlan(subscription: StripeSubscription, fallbackPlan?: string | null) {
  if (fallbackPlan === "monthly" || fallbackPlan === "annual") {
    return fallbackPlan;
  }

  const interval = subscription.items?.data?.[0]?.price?.recurring?.interval;
  return interval === "month" ? "monthly" : "annual";
}

async function stripeApiGet(path: string) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${stripeKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

async function supabaseRequest(path: string, init: RequestInit) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase service credentials are not configured");

  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

async function findUserIdByStripeIds(stripeSubscriptionId: string, stripeCustomerId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase service credentials are not configured");

  const query = new URLSearchParams({
    select: "user_id",
    or: `(stripe_subscription_id.eq.${stripeSubscriptionId},stripe_customer_id.eq.${stripeCustomerId})`,
    limit: "1",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/subscriptions?${query.toString()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json() as Array<{ user_id: string }>;
  return rows[0]?.user_id ?? null;
}

async function syncSubscription(subscription: StripeSubscription, fallbackUserId?: string | null, fallbackPlan?: string | null) {
  const userId = subscription.metadata?.user_id || fallbackUserId || await findUserIdByStripeIds(subscription.id, subscription.customer);
  if (!userId) {
    console.warn("No user_id found for Stripe subscription", subscription.id);
    return;
  }

  const status = normalizeStatus(subscription.status);
  const tier = status === "active" || status === "trial" ? "premium" : "free";
  const plan = resolvePlan(subscription, fallbackPlan);

  await Promise.all([
    supabaseRequest(`/subscriptions?on_conflict=user_id`, {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        plan,
        status,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
      }),
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
    }),
    supabaseRequest(`/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        subscription_tier: tier,
      }),
    }),
  ]);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecret || !webhookSecret) {
      return jsonResponse({ error: "Stripe secrets are not configured" }, 500);
    }

    const signature = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!signature || !(await verifyStripeSignature(rawBody, signature, webhookSecret))) {
      return jsonResponse({ error: "Invalid signature" }, 400);
    }

    const event = JSON.parse(rawBody) as {
      type: string;
      data: {
        object: StripeSubscription & {
          subscription?: string | StripeSubscription | null;
          client_reference_id?: string | null;
          metadata?: Record<string, string>;
          customer?: string | null;
          payment_status?: string | null;
          mode?: string | null;
        };
      };
    };

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription" && typeof session.subscription === "string") {
        const stripeSubscription = await stripeApiGet(`/subscriptions/${session.subscription}`);
        await syncSubscription(stripeSubscription as StripeSubscription, session.metadata?.user_id || session.client_reference_id || null, session.metadata?.plan || null);
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      await syncSubscription(
        event.data.object as StripeSubscription,
        event.data.object.metadata?.user_id || null,
        event.data.object.metadata?.plan || null,
      );
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return jsonResponse({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});
