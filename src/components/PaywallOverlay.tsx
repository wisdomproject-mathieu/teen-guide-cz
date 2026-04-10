import { useState } from "react";
import type { PremiumState } from "@/hooks/usePremium";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F", accentDim: "rgba(255,122,47,0.12)",
  teal: "#00D4AA", tealDim: "rgba(0,212,170,0.12)", red: "#FF3B5C",
  redDim: "rgba(255,59,92,0.12)", blue: "#4A8FFF", purple: "#A855F7",
  t1: "#F0EEFF", t2: "#9298B4", t3: "#5A6080",
  card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
};

interface PaywallOverlayProps {
  onClose: () => void;
  premium: PremiumState;
  feature?: string;
}

export default function PaywallOverlay({ onClose, premium, feature }: PaywallOverlayProps) {
  const [starting, setStarting] = useState(false);
  const [startingPlan, setStartingPlan] = useState<"monthly" | "annual" | null>(null);

  const handleCheckout = async (plan: "monthly" | "annual") => {
    setStartingPlan(plan);
    setStarting(true);
    try {
      await premium.startCheckout(plan);
    } finally {
      setStarting(false);
      setStartingPlan(null);
    }
  };

  const handleStartTrial = async () => {
    setStarting(true);
    try {
      await premium.startTrial();
      onClose();
    } finally {
      setStarting(false);
    }
  };

  const featureLabel = feature || "Tato funkce";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 10000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", overflowY: "auto",
    }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        {/* Header */}
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐵👑</div>
        <div style={{ color: T.t1, fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
          Odemkni plnou sílu opice
        </div>
        <div style={{ color: T.t2, fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>
          {featureLabel} je součástí Premium.
        </div>
        <div style={{ color: T.accent, fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
          Vyber plán nebo zkus 7 dní zdarma.
        </div>

        {/* Pricing cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {/* Annual — featured */}
          <div style={{
            background: `linear-gradient(135deg, ${T.accent}15, ${T.purple}08)`,
            border: `2px solid ${T.accent}`,
            borderRadius: 16, padding: "20px 16px", position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -1, right: 16, background: T.accent, color: "#fff",
              fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: "0 0 8px 8px",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Nejlepší hodnota</div>
            <div style={{ color: T.t3, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Opičí válečník · Roční
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, margin: "8px 0 4px" }}>
              <span style={{ color: T.t1, fontSize: 36, fontWeight: 900 }}>799</span>
              <span style={{ color: T.t2, fontSize: 14 }}>CZK / rok</span>
            </div>
            <div style={{ color: T.t3, fontSize: 12, marginBottom: 12 }}>≈ 66 CZK/měsíc (~€2.7/měs)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left", padding: "0 8px" }}>
              {["Všechny řeči (3 intenzity)", "Opičák AI chat", "Plný deník & kalendář", "Warrior rank systém", "Smart notifikace", "Premium warrior card"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: T.t2, fontSize: 12 }}>
                  <span style={{ color: T.teal, fontSize: 11 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly */}
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "16px 16px",
          }}>
            <div style={{ color: T.t3, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Opičí bojovník · Měsíční
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, margin: "8px 0 4px" }}>
              <span style={{ color: T.t1, fontSize: 28, fontWeight: 900 }}>99</span>
              <span style={{ color: T.t2, fontSize: 14 }}>CZK / měsíc</span>
            </div>
            <div style={{ color: T.t3, fontSize: 12 }}>~€4/měsíc</div>
          </div>

          {/* Free tier reference */}
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "12px 16px",
          }}>
            <div style={{ color: T.t3, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Opičí nováček · Zdarma
            </div>
            <div style={{ color: T.t2, fontSize: 12, marginTop: 4 }}>
              SOS, check-in, 3 řeči, 1 dýchání, 7 dní deníku
            </div>
          </div>
        </div>

        {/* CTA — Checkout */}
        <button
          onClick={() => handleCheckout("annual")}
          disabled={starting}
          style={{
            width: "100%", padding: "15px 0",
            background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
            border: "none", borderRadius: 14,
            color: "#fff", fontSize: 16, fontWeight: 900,
            cursor: starting ? "wait" : "pointer",
            fontFamily: "inherit",
            boxShadow: `0 0 24px ${T.teal}30`,
            marginBottom: 10,
            opacity: startingPlan && startingPlan !== "annual" ? 0.75 : 1,
          }}
        >
          {starting && startingPlan === "annual" ? "Otevírám Stripe..." : "Roční Premium · 799 Kč"}
        </button>

        <button
          onClick={() => handleCheckout("monthly")}
          disabled={starting}
          style={{
            width: "100%", padding: "14px 0",
            background: `linear-gradient(135deg, ${T.accent}, #FF9A5C)`,
            border: "none", borderRadius: 14,
            color: "#fff", fontSize: 16, fontWeight: 900,
            cursor: starting ? "wait" : "pointer",
            fontFamily: "inherit",
            boxShadow: `0 0 30px ${T.accent}40`,
            marginBottom: 12,
            opacity: startingPlan && startingPlan !== "monthly" ? 0.75 : 1,
          }}
        >
          {starting && startingPlan === "monthly" ? "Otevírám Stripe..." : "Měsíční Premium · 99 Kč"}
        </button>

        <button
          onClick={handleStartTrial}
          disabled={starting}
          style={{
            width: "100%", padding: "14px 0",
            background: "none",
            border: `1px solid ${T.border}`, borderRadius: 14,
            color: T.t1, fontSize: 15, fontWeight: 800,
            cursor: starting ? "wait" : "pointer",
            fontFamily: "inherit",
            marginBottom: 12,
          }}
        >
          {starting && !startingPlan ? "Aktivuji trial..." : "Zkusit 7 dní zdarma"}
        </button>

        <div style={{ color: T.t3, fontSize: 11, lineHeight: 1.5, marginBottom: 16 }}>
          Stripe platební brána. Po dokončení se Premium odemkne automaticky.
          <br />Po skončení trial zůstaneš na Free plánu.
        </div>

        {/* Safety note */}
        <div style={{
          padding: 12, background: T.tealDim, border: `1px solid ${T.teal}20`,
          borderRadius: 12, marginBottom: 16,
        }}>
          <div style={{ color: T.teal, fontSize: 12, fontWeight: 700 }}>
            🆘 SOS + Linka bezpečí = vždy zdarma
          </div>
          <div style={{ color: T.t2, fontSize: 11, marginTop: 2 }}>
            Bezpečnostní funkce nikdy nezamykáme.
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: "10px 28px", background: "none",
            border: `1px solid ${T.t3}`, borderRadius: 99,
            color: T.t2, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ✕ Zavřít
        </button>
      </div>
    </div>
  );
}
