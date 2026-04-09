import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type ProfileRow = Tables<"profiles">;
type MoodLogRow = Tables<"mood_logs">;
type UserProgressRow = Tables<"user_progress">;
type MoodLogEntry = {
  mood: { id: string };
  reason: { id: string } | null;
  ts: string;
  id: string;
};

function toCompletedQuestList(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function useCloudData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [moodLog, setMoodLog] = useState<MoodLogEntry[]>([]);
  const [xp, setXp] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [equippedSkin, setEquippedSkin] = useState("default");
  const [userName, setUserName] = useState("");
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      const [profileRes, moodsRes, progressRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("mood_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
        supabase.from("user_progress").select("*").eq("id", user.id).single(),
      ]);

      if (cancelled) return;

      if (profileRes.data) {
        setProfile(profileRes.data);
        setUserName(profileRes.data.display_name || "");
        setEquippedSkin(profileRes.data.equipped_skin || "default");
      }

      if (moodsRes.data) {
        setMoodLog(moodsRes.data.map((m: MoodLogRow) => ({
          mood: { id: m.mood_id },
          reason: m.reason_id ? { id: m.reason_id } : null,
          ts: new Date(m.created_at).toLocaleString("cs-CZ"),
          id: m.id,
        })));
      }

      if (progressRes.data) {
        setXp(progressRes.data.xp || 0);
        setStreakCount(progressRes.data.streak_count || 0);
        setCompletedQuests(toCompletedQuestList(progressRes.data.completed_quests));
        setLastCheckinDate(progressRes.data.last_checkin_date || null);
      }

      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [user]);

  const updateName = useCallback(async (name: string) => {
    setUserName(name);
    if (user) await supabase.from("profiles").update({ display_name: name }).eq("id", user.id);
  }, [user]);

  const updateSkin = useCallback(async (skinId: string) => {
    setEquippedSkin(skinId);
    if (user) await supabase.from("profiles").update({ equipped_skin: skinId }).eq("id", user.id);
  }, [user]);

  const logMood = useCallback(async (moodId: string, reasonId: string | null) => {
    if (!user) return;
    const { data } = await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood_id: moodId,
      reason_id: reasonId,
    }).select().single();

    if (data) {
      setMoodLog(prev => [{
        mood: { id: data.mood_id },
        reason: data.reason_id ? { id: data.reason_id } : null,
        ts: new Date(data.created_at).toLocaleString("cs-CZ"),
        id: data.id,
      }, ...prev]);
    }
  }, [user]);

  const updateProgress = useCallback(async (newXp: number, newStreak: number, newQuests: string[]) => {
    setXp(newXp);
    setStreakCount(newStreak);
    setCompletedQuests(newQuests);
    if (user) {
      await supabase.from("user_progress").update({
        xp: newXp,
        streak_count: newStreak,
        completed_quests: newQuests,
        last_checkin_date: new Date().toISOString().split("T")[0],
      } satisfies Partial<UserProgressRow>).eq("id", user.id);
    }
  }, [user]);

  return {
    loading, moodLog, xp, streakCount, completedQuests,
    equippedSkin, userName, profile, lastCheckinDate,
    updateName, updateSkin, logMood, updateProgress,
    setMoodLog, setXp, setStreakCount, setCompletedQuests,
  };
}
