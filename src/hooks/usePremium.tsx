import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

export type PlanType = "free" | "monthly" | "annual";
export type SubStatus = "free" | "active" | "trial" | "expired" | "cancelled";

export interface PremiumState {
  plan: PlanType;
  status: SubStatus;
  isPremium: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  loading: boolean;
  startCheckout: (plan: Exclude<PlanType, "free">) => Promise<void>;
  startTrial: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const TRIAL_DAYS = 7;

export function usePremium(): PremiumState {
  type ProfileRow = Tables<"profiles">;
  type SubscriptionRow = Tables<"subscriptions">;
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [status, setStatus] = useState<SubStatus>("free");
  const [trialEnd, setTrialEnd] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setPlan("free");
      setStatus("free");
      setTrialEnd(null);
      setLoading(false);
      return;
    }

    const [profileRes, subscriptionRes] = await Promise.all([
      supabase.from("profiles").select("subscription_tier").eq("id", user.id).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan,status,trial_end,current_period_end")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    if (profileRes.error) {
      console.warn("Premium profile lookup failed, falling back to subscription row", profileRes.error);
    }

    if (subscriptionRes.error) {
      console.warn("Premium subscription lookup failed, falling back to profile tier", subscriptionRes.error);
    }

    const subscription = subscriptionRes.data as SubscriptionRow | null;
    const tier = profileRes.data?.subscription_tier === "premium" ? "premium" : "free";
    const subStatus = subscription?.status as SubStatus | null;
    const subscriptionPlan = subscription?.plan as PlanType | undefined;
    const trialDate = subscription?.trial_end ? new Date(subscription.trial_end) : null;

    if (subscription && (subStatus === "active" || subStatus === "trial")) {
      setPlan(subscriptionPlan === "monthly" ? "monthly" : "annual");
      setStatus(subStatus);
      setTrialEnd(trialDate);
    } else {
      setPlan(tier === "premium" ? "annual" : "free");
      setStatus(tier === "premium" ? "active" : "free");
      setTrialEnd(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkoutStatus = new URLSearchParams(window.location.search).get("checkout");
    if (checkoutStatus !== "success") return;

    const timer = window.setTimeout(() => {
      load();
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [load]);

  const startCheckout = useCallback(async (checkoutPlan: Exclude<PlanType, "free">) => {
    const { data, error } = await supabase.functions.invoke("create-checkout-session", {
      body: {
        plan: checkoutPlan,
        origin: window.location.origin,
      },
    });

    if (error) {
      console.warn("Could not start checkout", error);
      throw error;
    }

    const url = data?.url;
    if (!url || typeof url !== "string") {
      throw new Error("Checkout session did not return a URL");
    }

    window.location.href = url;
  }, []);

  const startTrial = useCallback(async () => {
    if (!user) return;
    const end = new Date(Date.now() + TRIAL_DAYS * 86400000);
    const [profileUpdate, subscriptionUpdate] = await Promise.all([
      supabase
        .from("profiles")
        .update({ subscription_tier: "premium" } satisfies Partial<ProfileRow>)
        .eq("id", user.id),
      supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: "annual",
          status: "trial",
          trial_start: new Date().toISOString(),
          trial_end: end.toISOString(),
        } satisfies Partial<SubscriptionRow>, { onConflict: "user_id" }),
    ]);

    if (profileUpdate.error || subscriptionUpdate.error) {
      console.warn("Could not start trial cleanly, keeping local premium state only", profileUpdate.error || subscriptionUpdate.error);
    }

    setStatus("trial");
    setPlan("annual");
    setTrialEnd(end);
  }, [user]);

  const isPremium = status === "active" || status === "trial";
  const isTrial = status === "trial";
  const trialDaysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : 0;

  return {
    plan,
    status,
    isPremium,
    isTrial,
    trialDaysLeft,
    loading,
    startCheckout,
    startTrial,
    refreshSubscription: load,
  };
}
