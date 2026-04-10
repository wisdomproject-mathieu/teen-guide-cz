import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CheckoutPlan = "monthly" | "annual";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getAuthedUser(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey =
    Deno.env.get("SUPABASE_ANON_KEY") ??
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization");

  if (!supabaseUrl || !supabaseKey || !authHeader) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: authHeader,
      apikey: supabaseKey,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<{ id: string; email?: string | null }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const plan = body?.plan as CheckoutPlan | undefined;
    const origin = typeof body?.origin === "string" ? body.origin : "";

    if (plan !== "monthly" && plan !== "annual") {
      return jsonResponse({ error: "Invalid plan" }, 400);
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const monthlyPriceId = Deno.env.get("STRIPE_PRICE_MONTHLY");
    const annualPriceId = Deno.env.get("STRIPE_PRICE_ANNUAL");
    const siteUrl = Deno.env.get("SITE_URL") || origin || "http://localhost:8080";

    if (!stripeSecretKey) {
      return jsonResponse({ error: "STRIPE_SECRET_KEY is not configured" }, 500);
    }

    const priceId = plan === "annual" ? annualPriceId : monthlyPriceId;
    if (!priceId) {
      return jsonResponse({ error: `Missing Stripe price ID for ${plan}` }, 500);
    }

    const user = await getAuthedUser(req);
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const sessionParams = new URLSearchParams();
    sessionParams.set("mode", "subscription");
    sessionParams.set("line_items[0][price]", priceId);
    sessionParams.set("line_items[0][quantity]", "1");
    sessionParams.set("success_url", `${siteUrl}?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`);
    sessionParams.set("cancel_url", `${siteUrl}?checkout=cancelled&plan=${plan}`);
    sessionParams.set("client_reference_id", user.id);
    sessionParams.set("metadata[user_id]", user.id);
    sessionParams.set("metadata[plan]", plan);
    sessionParams.set("subscription_data[metadata][user_id]", user.id);
    sessionParams.set("subscription_data[metadata][plan]", plan);

    if (user.email) {
      sessionParams.set("customer_email", user.email);
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: sessionParams,
    });

    const payload = await response.text();
    if (!response.ok) {
      return jsonResponse({
        error: "Stripe checkout session failed",
        details: payload,
      }, response.status);
    }

    const parsed = JSON.parse(payload) as { id?: string; url?: string };
    if (!parsed.url) {
      return jsonResponse({ error: "Stripe did not return a checkout URL" }, 500);
    }

    return jsonResponse({
      url: parsed.url,
      sessionId: parsed.id ?? null,
    });
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return jsonResponse({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});
