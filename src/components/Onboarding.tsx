import { useState } from "react";
import monkeyHero from "@/assets/monkey-hero.png";
import monkeyZen from "@/assets/monkey-zen.png";
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
  const [screen, setScreen] = useState(0);
  const [name, setName] = useState("");
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
    setTimeout(() => onComplete(name.trim() || "Opice", moodId), 500);
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

      {/* Progress dots */}
      <div style={{
        position: "absolute", top: 48, display: "flex", gap: 10,
      }}>
        {[0, 1, 2].map(i => (
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
        {/* ─── SCREEN 0: WELCOME ─── */}
        {screen === 0 && (
          <>
            <img
              src={monkeyHero}
              alt="Monkey Mind"
              style={{
                width: 160, height: 160, objectFit: "contain",
                filter: `drop-shadow(0 0 40px ${T.accent}40)`,
                animation: "onb-float 3s ease-in-out infinite",
              }}
            />
            <div style={{
              fontSize: 32, fontWeight: 900, color: T.t1, textAlign: "center",
              lineHeight: 1.2, letterSpacing: "-0.02em",
            }}>
              Yo! Jsem tvoje
              <br />
              <span style={{
                background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Monkey Mind
              </span>
              {" "}🐵
            </div>
            <p style={{
              color: T.t2, fontSize: 15, textAlign: "center",
              lineHeight: 1.6, maxWidth: 300,
            }}>
              Tvůj parťák na dny, kdy to sere.
              <br />
              Motivační řeči, dýchání, AI chat a výzvy.
              <br />
              <span style={{ color: T.accent, fontWeight: 700 }}>Bez keců. Bez souzení. Pro tebe.</span>
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
              Jdeme na to! 🚀
            </button>
          </>
        )}

        {/* ─── SCREEN 1: NAME INPUT ─── */}
        {screen === 1 && (
          <>
            <img
              src={monkeyZen}
              alt="Zen monkey"
              style={{
                width: 120, height: 120, objectFit: "contain",
                filter: `drop-shadow(0 0 30px ${T.teal}30)`,
                animation: "onb-float 3s ease-in-out infinite",
              }}
            />
            <div style={{
              fontSize: 26, fontWeight: 900, color: T.t1, textAlign: "center",
              lineHeight: 1.3,
            }}>
              Jak ti mám říkat? 🤙
            </div>
            <p style={{ color: T.t2, fontSize: 14, textAlign: "center" }}>
              Přezdívka, jméno, cokoliv — je to jen mezi námi
            </p>
            <div style={{ width: "100%", position: "relative" }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tvoje jméno nebo přezdívka…"
                maxLength={30}
                autoFocus
                style={{
                  width: "100%", padding: "16px 20px", fontSize: 18,
                  fontWeight: 600, fontFamily: "inherit",
                  background: T.card, border: `2px solid ${name ? T.accent : T.border}`,
                  borderRadius: 16, color: T.t1, outline: "none",
                  transition: "border-color .3s",
                  boxSizing: "border-box",
                }}
                onKeyDown={e => { if (e.key === "Enter" && name.trim()) goNext(); }}
              />
              {name.length > 0 && (
                <span style={{
                  position: "absolute", right: 16, top: "50%",
                  transform: "translateY(-50%)", color: T.t3, fontSize: 12,
                }}>
                  {name.length}/30
                </span>
              )}
            </div>
            <button
              onClick={goNext}
              disabled={!name.trim()}
              style={{
                padding: "16px 48px", borderRadius: 99,
                background: name.trim()
                  ? `linear-gradient(135deg, ${T.accent}, #FF5500)`
                  : T.card,
                border: name.trim() ? "none" : `1px solid ${T.border}`,
                color: name.trim() ? "#fff" : T.t3,
                fontSize: 18, fontWeight: 800, cursor: name.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                boxShadow: name.trim() ? `0 8px 32px ${T.accent}40` : "none",
                transition: "all .3s",
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              Pokračovat →
            </button>
          </>
        )}

        {/* ─── SCREEN 2: FIRST MOOD CHECK ─── */}
        {screen === 2 && (
          <>
            <div style={{
              fontSize: 24, fontWeight: 900, color: T.t1, textAlign: "center",
              lineHeight: 1.3,
            }}>
              Jak se teď cítíš,
              <br />
              <span style={{ color: T.accent }}>{name.trim() || "Opice"}</span>? 🐵
            </div>
            <p style={{ color: T.t2, fontSize: 13, textAlign: "center" }}>
              Vyber náladu — podle toho ti připravím obsah
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
