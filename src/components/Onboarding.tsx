import { useState } from "react";
import monkeyHero from "@/assets/monkey-hero.png";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F",
  teal: "#00D4AA", t1: "#F0EEFF", t2: "#9298B4",
  card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
};

interface OnboardingProps {
  onComplete: (name: string, moodId: string) => void;
}

// Ultra-minimal: single screen, just pick a mood — done.
export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const MOODS = [
    { id: "great", label: "🔥 Skvěle", color: T.teal },
    { id: "pumped", label: "⚡ Nabitej/á", color: "#4A8FFF" },
    { id: "meh", label: "😐 Tak nějak", color: T.accent },
    { id: "angry", label: "😤 Naštvanej/á", color: "#FF3B5C" },
    { id: "sad", label: "💙 Smutnej/á", color: "#A855F7" },
    { id: "anxious", label: "😰 Úzkostnej/á", color: "#FF7A2F" },
    { id: "awful", label: "🖤 Na dně", color: "#FF3B5C" },
  ];

  const finish = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => onComplete("", moodId), 300);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif",
      padding: "24px 24px",
    }}>
      <img src={monkeyHero} alt="" style={{
        width: 80, height: 80, objectFit: "contain",
        filter: `drop-shadow(0 0 30px ${T.accent}40)`,
        marginBottom: 16,
        animation: "onb-float 3s ease-in-out infinite",
      }} />
      <div style={{
        fontSize: 24, fontWeight: 900, color: T.t1, textAlign: "center",
        marginBottom: 4,
      }}>
        Jak se cítíš? 🐵
      </div>
      <div style={{ color: T.t2, fontSize: 13, textAlign: "center", marginBottom: 20 }}>
        Klikni — za 5 vteřin ti pomůžu
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 320 }}>
        {MOODS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => finish(m.id)}
            style={{
              padding: "14px 20px",
              background: selectedMood === m.id ? `${m.color}20` : T.card,
              border: `1px solid ${selectedMood === m.id ? m.color : T.border}`,
              borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
              color: T.t1, fontSize: 16, fontWeight: 700, textAlign: "left",
              animation: `onb-stagger .3s ease-out both`,
              animationDelay: `${i * 0.04}s`,
              transition: "transform .15s, background .2s",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {m.label}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes onb-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes onb-stagger { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
