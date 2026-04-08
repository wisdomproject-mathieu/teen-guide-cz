import { useState } from "react";
import monkeyHero from "@/assets/monkey-hero.png";
import monkeyGreat from "@/assets/monkey-great.png";
import monkeyMeh from "@/assets/monkey-meh.png";
import monkeyAngryMood from "@/assets/monkey-angry-mood.png";
import monkeySadMood from "@/assets/monkey-sad-mood.png";
import monkeyAnxiousMood from "@/assets/monkey-anxious-mood.png";
import monkeyAwful from "@/assets/monkey-awful.png";
import monkeyPumped from "@/assets/monkey-pumped.png";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F", accentDim: "rgba(255,122,47,0.12)",
  teal: "#00D4AA", tealDim: "rgba(0,212,170,0.12)", red: "#FF3B5C",
  blue: "#4A8FFF", purple: "#A855F7", t1: "#F0EEFF", t2: "#9298B4",
  t3: "#5A6080", card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
};

const MOOD_MAP: Record<string, string> = {
  great: monkeyGreat, pumped: monkeyPumped, meh: monkeyMeh,
  angry: monkeyAngryMood, sad: monkeySadMood, anxious: monkeyAnxiousMood,
  awful: monkeyAwful,
};

const ONBOARD_MOODS = [
  { id: "great", label: "Skvěle", emoji: "🔥", color: T.teal },
  { id: "pumped", label: "Nabitej/á", emoji: "⚡", color: T.blue },
  { id: "meh", label: "Tak nějak", emoji: "😐", color: T.accent },
  { id: "angry", label: "Naštvanej/á", emoji: "😤", color: T.red },
  { id: "sad", label: "Smutnej/á", emoji: "💙", color: T.purple },
  { id: "anxious", label: "Úzkostnej/á", emoji: "😰", color: "#FF7A2F" },
  { id: "awful", label: "Na dně", emoji: "🖤", color: T.red },
];

interface OnboardingProps {
  onComplete: (name: string, moodId: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  // 2-screen flow: Welcome → Mood (skip name, ask later)
  const [screen, setScreen] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [animOut, setAnimOut] = useState(false);

  const goNext = () => {
    setAnimOut(true);
    setTimeout(() => {
      setScreen(s => s + 1);
      setAnimOut(false);
    }, 300);
  };

  const finish = (moodId: string) => {
    setSelectedMood(moodId);
    setAnimOut(true);
    // Pass empty name — will be prompted after first check-in
    setTimeout(() => onComplete("", moodId), 500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.accent}15, transparent 70%)`,
        top: "10%", left: "50%", transform: "translateX(-50%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Progress dots — now 2 steps */}
      <div style={{ position: "absolute", top: 48, display: "flex", gap: 10 }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            width: i === screen ? 28 : 8, height: 8, borderRadius: 99,
            background: i <= screen ? T.accent : T.border,
            transition: "all .4s cubic-bezier(.4,0,.2,1)",
          }} />
        ))}
      </div>

      <div
        key={screen}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 20, padding: "0 32px", maxWidth: 380, width: "100%",
          animation: animOut
            ? "onb-slideOut .3s ease-in forwards"
            : "onb-slideIn .5s cubic-bezier(.4,0,.2,1) both",
        }}
      >
        {/* ─── SCREEN 0: WELCOME (condensed) ─── */}
        {screen === 0 && (
          <>
            <img
              src={monkeyHero}
              alt="Monkey Mind"
              style={{
                width: 140, height: 140, objectFit: "contain",
                filter: `drop-shadow(0 0 40px ${T.accent}40)`,
                animation: "onb-float 3s ease-in-out infinite",
              }}
            />
            <div style={{
              fontSize: 28, fontWeight: 900, color: T.t1, textAlign: "center",
              lineHeight: 1.2, letterSpacing: "-0.02em",
            }}>
              Tvoje
              {" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Monkey Mind
              </span>
              {" "}🐵
            </div>
            <p style={{
              color: T.t2, fontSize: 14, textAlign: "center",
              lineHeight: 1.6, maxWidth: 300,
            }}>
              Motivační řeči, dýchání, AI chat.
              <br />
              <span style={{ color: T.accent, fontWeight: 700 }}>Bez keců. Pro tebe. Za 90 vteřin.</span>
            </p>
            <button
              onClick={goNext}
              style={{
                padding: "16px 48px", borderRadius: 99,
                background: `linear-gradient(135deg, ${T.accent}, #FF5500)`,
                border: "none", color: "#fff", fontSize: 18, fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: `0 8px 32px ${T.accent}40`,
                transition: "transform .2s, box-shadow .2s",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.96)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Jak se cítíš? →
            </button>
          </>
        )}

        {/* ─── SCREEN 1: MOOD CHECK (straight to value) ─── */}
        {screen === 1 && (
          <>
            <div style={{
              fontSize: 24, fontWeight: 900, color: T.t1, textAlign: "center",
              lineHeight: 1.3,
            }}>
              Jaká je teď tvoje nálada? 🐵
            </div>
            <p style={{ color: T.t2, fontSize: 13, textAlign: "center" }}>
              Klikni — opice ti připraví obsah na míru
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 10, width: "100%",
            }}>
              {ONBOARD_MOODS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => finish(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px",
                    background: selectedMood === m.id ? `${m.color}20` : T.card,
                    border: `1px solid ${selectedMood === m.id ? m.color : T.border}`,
                    borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left",
                    animation: `onb-stagger .4s cubic-bezier(.4,0,.2,1) both`,
                    animationDelay: `${i * 0.06}s`,
                    transition: "transform .15s, background .2s, border-color .2s",
                    gridColumn: m.id === "awful" ? "1 / -1" : undefined,
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.96)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={MOOD_MAP[m.id]}
                    alt={m.label}
                    style={{ width: 36, height: 36, objectFit: "contain" }}
                  />
                  <div>
                    <div style={{ color: T.t1, fontSize: 15, fontWeight: 700 }}>
                      {m.emoji} {m.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes onb-slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes onb-slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes onb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes onb-stagger {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
