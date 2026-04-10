import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type ProfileRow = Tables<"profiles">;
type MoodLogRow = Tables<"mood_logs">;
type UserProgressRow = Tables<"user_progress">;
type DiaryEntryRow = Tables<"diary_entries">;
type SosContactRow = Tables<"sos_contacts">;
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
  const [subscriptionTier, setSubscriptionTier] = useState<"free" | "premium">("free");
  const [userName, setUserName] = useState("");
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryRow[]>([]);
  const [sosContacts, setSosContacts] = useState<SosContactRow[]>([]);

  // Load all data on mount
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setMoodLog([]);
      setXp(0);
      setStreakCount(0);
      setCompletedQuests([]);
      setEquippedSkin("default");
      setSubscriptionTier("free");
      setUserName("");
      setLastCheckinDate(null);
      setDiaryEntries([]);
      setSosContacts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      const [profileRes, moodsRes, progressRes, diaryRes, contactsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("mood_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
        supabase.from("user_progress").select("*").eq("id", user.id).single(),
        supabase.from("diary_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("sos_contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      ]);

      if (cancelled) return;

      if (profileRes.data) {
        setProfile(profileRes.data);
        setUserName(profileRes.data.display_name || "");
        setEquippedSkin(profileRes.data.equipped_skin || "default");
        setSubscriptionTier(profileRes.data.subscription_tier === "premium" ? "premium" : "free");
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

      if (diaryRes.data) {
        setDiaryEntries(diaryRes.data as DiaryEntryRow[]);
      }

      if (contactsRes.data) {
        setSosContacts(contactsRes.data as SosContactRow[]);
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

  const saveDiaryEntry = useCallback(async (content: string, moodTag?: string) => {
    if (!user || !content.trim()) return;
    const { data } = await supabase.from("diary_entries").insert({
      user_id: user.id,
      content,
      mood_tag: moodTag || null,
    }).select().single();
    if (data) {
      setDiaryEntries(prev => [data, ...prev]);
    }
    return data;
  }, [user]);

  const saveSosContacts = useCallback(async (contacts: {id?:string; name:string; phone:string}[]) => {
    if (!user) return;
    // Delete all existing contacts and re-insert
      await supabase.from("sos_contacts").delete().eq("user_id", user.id);
      const validContacts = contacts.filter(c => c.name.trim() || c.phone.trim());
    if (validContacts.length > 0) {
      const { data } = await supabase.from("sos_contacts").insert(
        validContacts.map(c => ({ user_id: user.id, name: c.name, phone: c.phone }))
      ).select();
      if (data) {
        setSosContacts(data as SosContactRow[]);
      }
    } else {
      setSosContacts([]);
    }
  }, [user]);

  return {
    loading, moodLog, xp, streakCount, completedQuests,
    equippedSkin, subscriptionTier, userName, profile, lastCheckinDate,
    diaryEntries, sosContacts,
    updateName, updateSkin, logMood, updateProgress,
    saveDiaryEntry, saveSosContacts,
    setMoodLog, setXp, setStreakCount, setCompletedQuests,
  };
}
