import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import monkeyHero from "@/assets/monkey-hero.png";

const T = {
  bg: "#0A0C13", accent: "#FF7A2F", accentDim: "rgba(255,122,47,0.12)",
  teal: "#00D4AA", red: "#FF3B5C", redDim: "rgba(255,59,92,0.12)",
  t1: "#F0EEFF", t2: "#9298B4", t3: "#5A6080",
  card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
};

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  if (loading) return (
    <div style={{ background: T.bg, height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={monkeyHero} alt="" style={{ width: 80, height: 80, objectFit: "contain", animation: "float 2s ease-in-out infinite" }} />
    </div>
  );

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (mode === "signup") {
      if (password.length < 6) { setError("Heslo musí mít aspoň 6 znaků"); setSubmitting(false); return; }
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message === "User already registered" ? "Tento email už je zaregistrovaný" : error.message);
      } else {
        setSignupDone(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Špatný email nebo heslo" : error.message);
      }
    }
    setSubmitting(false);
  };

  if (signupDone) return (
    <div style={{ background: T.bg, height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <img src={monkeyHero} alt="" style={{ width: 100, height: 100, objectFit: "contain", margin: "0 auto 20px", animation: "float 2s ease-in-out infinite" }} />
        <div style={{ color: T.teal, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Ověř svůj email! 📧</div>
        <div style={{ color: T.t2, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Poslali jsme ti odkaz na <span style={{ color: T.accent, fontWeight: 700 }}>{email}</span>. Klikni na něj a můžeš začít!
        </div>
        <button onClick={() => { setSignupDone(false); setMode("login"); }} style={{ padding: "12px 28px", background: T.accentDim, border: `1px solid ${T.accent}40`, borderRadius: 99, color: T.accent, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Přihlásit se
        </button>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: T.bg, height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:${T.t3}}
      `}</style>

      <div style={{ maxWidth: 360, width: "100%", animation: "fadeUp .4s ease-out both" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src={monkeyHero} alt="Monkey Mind" style={{ width: 100, height: 100, objectFit: "contain", margin: "0 auto 16px", animation: "float 2s ease-in-out infinite" }} />
          <div style={{ color: T.t1, fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Monkey Mind 🐵</div>
          <div style={{ color: T.t2, fontSize: 14, marginTop: 4 }}>Tvůj parťák pro duševní pohodu</div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.card, borderRadius: 99, padding: 4, border: `1px solid ${T.border}` }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 99, border: "none", background: mode === m ? T.accent : "transparent", color: mode === m ? "#fff" : T.t2, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
              {m === "login" ? "Přihlásit" : "Registrovat"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required autoComplete="email"
            style={{ padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, color: T.t1, fontSize: 15, fontFamily: "inherit", outline: "none" }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Heslo" required autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6}
            style={{ padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, color: T.t1, fontSize: 15, fontFamily: "inherit", outline: "none" }} />

          {error && (
            <div style={{ padding: "10px 14px", background: T.redDim, border: `1px solid ${T.red}30`, borderRadius: 12, color: T.red, fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            style={{ padding: "14px 0", background: `linear-gradient(135deg, ${T.accent}, #E06520)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 800, cursor: submitting ? "wait" : "pointer", fontFamily: "inherit", opacity: submitting ? 0.7 : 1, transition: "opacity .2s" }}>
            {submitting ? "⏳" : mode === "login" ? "Přihlásit se" : "Vytvořit účet"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, color: T.t3, fontSize: 12 }}>
          {mode === "login" ? "Nemáš účet? " : "Už máš účet? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: T.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
            {mode === "login" ? "Registruj se" : "Přihlásit se"}
          </button>
        </div>
      </div>
    </div>
  );
}
