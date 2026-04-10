import { useState, useEffect } from "react";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F", accentDim: "rgba(255,122,47,0.12)",
  teal: "#00D4AA", tealDim: "rgba(0,212,170,0.12)", red: "#FF3B5C",
  redDim: "rgba(255,59,92,0.12)", t1: "#F0EEFF", t2: "#9298B4",
  border: "rgba(255,255,255,0.08)", card: "rgba(255,255,255,0.04)",
  blue: "#4A8FFF", purple: "#A855F7",
};

type Notification = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  action?: string;
};

function getTimeBasedNotifications(userName: string): Notification[] {
  const notes: Notification[] = [];
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=Sun, 1=Mon

  // Sunday 8-10pm — "nedělní dread"
  if (day === 0 && hour >= 20 && hour <= 22) {
    notes.push({
      id: "sunday-dread",
      icon: "🌙",
      title: "Nedělní úzkost? Normální.",
      subtitle: "Zítra je pondělí — ale ty jsi opičí válečník. Dýchej, odpočiň, budeš ready.",
      color: T.purple,
      action: "feel",
    });
  }

  // Monday 6-8am — "pondělní war cry"
  if (day === 1 && hour >= 6 && hour <= 8) {
    notes.push({
      id: "monday-warcry",
      icon: "⚔️",
      title: `Pondělí = tvůj den${userName ? `, ${userName}` : ""}!`,
      subtitle: "Goggins mode ON. Check-in a nastav tón celýmu týdnu. 💀",
      color: T.accent,
      action: "feel",
    });
  }

  // Post-school (14:00 - 16:00, weekdays)
  if (day >= 1 && day <= 5 && hour >= 14 && hour <= 16) {
    notes.push({
      id: "post-school",
      icon: "🎒",
      title: "Konec školy — jak to bylo?",
      subtitle: "Quick check-in. Vypusť to z hlavy a jdi dál.",
      color: T.teal,
      action: "feel",
    });
  }

  // Late night (23:00 - 2:00) — wind down
  if (hour >= 23 || hour <= 2) {
    notes.push({
      id: "late-night",
      icon: "😴",
      title: "Pozdě v noci? Opice taky potřebuje spát.",
      subtitle: "Zkus dýchání 4-7-8 a zavři oči. Zítra bude nový den.",
      color: T.blue,
    });
  }

  // Wednesday midweek boost (after school)
  if (day === 3 && hour >= 15 && hour <= 18) {
    notes.push({
      id: "midweek",
      icon: "💪",
      title: "Půlka týdne za tebou!",
      subtitle: "Tři dny máš za sebou. Jsi silnější než v pondělí.",
      color: T.teal,
    });
  }

  // Friday evening celebration
  if (day === 5 && hour >= 15 && hour <= 19) {
    notes.push({
      id: "friday-vibes",
      icon: "🎉",
      title: "Pátek! Přežil/a jsi týden!",
      subtitle: "Udělej check-in, uzavři týden jako warrior. 🐵",
      color: T.accent,
      action: "feel",
    });
  }

  return notes;
}

function getNotifications(
  lastCheckinDate: string | null,
  streakCount: number,
  userName: string
): Notification[] {
  const notes: Notification[] = [];
  const today = new Date().toISOString().split("T")[0];

  // Time-based smart notifications (priority)
  const timeNotes = getTimeBasedNotifications(userName);
  notes.push(...timeNotes);

  // Check-in reminder
  if (lastCheckinDate !== today) {
    if (!lastCheckinDate) {
      notes.push({
        id: "first-checkin",
        icon: "🐵",
        title: `Yo${userName ? `, ${userName}` : ""}! Jak se dneska cítíš?`,
        subtitle: "Udělej svůj první check-in a začni sbírat XP!",
        color: T.accent,
        action: "feel",
      });
    } else {
      const lastDate = new Date(lastCheckinDate);
      const diffDays = Math.floor((Date.now() - lastDate.getTime()) / 86400000);

      if (diffDays === 1) {
        notes.push({
          id: "daily-checkin",
          icon: "🔥",
          title: `${streakCount} dní v řadě! Neztrácej to!`,
          subtitle: "Udělej check-in a prodluž svůj streak!",
          color: T.accent,
          action: "feel",
        });
      } else if (diffDays >= 2) {
        notes.push({
          id: "streak-lost",
          icon: "💀",
          title: "Tvůj streak se ztratil!",
          subtitle: `${diffDays} dní bez check-inu. Začni znovu!`,
          color: T.red,
          action: "feel",
        });
      }
    }
  } else {
    // Already checked in today — streak celebration
    if (streakCount >= 7 && streakCount % 7 === 0) {
      notes.push({
        id: "streak-milestone",
        icon: "🏆",
        title: `${streakCount} dní v řadě! Jsi legenda!`,
        subtitle: "Opice je na tebe pyšná 🐵",
        color: T.teal,
      });
    } else if (streakCount >= 3 && streakCount % 3 === 0) {
      notes.push({
        id: "streak-good",
        icon: "⚡",
        title: `${streakCount} dní! Držíš to!`,
        subtitle: "Pokračuj a odemkni nové skiny!",
        color: T.accent,
      });
    }
  }

  // Deduplicate by id and limit to 2 most relevant
  const seen = new Set<string>();
  return notes.filter(n => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  }).slice(0, 2);
}

export default function InAppNotifications({
  lastCheckinDate,
  streakCount,
  userName,
  onNavigate,
}: {
  lastCheckinDate: string | null;
  streakCount: number;
  userName: string;
  onNavigate: (tab: string) => void;
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(false);

  const notifications = getNotifications(lastCheckinDate, streakCount, userName);
  const active = notifications.filter((n) => !dismissed.has(n.id));

  useEffect(() => {
    if (active.length > 0) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [active.length]);

  if (active.length === 0 || !visible) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      {active.map((n, i) => (
        <div
          key={n.id}
          className="anim-fadeUp"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            background: `linear-gradient(135deg, ${n.color}15, ${n.color}08)`,
            border: `1px solid ${n.color}30`,
            borderRadius: 16,
            cursor: n.action ? "pointer" : "default",
            animationDelay: `${i * 0.1}s`,
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => {
            if (n.action) onNavigate(n.action);
          }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }}>{n.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.t1, fontSize: 14, fontWeight: 800, marginBottom: 2 }}>
              {n.title}
            </div>
            <div style={{ color: T.t2, fontSize: 12, lineHeight: 1.4 }}>{n.subtitle}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed((prev) => new Set([...prev, n.id]));
            }}
            style={{
              background: "none",
              border: "none",
              color: T.t2,
              fontSize: 16,
              cursor: "pointer",
              padding: 4,
              flexShrink: 0,
              opacity: 0.6,
            }}
          >
            ✕
          </button>
          {n.action && (
            <div
              style={{
                position: "absolute",
                right: 40,
                top: "50%",
                transform: "translateY(-50%)",
                color: n.color,
                fontSize: 12,
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
