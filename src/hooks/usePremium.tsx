import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  startTrial: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const TRIAL_DAYS = 7;

export function usePremium(): PremiumState {
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

    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Premium lookup failed, falling back to free plan", error);
      setPlan("free");
      setStatus("free");
      setTrialEnd(null);
      setLoading(false);
      return;
    }

    const tier = (data as any)?.subscription_tier === "premium" ? "premium" : "free";
    setPlan(tier === "premium" ? "annual" : "free");
    setStatus(tier === "premium" ? "active" : "free");
    setTrialEnd(null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const startTrial = useCallback(async () => {
    if (!user) return;
    const end = new Date(Date.now() + TRIAL_DAYS * 86400000);
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_tier: "premium" } as any)
      .eq("id", user.id);

    if (error) {
      console.warn("Could not start trial, keeping local premium state only", error);
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
    startTrial,
    refreshSubscription: load,
  };
}
