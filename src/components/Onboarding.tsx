import { useState } from "react";
import monkeyHero from "@/assets/monkey-hero.png";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F",
  teal: "#00D4AA", t1: "#F0EEFF", t2: "#9298B4",
  red: "#FF3B5C",
  card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
};

interface OnboardingProps {
  onComplete: (name: string, moodId: string) => void;
}

const TIERS = [
  { id: "great", label: "😊 Dobře", color: T.teal },
  { id: "meh", label: "😐 Tak nějak", color: T.accent },
  { id: "awful", label: "😔 Špatně", color: T.red },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const finish = (moodId: string) => {
    setSelected(moodId);
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
        width: 90, height: 90, objectFit: "contain",
        filter: `drop-shadow(0 0 30px ${T.accent}40)`,
        marginBottom: 20,
        animation: "onb-float 3s ease-in-out infinite",
      }} />
      <div style={{
        fontSize: 28, fontWeight: 900, color: T.t1, textAlign: "center",
        marginBottom: 6,
      }}>
        Jak se cítíš? 🐵
      </div>
      <div style={{ color: T.t2, fontSize: 14, textAlign: "center", marginBottom: 28 }}>
        Klikni — za 5 vteřin ti pomůžu
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
        {TIERS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => finish(t.id)}
            style={{
              padding: "20px 24px",
              background: selected === t.id ? `${t.color}20` : T.card,
              border: `1px solid ${selected === t.id ? t.color : T.border}`,
              borderRadius: 18, cursor: "pointer", fontFamily: "inherit",
              color: T.t1, fontSize: 20, fontWeight: 800, textAlign: "center",
              animation: `onb-stagger .3s ease-out both`,
              animationDelay: `${i * 0.06}s`,
              transition: "transform .15s, background .2s",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t.label}
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
