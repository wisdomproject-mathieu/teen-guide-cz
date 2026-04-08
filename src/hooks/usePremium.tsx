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
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setPlan((data as any).plan || "free");
      // Check if trial has expired
      const trialEndDate = (data as any).trial_end ? new Date((data as any).trial_end) : null;
      if ((data as any).status === "trial" && trialEndDate && trialEndDate < new Date()) {
        setStatus("expired");
        // Update in DB
        await supabase.from("subscriptions").update({ status: "expired" } as any).eq("user_id", user.id);
      } else {
        setStatus((data as any).status || "free");
      }
      setTrialEnd(trialEndDate);
    } else {
      // No subscription row yet (existing user) — create one
      await supabase.from("subscriptions").insert({ user_id: user.id, plan: "free", status: "free" } as any);
      setPlan("free");
      setStatus("free");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const startTrial = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const end = new Date(now.getTime() + TRIAL_DAYS * 86400000);
    await supabase.from("subscriptions").update({
      status: "trial",
      plan: "annual", // trial gives annual-level access
      trial_start: now.toISOString(),
      trial_end: end.toISOString(),
    } as any).eq("user_id", user.id);
    setStatus("trial");
    setPlan("annual");
    setTrialEnd(end);
  }, [user]);

  const isPremium = status === "active" || status === "trial";
  const isTrial = status === "trial";
  const trialDaysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : 0;

  return {
    plan, status, isPremium, isTrial, trialDaysLeft, loading,
    startTrial, refreshSubscription: load,
  };
}
