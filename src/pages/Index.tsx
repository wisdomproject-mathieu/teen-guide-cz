import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCloudData } from "@/hooks/useCloudData";
import { usePremium } from "@/hooks/usePremium";
import Onboarding from "@/components/Onboarding";
import InAppNotifications from "@/components/InAppNotifications";
import PaywallOverlay from "@/components/PaywallOverlay";
import { useAuth } from "@/hooks/useAuth";
import { getRecommendations } from "@/data/speeches";
import monkeyHero from "@/assets/monkey-hero.png";
import monkeySad from "@/assets/monkey-sad.png";
import monkeyAngry from "@/assets/monkey-angry.png";
import monkeyZen from "@/assets/monkey-zen.png";
import monkeyAnxious from "@/assets/monkey-anxious.png";
import monkeySos from "@/assets/monkey-sos.png";
import monkeyGreat from "@/assets/monkey-great.png";
import monkeyMeh from "@/assets/monkey-meh.png";
import monkeyAwful from "@/assets/monkey-awful.png";
import monkeySchool from "@/assets/monkey-school.png";
import monkeySiblings from "@/assets/monkey-siblings.png";
import monkeyParents from "@/assets/monkey-parents.png";
import monkeyFriends from "@/assets/monkey-friends.png";
import monkeySocial from "@/assets/monkey-social.png";
import monkeyIdentity from "@/assets/monkey-identity.png";
import monkeyLonely from "@/assets/monkey-lonely.png";
import monkeyOther from "@/assets/monkey-other.png";
import monkeyWarrior from "@/assets/monkey-warrior.png";
import monkeyMusic from "@/assets/monkey-music.png";
import monkeyGamer from "@/assets/monkey-gamer.png";
import monkeyAngryMood from "@/assets/monkey-angry-mood.png";
import monkeyAnxiousMood from "@/assets/monkey-anxious-mood.png";
import monkeyPumped from "@/assets/monkey-pumped.png";
import monkeySadMood from "@/assets/monkey-sad-mood.png";
import monkeyChat from "@/assets/monkey-chat.png";
import monkeyProfile from "@/assets/monkey-profile.png";
import monkeyQuests from "@/assets/monkey-quests.png";
import monkeySkinKing from "@/assets/monkey-skin-king.png";
import monkeySkinAstro from "@/assets/monkey-skin-astro.png";
import monkeySkinNinja from "@/assets/monkey-skin-ninja.png";
import monkeySkinFire from "@/assets/monkey-skin-fire.png";
import monkeySkinDiamond from "@/assets/monkey-skin-diamond.png";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const MOOD_MONKEY: Record<string, string> = {
  great: monkeyGreat, pumped: monkeyPumped, meh: monkeyMeh,
  angry: monkeyAngryMood, sad: monkeySadMood, anxious: monkeyAnxiousMood,
  awful: monkeyAwful,
};
const EMO_MONKEY: Record<string, string> = {
  anger: monkeyAngry, sadness: monkeySad, anxiety: monkeyAnxious,
  fear: monkeyAnxious, lonely: monkeySad, overwhelm: monkeyZen, all: monkeyHero,
  positive: monkeyGreat,
};

const T={bg:"#0A0C13",accent:"#FF7A2F",accentDim:"rgba(255,122,47,0.12)",teal:"#00D4AA",tealDim:"rgba(0,212,170,0.12)",red:"#FF3B5C",redDim:"rgba(255,59,92,0.12)",blue:"#4A8FFF",purple:"#A855F7",t1:"#F0EEFF",t2:"#9298B4",t3:"#5A6080",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)"};

// Speeches are in src/data/speeches.ts

// Ordered from worst → best for slider (index 0 = left/worst, 6 = right/best)
const MOODS=[
  {id:"awful",label:"Na dně",sub:"Nevím co dál",color:T.red,emoji:"💀"},
  {id:"anxious",label:"Úzkostnej/á",sub:"Svírá mě to",color:"#FF7A2F",emoji:"😰"},
  {id:"sad",label:"Smutnej/á",sub:"Bolí to uvnitř",color:T.purple,emoji:"😢"},
  {id:"angry",label:"Naštvanej/á",sub:"Všechno mě sere",color:T.red,emoji:"😡"},
  {id:"meh",label:"Tak nějak",sub:"Nic moc, nic málo",color:T.accent,emoji:"😐"},
  {id:"pumped",label:"Nabitej/á",sub:"Ready na cokoliv",color:T.blue,emoji:"💪"},
  {id:"great",label:"Skvěle",sub:"Mám energii, svět je můj",color:T.teal,emoji:"🔥"},
];

const REASON_MONKEY: Record<string, string> = {
  school: monkeySchool, siblings: monkeySiblings, parents: monkeyParents,
  friends: monkeyFriends, social: monkeySocial, identity: monkeyIdentity,
  lonely: monkeyLonely, other: monkeyOther,
};
const REASONS=[
  {id:"school",label:"Škola",sub:"Zkoušky, učitelé, tlak"},
  {id:"siblings",label:"Sourozenci",sub:"Hádky, žárlivost"},
  {id:"parents",label:"Rodiče",sub:"Nerozumí mi, tlačí"},
  {id:"friends",label:"Kamarádi",sub:"Zrada, vyloučení, tlak"},
  {id:"social",label:"Sítě & mobil",sub:"Scrollování, srovnávání"},
  {id:"identity",label:"Já sám/a",sub:"Kdo jsem? Tělo, identita"},
  {id:"lonely",label:"Osamělost",sub:"Nikdo mě nechápe"},
  {id:"other",label:"Jiné",sub:"Něco jiného"},
];

const audioCache = new Map<string, string>();
const MAX_CACHE = 20;
function setCachedAudio(key: string, url: string) {
  if (audioCache.size >= MAX_CACHE) {
    const firstKey = audioCache.keys().next().value;
    if (firstKey) { URL.revokeObjectURL(audioCache.get(firstKey)!); audioCache.delete(firstKey); }
  }
  audioCache.set(key, url);
}

// ── SPEECH PLAYER ──
function SpeechPlayer({text, label, speechId, emotion, intensity, onComplete}: {text: string; label: string; speechId: string; emotion: string; intensity?: number; onComplete?:()=>void}) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const play = async () => {
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    const cacheKey = `${speechId}-i${intensity||3}`;
    let audioUrl = audioCache.get(cacheKey);
    if (!audioUrl) {
      setLoading(true);
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ text, emotion, intensity: intensity || 3 }),
        });
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (data.fallback || data.error) throw new Error(data.error || "TTS unavailable");
        }
        if (!response.ok) throw new Error(`TTS failed`);
        const audioBlob = await response.blob();
        audioUrl = URL.createObjectURL(audioBlob);
        setCachedAudio(cacheKey, audioUrl);
      } catch {
        setLoading(false);
        const u = new SpeechSynthesisUtterance(text); u.lang = "cs-CZ"; u.rate = 0.82;
        u.onend = () => setPlaying(false); u.onerror = () => setPlaying(false);
        setPlaying(true); window.speechSynthesis.speak(u); return;
      }
      setLoading(false);
    }
    const audio = new Audio(audioUrl); audioRef.current = audio;
    audio.onended = () => { setPlaying(false); onComplete?.(); }; audio.onerror = () => setPlaying(false);
    setPlaying(true); audio.play();
  };
  useEffect(() => { return () => { audioRef.current?.pause(); window.speechSynthesis.cancel(); }; }, []);
  return (
    <button onClick={play} disabled={loading} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:12,cursor:loading?"wait":"pointer",fontFamily:"inherit",width:"100%"}}>
      <span style={{fontSize:18,color:T.accent}}>{loading?"⏳":playing?"■":"▶"}</span>
      <span style={{color:T.t1,fontSize:13,fontWeight:600}}>{loading?"Generuji hlas...":label}</span>
      {playing && <span style={{color:T.accent,fontSize:11,marginLeft:"auto"}}>🔊 Hraje</span>}
    </button>
  );
}

// ── BREATHING ──
function BreathingExercise({type="box", onComplete}: {type?: string; onComplete?:()=>void}) {
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const timerRef = useRef<any>(null);
  const phaseRef = useRef(0);
  const patterns: Record<string, any> = {
    box:{name:"Box",phases:[{label:"Nádech",dur:4,color:T.teal},{label:"Drž",dur:4,color:T.blue},{label:"Výdech",dur:4,color:T.accent},{label:"Drž",dur:4,color:T.purple}]},
    sleep:{name:"4-7-8",phases:[{label:"Nádech",dur:4,color:T.teal},{label:"Drž",dur:7,color:T.blue},{label:"Výdech",dur:8,color:T.accent}]},
  };
  const pat = patterns[type] || patterns.box;
  const stop = useCallback(() => {clearInterval(timerRef.current);setActive(false);setPhase("ready");setCount(0);phaseRef.current=0}, []);
  const cyclesRef = useRef(0);
  const start = () => {
    if(active){stop();return} setActive(true);phaseRef.current=0;cyclesRef.current=0;
    const p=pat.phases[0];setPhase(p.label);setCount(p.dur);let c=p.dur;
    timerRef.current=setInterval(()=>{c--;if(c<=0){phaseRef.current=(phaseRef.current+1)%pat.phases.length;if(phaseRef.current===0){cyclesRef.current++;if(cyclesRef.current>=3&&!completed){setCompleted(true);onComplete?.()}}const np=pat.phases[phaseRef.current];setPhase(np.label);c=np.dur;setCount(np.dur)}else setCount(c)},1000);
  };
  useEffect(()=>()=>clearInterval(timerRef.current),[]);
  const cp = active ? pat.phases[phaseRef.current] : null;
  return (
    <div style={{textAlign:"center",padding:20}}>
      <div style={{fontSize:22,fontWeight:800,color:cp?.color||T.t1,marginBottom:8}}>{active?phase:pat.name}</div>
      <div style={{fontSize:48,fontWeight:900,color:cp?.color||T.accent,marginBottom:16}}>{active?count:"—"}</div>
      <button onClick={start} style={{padding:"10px 32px",background:active?T.redDim:T.tealDim,border:`1px solid ${active?T.red:T.teal}30`,borderRadius:99,color:active?T.red:T.teal,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{active?"Stop":"Start"}</button>
    </div>
  );
}

// ── DAILY QUESTS & SKINS ──
const MONKEY_SKINS = [
  { id: "default", name: "OG Opice", img: monkeyHero, xpNeeded: 0, color: T.accent, desc: "Tvůj základní skin" },
  { id: "fire", name: "Fire Opice 🔥", img: monkeySkinFire, xpNeeded: 50, color: "#FF3B5C", desc: "Odemkni za 50 XP" },
  { id: "ninja", name: "Ninja Opice 🥷", img: monkeySkinNinja, xpNeeded: 150, color: "#00D4AA", desc: "Odemkni za 150 XP" },
  { id: "astro", name: "Astro Opice 🚀", img: monkeySkinAstro, xpNeeded: 300, color: "#4A8FFF", desc: "Odemkni za 300 XP" },
  { id: "diamond", name: "Diamond Opice 💎", img: monkeySkinDiamond, xpNeeded: 500, color: "#A855F7", desc: "Odemkni za 500 XP" },
  { id: "king", name: "King Opice 👑", img: monkeySkinKing, xpNeeded: 1000, color: "#FFD700", desc: "Odemkni za 1000 XP" },
];

const DAILY_QUESTS = [
  { id: "checkin", label: "Denní check-in", desc: "Řekni jak se cítíš", xp: 10, icon: "🎯" },
  { id: "breathe", label: "Dýchací cvičení", desc: "Dokonči 1 dýchací session", xp: 15, icon: "🌬️" },
  { id: "diary", label: "Zápis do deníku", desc: "Napiš aspoň 1 větu", xp: 10, icon: "📝" },
  { id: "speech", label: "Poslech řeči", desc: "Přehraj si 1 motivační řeč", xp: 15, icon: "🔊" },
  { id: "grounding", label: "5-4-3-2-1 Reset", desc: "Dokonči grounding cvičení", xp: 20, icon: "🧘" },
  { id: "streak3", label: "3denní streak", desc: "Přijď 3 dny v řadě", xp: 30, icon: "🔥" },
  { id: "streak7", label: "7denní streak", desc: "Přijď 7 dní v řadě", xp: 75, icon: "⚡" },
];

// ── WARRIOR RANKS ──
const WARRIOR_RANKS = [
  { id: "novacek", name: "Opičí nováček 🐒", minXp: 0, color: T.t2, desc: "Každá legenda začala tady" },
  { id: "bojovnik", name: "Opičí bojovník ⚔️", minXp: 100, color: T.accent, desc: "Ukazuješ sílu" },
  { id: "valecnik", name: "Opičí válečník 🛡️", minXp: 300, color: T.teal, desc: "Nic tě nezastaví" },
  { id: "legenda", name: "Opičí legenda 👑", minXp: 750, color: "#FFD700", desc: "Jsi inspirace" },
];
function getWarriorRank(xp: number) {
  return [...WARRIOR_RANKS].reverse().find(r => xp >= r.minXp) || WARRIOR_RANKS[0];
}

function QuestsTab({ xp, completedQuests, onEquipSkin, equippedSkin }: { xp: number; completedQuests: string[]; onEquipSkin: (id: string) => void; equippedSkin: string }) {
  const [view, setView] = useState<"quests" | "skins">("quests");
  const todayKey = new Date().toISOString().split("T")[0];
  const todayCompleted = completedQuests.filter(q => q.startsWith(todayKey)).map(q => q.split(":")[1]);

  const rank = getWarriorRank(xp);
  const nextRank = WARRIOR_RANKS.find(r => r.minXp > xp);
  const nextSkin = MONKEY_SKINS.find(s => s.xpNeeded > xp);
  const rankProgress = nextRank ? ((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100 : 100;

  return (
    <div style={{ paddingTop: 8 }} className="anim-fadeUp">
      {/* Header — Warrior Rank */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: 16, background: `linear-gradient(135deg, ${rank.color}15, ${T.purple}08)`, borderRadius: 20, border: `1px solid ${rank.color}20` }}>
        <img src={monkeyQuests} alt="" className="anim-monkeyBob" style={{ width: 64, height: 64, objectFit: "contain" }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: rank.color, fontSize: 18, fontWeight: 900 }}>{rank.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div style={{ flex: 1, height: 8, background: T.card, borderRadius: 99, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${rankProgress}%`, background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color || "#FFD700"})`, borderRadius: 99, transition: "width .5s ease" }} />
            </div>
            <span style={{ color: rank.color, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{xp} XP</span>
          </div>
          {nextRank && <div style={{ color: T.t3, fontSize: 11, marginTop: 4 }}>Další rank: {nextRank.name} za {nextRank.minXp} XP</div>}
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[{ id: "quests" as const, label: "⚔️ Výzvy" }, { id: "skins" as const, label: "🐵 Skiny" }].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} className="reason-card" style={{ flex: 1, padding: "10px 0", background: view === t.id ? T.accentDim : T.card, border: `1px solid ${view === t.id ? T.accent : T.border}`, borderRadius: 14, color: view === t.id ? T.accent : T.t2, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>

      {view === "quests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ color: T.t1, fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Denní mise</div>
          {DAILY_QUESTS.slice(0, 5).map((q, i) => {
            const done = todayCompleted.includes(q.id);
            return (
              <div key={q.id} className={`reason-card anim-fadeUp anim-d${i + 1}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: done ? `${T.teal}08` : T.card, border: `1px solid ${done ? `${T.teal}30` : T.border}`, borderRadius: 14 }}>
                <span style={{ fontSize: 24, filter: done ? "none" : "grayscale(0.5)" }}>{q.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: done ? T.teal : T.t1, fontSize: 14, fontWeight: 700, textDecoration: done ? "line-through" : "none" }}>{q.label}</div>
                  <div style={{ color: T.t3, fontSize: 11 }}>{q.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: done ? T.teal : T.accent, fontSize: 14, fontWeight: 800 }}>+{q.xp}</span>
                  <span style={{ fontSize: 11 }}>XP</span>
                  {done && <span style={{ color: T.teal, fontSize: 16, marginLeft: 4 }}>✓</span>}
                </div>
              </div>
            );
          })}

          <div style={{ color: T.t1, fontSize: 16, fontWeight: 800, marginTop: 12, marginBottom: 4 }}>Streak výzvy</div>
          {DAILY_QUESTS.slice(5).map((q, i) => {
            const done = todayCompleted.includes(q.id);
            return (
              <div key={q.id} className={`reason-card anim-fadeUp anim-d${i + 1}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: done ? `${T.accent}08` : T.card, border: `1px solid ${done ? `${T.accent}30` : T.border}`, borderRadius: 14 }}>
                <span style={{ fontSize: 24 }}>{q.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: done ? T.accent : T.t1, fontSize: 14, fontWeight: 700 }}>{q.label}</div>
                  <div style={{ color: T.t3, fontSize: 11 }}>{q.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: T.accent, fontSize: 14, fontWeight: 800 }}>+{q.xp}</span>
                  <span style={{ fontSize: 11 }}>XP</span>
                  {done && <span style={{ color: T.teal, fontSize: 16, marginLeft: 4 }}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "skins" && (
        <div>
          <div style={{ color: T.t2, fontSize: 13, marginBottom: 12 }}>Sbírej XP plněním misí a odemykej nový skiny!</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MONKEY_SKINS.map((s, i) => {
              const unlocked = xp >= s.xpNeeded;
              const equipped = equippedSkin === s.id;
              return (
                <button key={s.id} onClick={() => unlocked && onEquipSkin(s.id)} className={`reason-card anim-fadeUp anim-d${i + 1}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 16, background: equipped ? `${s.color}15` : T.card, border: `1px solid ${equipped ? s.color : unlocked ? `${s.color}30` : T.border}`, borderRadius: 16, cursor: unlocked ? "pointer" : "default", fontFamily: "inherit", opacity: unlocked ? 1 : 0.5, position: "relative" }}>
                  {equipped && <div style={{ position: "absolute", top: 8, right: 8, background: s.color, color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>EQUIPPED</div>}
                  <img src={s.img} alt={s.name} style={{ width: 72, height: 72, objectFit: "contain", filter: unlocked ? "none" : "grayscale(1) brightness(0.5)" }} loading="lazy" />
                  <div style={{ color: unlocked ? T.t1 : T.t3, fontSize: 13, fontWeight: 800, textAlign: "center" }}>{s.name}</div>
                  {!unlocked && <div style={{ color: T.t3, fontSize: 11 }}>🔒 {s.xpNeeded} XP</div>}
                  {unlocked && !equipped && <div style={{ color: s.color, fontSize: 11, fontWeight: 700 }}>Klikni = nasaď</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MONKEY CHAT (AI) ──
type ChatMsg = { role: "user" | "assistant"; content: string };

function MonkeyChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/monkey-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ messages: allMsgs }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Něco se pokazilo" }));
        setMessages(prev => [...prev, { role: "assistant", content: err.error || "Opičák teď nemůže, zkus to znovu 🐵" }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const snap = assistantSoFar;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snap } : m);
                return [...prev, { role: "assistant", content: snap }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (!assistantSoFar) {
        setMessages(prev => [...prev, { role: "assistant", content: "Opičák se zasekl... zkus to znovu 🐵" }]);
      }
    }
    setIsLoading(false);
  };

  const quickStarters = ["Mám blbej den 😒", "Naštval mě kámoš", "Mám strach ze zkoušky", "Cítím se sám/a"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",paddingTop:8}}>
      <div className="anim-fadeUp" style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0 12px",borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
        <img src={monkeyChat} alt="" style={{width:48,height:48,objectFit:"contain",borderRadius:14}} />
        <div>
          <div style={{color:T.t1,fontSize:18,fontWeight:900}}>Opičák</div>
          <div style={{color:T.teal,fontSize:11,fontWeight:600}}>● Online — vždycky tu pro tebe</div>
        </div>
      </div>
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}}>
        {messages.length === 0 && (
          <div className="anim-fadeUp" style={{textAlign:"center",padding:"32px 16px"}}>
            <img src={monkeyChat} alt="" className="anim-float" style={{width:80,height:80,objectFit:"contain",margin:"0 auto 16px"}} />
            <div style={{color:T.t1,fontSize:16,fontWeight:800,marginBottom:6}}>Yo! Jsem Opičák 🐵</div>
            <div style={{color:T.t2,fontSize:13,marginBottom:20,lineHeight:1.5}}>Tvůj AI brácha. Řekni mi co tě trápí, nebo prostě pokecej.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              {quickStarters.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="reason-card" style={{padding:"8px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:99,color:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,padding:"2px 0"}} className="anim-fadeUp">
            {m.role === "assistant" && <img src={monkeyChat} alt="" style={{width:28,height:28,objectFit:"contain",borderRadius:8,flexShrink:0,marginTop:4}} />}
            <div style={{
              maxWidth:"78%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"?`linear-gradient(135deg, ${T.accent}, ${T.accent}CC)`:T.card,
              border:m.role==="user"?"none":`1px solid ${T.border}`,
              color:m.role==="user"?"#fff":T.t1,fontSize:14,lineHeight:1.5,fontWeight:500,
              whiteSpace:"pre-wrap",wordBreak:"break-word",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.role !== "assistant" && (
          <div style={{display:"flex",gap:8,padding:"2px 0"}} className="anim-fadeUp">
            <img src={monkeyChat} alt="" style={{width:28,height:28,objectFit:"contain",borderRadius:8}} />
            <div style={{padding:"10px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:"16px 16px 16px 4px",color:T.t2,fontSize:14}}>
              <span className="anim-float">🐵</span> přemýšlím...
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:8,padding:"8px 0 4px",borderTop:`1px solid ${T.border}`}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Napiš opičákovi..."
          style={{flex:1,padding:"12px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:99,color:T.t1,fontSize:14,fontFamily:"inherit",outline:"none"}}
        />
        <button onClick={send} disabled={isLoading || !input.trim()}
          style={{width:44,height:44,borderRadius:"50%",background:input.trim()?T.accent:`${T.accent}30`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()?"pointer":"default",fontSize:18,flexShrink:0,transition:"all .2s"}}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ── MOOD INSIGHTS CHARTS (recharts) ──
function MoodInsightsCharts({ moodLog }: { moodLog: any[] }) {
  const [range, setRange] = useState<"week" | "month">("week");
  const moodScore: Record<string, number> = { great: 5, pumped: 4, meh: 3, angry: 2, sad: 2, anxious: 1, awful: 0 };
  const moodColors: Record<string, string> = { great: T.teal, pumped: T.blue, meh: T.accent, angry: T.red, sad: T.purple, anxious: "#FF7A2F", awful: T.red };

  // Build daily trend data
  const daysBack = range === "week" ? 7 : 30;
  const trendData = [];
  for (let d = daysBack - 1; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const ds = date.toLocaleDateString("cs-CZ");
    const dayLogs = moodLog.filter((l: any) => l.ts.startsWith(ds));
    const avg = dayLogs.length > 0
      ? dayLogs.reduce((s: number, l: any) => s + (moodScore[l.mood.id] ?? 3), 0) / dayLogs.length
      : null;
    const label = range === "week"
      ? ["Ne","Po","Út","St","Čt","Pá","So"][date.getDay()]
      : `${date.getDate()}.${date.getMonth()+1}`;
    trendData.push({ name: label, score: avg, count: dayLogs.length });
  }

  // Mood distribution pie data
  const counts: Record<string, number> = {};
  const filteredLogs = range === "week"
    ? moodLog.filter(l => { const d = new Date(); d.setDate(d.getDate() - 7); return new Date(l.ts.replace(/(\d+)\.\s*(\d+)\.\s*(\d+)/, '$3-$2-$1')) >= d; })
    : moodLog;
  filteredLogs.forEach((l: any) => { counts[l.mood.id] = (counts[l.mood.id] || 0) + 1; });
  const pieData = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({
      name: MOODS.find(m => m.id === id)?.label || id,
      value,
      fill: moodColors[id] || T.accent,
    }));

  // Top reasons
  const reasonCounts: Record<string, number> = {};
  filteredLogs.forEach((l: any) => { if (l.reason) reasonCounts[l.reason.id] = (reasonCounts[l.reason.id] || 0) + 1; });
  const topReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, value]) => ({ name: REASONS.find(r => r.id === id)?.label || id, value, fill: T.accent }));

  // AI insight
  const topMoodEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topMood = MOODS.find(m => m.id === topMoodEntry?.[0]);
  const topReasonEntry = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
  const topReason = REASONS.find(r => r.id === topReasonEntry?.[0]);

  return (
    <>
      {/* Range toggle */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {(["week","month"] as const).map(r => (
          <button key={r} onClick={() => setRange(r)} className="reason-card"
            style={{padding:"6px 14px",background:range===r?T.accentDim:T.card,border:`1px solid ${range===r?T.accent:T.border}`,borderRadius:99,color:range===r?T.accent:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            {r === "week" ? "📅 Týden" : "📆 Měsíc"}
          </button>
        ))}
      </div>

      {/* Mood Trend Line Chart */}
      <div style={{marginBottom:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 8px 8px"}}>
        <div style={{color:T.t1,fontSize:14,fontWeight:700,marginBottom:12,paddingLeft:8}}>Trend nálady</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.accent} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={T.accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{fill:T.t3,fontSize:10}} axisLine={false} tickLine={false} />
            <YAxis domain={[0,5]} tick={{fill:T.t3,fontSize:10}} axisLine={false} tickLine={false} width={20}
              tickFormatter={(v: number) => ["💀","😰","😢","😐","💪","🔥"][v] || ""} />
            <Tooltip
              contentStyle={{background:"#1a1d2e",border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,color:T.t1}}
              formatter={(v: any) => [v !== null ? `${Number(v).toFixed(1)} / 5` : "—", "Skóre"]}
              labelStyle={{color:T.t2}}
            />
            <Area type="monotone" dataKey="score" stroke={T.accent} strokeWidth={2.5} fill="url(#moodGrad)" dot={{r:3,fill:T.accent,stroke:"none"}} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Distribution Bar Chart */}
      <div style={{marginBottom:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 8px 8px"}}>
        <div style={{color:T.t1,fontSize:14,fontWeight:700,marginBottom:12,paddingLeft:8}}>Rozložení nálad</div>
        <ResponsiveContainer width="100%" height={pieData.length * 36 + 16}>
          <BarChart data={pieData} layout="vertical" barCategoryGap={6}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{fill:T.t2,fontSize:12,fontWeight:600}} axisLine={false} tickLine={false} width={75} />
            <Tooltip
              contentStyle={{background:"#1a1d2e",border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,color:T.t1}}
              formatter={(v: any) => [`${v}×`, "Check-iny"]}
              labelStyle={{color:T.t2}}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Reasons */}
      {topReasons.length > 0 && (
        <div style={{marginBottom:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 8px 8px"}}>
          <div style={{color:T.t1,fontSize:14,fontWeight:700,marginBottom:12,paddingLeft:8}}>Nejčastější důvody</div>
          <ResponsiveContainer width="100%" height={topReasons.length * 36 + 16}>
            <BarChart data={topReasons} layout="vertical" barCategoryGap={6}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{fill:T.t2,fontSize:12,fontWeight:600}} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{background:"#1a1d2e",border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,color:T.t1}}
                formatter={(v: any) => [`${v}×`, "Zmíněno"]}
                labelStyle={{color:T.t2}}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} fill={T.teal} fillOpacity={0.8} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI insight summary */}
      <div style={{background:`linear-gradient(135deg, ${T.accent}10, ${T.purple}08)`,border:`1px solid ${T.accent}20`,borderRadius:16,padding:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:18}}>💡</span>
          <span style={{color:T.t1,fontSize:14,fontWeight:700}}>Opičí analýza</span>
        </div>
        <div style={{color:T.t2,fontSize:13,lineHeight:1.6}}>
          Tvoje nejčastější nálada je <span style={{color:topMood?.color||T.accent,fontWeight:700}}>{topMood?.label || "?"}</span>
          {topReason && <>, hlavně kvůli <span style={{color:T.accent,fontWeight:700}}>{topReason.label.toLowerCase()}</span></>}.
          {topMoodEntry && Number(topMoodEntry[1]) >= 3 && <> Zkus se zaměřit na to, co ti pomáhá v těchto momentech. 🐵</>}
        </div>
      </div>
    </>
  );
}

// ── PROFILE TAB (with Mood Insights) ──
function ProfileTab({moodLog, streakCount, userName, avatar, onNameChange, onAvatarClick, onSignOut, diaryEntries, sosContacts, onSaveDiary, onSaveContacts, onCompleteQuest, isPremium, onUpgrade}: {moodLog:any[]; streakCount:number; userName:string; avatar:string|null; onNameChange:(n:string)=>void; onAvatarClick:()=>void; onSignOut:()=>void; diaryEntries:any[]; sosContacts:{id?:string;name:string;phone:string}[]; onSaveDiary:(content:string)=>void; onSaveContacts:(contacts:{id?:string;name:string;phone:string}[])=>void; onCompleteQuest:(id:string)=>void; isPremium:boolean; onUpgrade:()=>void}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [contacts, setContacts] = useState<{id?:string;name:string;phone:string}[]>(sosContacts.length > 0 ? sosContacts : [{name:"",phone:""}]);
  const [diary, setDiary] = useState("");
  const [diarySaved, setDiarySaved] = useState(false);
  const days = ["Po","Út","St","Čt","Pá","So","Ne"];

  // Build calendar based on actual dates, not mood log index
  const calendarWeeks: any[] = [];
  const today = new Date();
  // Show 4 weeks ending today — find the Monday 3 weeks ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 27); // go back ~4 weeks
  // Adjust to Monday
  const dayOfWeek = startDate.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + mondayOffset);

  // Group mood logs by date string
  const moodByDate: Record<string, any> = {};
  moodLog.forEach((l: any) => {
    // Parse the Czech date format "D. M. YYYY, HH:MM:SS"
    const parts = l.ts.match(/(\d+)\.\s*(\d+)\.\s*(\d+)/);
    if (parts) {
      const dateKey = `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      if (!moodByDate[dateKey]) moodByDate[dateKey] = l; // first (most recent) entry for that day
    }
  });

  for (let w = 0; w < 4; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + d);
      const key = cellDate.toISOString().split("T")[0];
      week.push(moodByDate[key] || null);
    }
    calendarWeeks.push(week);
  }

  return (
    <div style={{paddingTop:8}} className="anim-fadeUp">
      {/* Profile header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:16,background:`linear-gradient(135deg, ${T.accent}12, ${T.purple}08)`,borderRadius:20,border:`1px solid ${T.accent}15`}}>
        <button onClick={onAvatarClick} style={{width:72,height:72,borderRadius:"50%",background:avatar?"none":`linear-gradient(135deg, ${T.accent}30, ${T.purple}30)`,border:`2px solid ${T.accent}50`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0,padding:0}}>
          {avatar ? <img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <img src={monkeyProfile} alt="" style={{width:60,height:60,objectFit:"contain"}}/>}
        </button>
        <div style={{flex:1}}>
          <input value={userName} onChange={e=>onNameChange(e.target.value)} placeholder="Tvoje jméno…"
            style={{background:"transparent",border:"none",outline:"none",color:T.t1,fontFamily:"inherit",fontSize:18,fontWeight:800,width:"100%"}} />
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}>
            <span style={{color:T.accent,fontSize:28,fontWeight:900}}>{streakCount}</span>
            <span style={{color:T.t2,fontSize:13}}>dní v řadě 🔥</span>
          </div>
        </div>
      </div>

      {/* Section pills */}
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
        {[{id:"overview",label:"📊 Přehled"},{id:"insights",label:"🧠 Insights"},{id:"contacts",label:"📞 SOS"},{id:"diary",label:"📝 Deník"},{id:"calendar",label:"📅 Historie"}].map(s=>
          <button key={s.id} onClick={()=>setActiveSection(s.id)} className="reason-card" style={{padding:"8px 14px",background:activeSection===s.id?T.accentDim:T.card,border:`1px solid ${activeSection===s.id?T.accent:T.border}`,borderRadius:99,color:activeSection===s.id?T.accent:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{s.label}</button>
        )}
      </div>

      {activeSection==="overview" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,textAlign:"center"}}>
              <div style={{color:T.accent,fontSize:28,fontWeight:900}}>{moodLog.length}</div>
              <div style={{color:T.t2,fontSize:12}}>Check-inů</div>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,textAlign:"center"}}>
              <div style={{color:T.accent,fontSize:28,fontWeight:900}}>{streakCount}🔥</div>
              <div style={{color:T.t2,fontSize:12}}>Streak</div>
            </div>
          </div>
          {moodLog.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={{color:T.t1,fontSize:14,fontWeight:700,marginBottom:8}}>Poslední nálady</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {moodLog.slice(0,12).map((l:any,i:number) => {
                  const m = MOODS.find(x=>x.id===l.mood.id);
                  return <div key={i} style={{padding:"4px 10px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,color:T.t2}}>{m?.label} {l.ts.split(",")[1]?.trim()}</div>;
                })}
              </div>
            </div>
          )}
          <div style={{background:T.accentDim,border:`1px solid ${T.accent}20`,borderRadius:14,padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <img src={monkeyProfile} alt="" style={{width:28,height:28,objectFit:"contain"}}/>
              <span style={{color:T.t1,fontSize:14,fontWeight:700}}>Tip od opice</span>
            </div>
            <div style={{color:T.t2,fontSize:13,lineHeight:1.6}}>Každý den, kdy otevřeš appku a řekneš jak se cítíš, je den, kdy ovládáš svou opici. 🐵</div>
          </div>
        </div>
      )}

      {activeSection==="insights" && (
        <div>
          <div style={{color:T.t1,fontSize:16,fontWeight:800,marginBottom:12}}>Mood Insights 🧠</div>
          {moodLog.length < 3 ? (
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24,textAlign:"center"}}>
              <img src={monkeyProfile} alt="" className="anim-float" style={{width:60,height:60,objectFit:"contain",margin:"0 auto 12px"}} />
              <div style={{color:T.t2,fontSize:14,lineHeight:1.6}}>Potřebuji aspoň 3 check-iny, abych ti ukázal insights. Pokračuj! 🐵</div>
            </div>
          ) : (
            <MoodInsightsCharts moodLog={moodLog} />
          )}
        </div>
      )}

      {activeSection==="contacts" && (
        <div>
          <div style={{color:T.t2,fontSize:13,marginBottom:16}}>Tvoje bezpečné čísla. Když bude zle.</div>
          {contacts.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={c.name} onChange={(e)=>{const n=[...contacts];n[i].name=e.target.value;setContacts(n)}} placeholder="Jméno" style={{flex:1,padding:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
              <input value={c.phone} onChange={(e)=>{const n=[...contacts];n[i].phone=e.target.value;setContacts(n)}} placeholder="Telefon" style={{width:120,padding:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
            </div>
          ))}
          <button onClick={()=>setContacts(p=>[...p,{name:"",phone:""}])} style={{padding:"8px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginRight:8}}>+ Přidat</button>
          <button onClick={()=>{onSaveContacts(contacts)}} style={{padding:"8px 16px",background:T.tealDim,border:`1px solid ${T.teal}30`,borderRadius:10,color:T.teal,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:16}}>💾 Uložit</button>
          <div style={{padding:14,background:T.redDim,border:`1px solid ${T.red}20`,borderRadius:14}}>
            <div style={{color:T.red,fontSize:15,fontWeight:800}}>📞 Linka bezpečí: 116 111</div>
            <div style={{color:T.t2,fontSize:12}}>Nonstop, zdarma, anonymně</div>
          </div>
        </div>
      )}

      {activeSection==="diary" && (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span>🔒</span><span style={{color:T.t2,fontSize:13}}>Jen pro tebe. Nikdo jiný to neuvidí.</span>
          </div>
          <textarea value={diary} onChange={(e)=>setDiary(e.target.value)} rows={8} placeholder="Vysyp hlavu... co ti běží hlavou?" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,color:T.t1,padding:16,fontSize:14,fontFamily:"inherit",resize:"none",lineHeight:1.7}}/>
          <button onClick={()=>{if(diary.trim()){onSaveDiary(diary);onCompleteQuest("diary");setDiary("");setDiarySaved(true);setTimeout(()=>setDiarySaved(false),2000)}}} style={{marginTop:8,padding:"10px 24px",background:T.tealDim,border:`1px solid ${T.teal}30`,borderRadius:10,color:T.teal,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {diarySaved ? "✓ Uloženo!" : "💾 Uložit zápis"}
          </button>
          {diaryEntries.length > 0 && (
            <div style={{marginTop:16}}>
              <div style={{color:T.t1,fontSize:14,fontWeight:700,marginBottom:8}}>Předchozí zápisky</div>
              {(() => {
                // Free users: only entries from last 7 days
                const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
                const visibleEntries = isPremium ? diaryEntries : diaryEntries.filter((e: any) => new Date(e.created_at) >= sevenDaysAgo);
                const hiddenCount = diaryEntries.length - visibleEntries.length;
                return (
                  <>
                    {visibleEntries.slice(0,10).map((e:any,i:number) => (
                      <div key={e.id||i} style={{padding:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8}}>
                        <div style={{color:T.t2,fontSize:11,marginBottom:4}}>{new Date(e.created_at).toLocaleString("cs-CZ")}</div>
                        <div style={{color:T.t1,fontSize:13,lineHeight:1.5}}>{e.content}</div>
                      </div>
                    ))}
                    {hiddenCount > 0 && (
                      <button onClick={onUpgrade} style={{width:"100%",padding:14,background:`${T.accent}08`,border:`1px dashed ${T.accent}40`,borderRadius:12,color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
                        🔒 +{hiddenCount} starších zápisů · Odemkni Premium
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {activeSection==="calendar" && (
        <div>
          <div style={{color:T.t2,fontSize:13,marginBottom:12}}>Tvoje nálady za poslední dny</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
            {days.map(d=><div key={d} style={{textAlign:"center",color:T.t3,fontSize:11,fontWeight:600,padding:4}}>{d}</div>)}
          </div>
          {calendarWeeks.map((week:any[],wi:number)=>(
            <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
              {week.map((day:any,di:number)=>{
                const m = day ? MOODS.find(x=>x.id===day.mood.id) : null;
                return <div key={di} style={{aspectRatio:"1",borderRadius:8,background:m?`${m.color}20`:T.card,border:`1px solid ${m?`${m.color}30`:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                  {m && <img src={MOOD_MONKEY[m.id]} alt="" style={{width:20,height:20,objectFit:"contain"}}/>}
                </div>;
              })}
            </div>
          ))}
          {moodLog.length === 0 && <div style={{color:T.t3,fontSize:13,textAlign:"center",padding:20}}>Zatím žádné záznamy 🐵</div>}
        </div>
      )}

      {/* Sign out button */}
      <button onClick={onSignOut} style={{marginTop:24,padding:"12px 0",width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,color:T.red,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Odhlásit se
      </button>
    </div>
  );
}

// ── XP POPUP ──
function XpPopup({ xp, label, onDone }: { xp: number; label: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10000,pointerEvents:"none",textAlign:"center",animation:"xpPopIn .4s cubic-bezier(.36,1.1,.3,1) both"}}>
      <div style={{fontSize:48,fontWeight:900,color:T.accent,textShadow:`0 0 30px ${T.accent}80, 0 0 60px ${T.accent}40`,animation:"xpFloat 2s ease-out both"}}>+{xp} XP</div>
      <div style={{fontSize:16,fontWeight:700,color:T.t1,marginTop:4,opacity:0.9}}>{label}</div>
    </div>
  );
}

// ── LEVEL UP CELEBRATION ──
function LevelUpOverlay({ level, skin, onDone }: { level: number; skin?: typeof MONKEY_SKINS[0] | null; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div onClick={onDone} style={{position:"fixed",inset:0,zIndex:10001,background:"rgba(0,0,0,0.85)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,cursor:"pointer",animation:"fadeIn .3s ease-out both"}}>
      {/* Particles */}
      {Array.from({length:20}).map((_,i) => (
        <div key={i} style={{position:"absolute",width:8,height:8,borderRadius:"50%",background:[T.accent,T.teal,T.purple,"#FFD700",T.red][i%5],top:"50%",left:"50%",animation:`particle${i%4} ${1.5+Math.random()}s ease-out both`,animationDelay:`${Math.random()*0.3}s`,opacity:0}} />
      ))}
      <div style={{fontSize:64,animation:"bounceIn .5s cubic-bezier(.36,1.1,.3,1) both"}}>🎉</div>
      <div style={{fontSize:32,fontWeight:900,color:T.accent,textShadow:`0 0 20px ${T.accent}60`,animation:"bounceIn .5s cubic-bezier(.36,1.1,.3,1) both",animationDelay:".1s"}}>LEVEL {level}!</div>
      {skin && (
        <div style={{animation:"bounceIn .6s cubic-bezier(.36,1.1,.3,1) both",animationDelay:".3s",textAlign:"center"}}>
          <div style={{fontSize:14,color:T.teal,fontWeight:700,marginBottom:8}}>🔓 Nový skin odemčen!</div>
          <img src={skin.img} alt={skin.name} style={{width:100,height:100,objectFit:"contain",filter:`drop-shadow(0 0 20px ${skin.color}60)`,animation:"float 2s ease-in-out infinite"}} />
          <div style={{color:T.t1,fontSize:16,fontWeight:800,marginTop:8}}>{skin.name}</div>
        </div>
      )}
      <div style={{color:T.t3,fontSize:12,marginTop:12,animation:"fadeIn .5s ease-out both",animationDelay:".5s"}}>Klikni kamkoliv</div>
    </div>
  );
}

// ── SOS CRISIS SPEECHES ──
const SOS_SPEECHES = [
  {id:"sos1",icon:"🔥",title:"Zastav se. Dýchej.",src:"Jocko Willink",color:T.red,text:"Hele. Zastav se. Cokoli se teď děje — přežiješ to. Jocko Willink říká: 'Dobře.' Je to těžký? Dobře. To znamená, že rosteš. Tvůj mozek teď běží na autopilotu — amygdala řídí. Ale ty jsi silnější. Nadechni se. Pomalu. Čtyři sekundy. A teď vydechni. Jsi tady. Jsi v bezpečí. A tohle přejde."},
  {id:"sos2",icon:"💎",title:"Diamanty vznikají pod tlakem.",src:"Carl Jung",color:T.blue,text:"Víš jak vznikají diamanty? Pod obrovským tlakem a žárem. Právě teď jsi v tom tlaku. A možná to vypadá, že to nepřežiješ. Ale přežiješ. Jung říkal: z temnoty se rodí světlo. Každý velký člověk prošel tímhle. Každý. A ty taky projdeš."},
  {id:"sos3",icon:"🧠",title:"Tvůj mozek tě klame.",src:"Neurověda",color:T.accent,text:"Víš co se teď děje? Tvůj mozek spustil fight-or-flight. Kortizol, adrenalin — všechno jede na plný. Ale tady není žádný tygr. Je to chemie. A chemie opadne. Za 6 minut bude líp. Za hodinu bude jinak. Za den budeš silnější. Drž se."},
  {id:"sos4",icon:"⚔",title:"Přežil jsi 100% špatných dnů.",src:"Statistika",color:T.purple,text:"Hele, fakt. Podívej se zpátky. Každý jeden špatný den, co jsi měl — přežil jsi. Stoprocentní úspěšnost. Tohle není výjimka. Tohle je další den, který přežiješ. A jednou se na něj podíváš zpátky a řekneš: 'Jo, to mě posílilo.'"},
  {id:"sos5",icon:"🐵",title:"Opice křičí. Ty ne.",src:"Monkey Mind",color:T.accent,text:"Ta opice v tvé hlavě teď řve. Skáče. Panikuje. Ale ty — ty nejsi opice. Ty jsi ten, kdo ji pozoruje. A pozorovatel má vždycky kontrolu. Nech opici řvát. Ty se nadechni. A počkej. Opice se unaví. Ty ne."},
  {id:"sos6",icon:"🌊",title:"Vlna přijde a odejde.",src:"Mindfulness",color:T.teal,text:"Představ si, že stojíš v moři. Přišla obrovská vlna. Ale ty jsi kotva. Vlna přijde, zasáhne tě — a odejde. Vždycky odejde. Tvoje emoce je vlna. Silná, brutální, ale dočasná. Stůj pevně. Vlna odchází."},
  {id:"sos7",icon:"🦁",title:"Odvaha = strach + akce.",src:"Brené Brown",color:"#FF3B5C",text:"Brené Brown říká: odvaha není absence strachu. Odvaha je cítit strach — a udělat další krok. Právě teď jsi odvážnější než si myslíš. Protože jsi tady. Čteš tohle. Hledáš pomoc. To je odvaha. To je síla."},
  {id:"sos8",icon:"🧬",title:"Jsi pod rekonstrukcí.",src:"Věda",color:T.blue,text:"Tvůj mozek se mezi 12 a 25 kompletně přestavuje. Myelin, synapse, prefrontální kortex — všechno se mění. Takže když se cítíš jako bys šílel — to není bug. To je update. A update bolí. Ale výsledek stojí za to."},
];

// ── SOS MUSIC GENRES ──
const SOS_MUSIC_GENRES = [
  {id:"metal",label:"🤘 Metal",sub:"Nech to ven",prompt:"intense aggressive metal music, heavy drums, distorted guitars, cathartic energy, teen angst, 120bpm",color:T.red},
  {id:"calm",label:"🧘 Klid",sub:"Utiš mysl",prompt:"calm ambient meditation music, soft pads, gentle piano, peaceful atmosphere, healing frequency, 60bpm",color:T.teal},
  {id:"sad",label:"🌧 Smutek",sub:"Pláč je OK",prompt:"emotional melancholic piano music, cinematic sad strings, gentle rain atmosphere, introspective mood, 70bpm",color:T.blue},
  {id:"happy",label:"☀️ Energie",sub:"Nabij se",prompt:"uplifting happy electronic music, positive vibes, synth pop, energetic beats, feel good anthem, 128bpm",color:T.accent},
  {id:"lofi",label:"🎧 Lo-fi",sub:"Chill vibes",prompt:"lofi hip hop beats, jazzy chords, vinyl crackle, relaxing study music, chill beats, 85bpm",color:T.purple},
  {id:"rage",label:"💥 Rage",sub:"Rozbi to",prompt:"aggressive trap beat, heavy 808 bass, dark distorted synths, raw energy, breakbeat drops, 140bpm",color:"#FF3B5C"},
];

function SOSOverlay({onClose}: {onClose:()=>void}) {
  const [screen, setScreen] = useState<"menu"|"speech"|"breathe"|"music">("menu");
  const [sosSpeech, setSosSpeech] = useState<typeof SOS_SPEECHES[0]|null>(null);
  const [musicGenre, setMusicGenre] = useState<typeof SOS_MUSIC_GENRES[0]|null>(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState<string|null>(null);
  const musicAudioRef = useRef<HTMLAudioElement|null>(null);
  const abortRef = useRef<AbortController|null>(null);

  const pickRandomSpeech = () => {
    const s = SOS_SPEECHES[Math.floor(Math.random() * SOS_SPEECHES.length)];
    setSosSpeech(s);
    setScreen("speech");
  };

  const webAudioCtxRef = useRef<AudioContext|null>(null);
  const webAudioNodesRef = useRef<AudioNode[]>([]);

  const stopWebAudio = () => {
    webAudioNodesRef.current.forEach(n => { try { (n as any).stop?.(); (n as any).disconnect?.(); } catch {} });
    webAudioNodesRef.current = [];
    if (webAudioCtxRef.current) { webAudioCtxRef.current.close().catch(() => {}); webAudioCtxRef.current = null; }
  };

  const playWebAudioFallback = (genre: typeof SOS_MUSIC_GENRES[0]) => {
    stopWebAudio();
    const ctx = new AudioContext();
    webAudioCtxRef.current = ctx;
    const nodes: AudioNode[] = [];
    const master = ctx.createGain();
    master.gain.value = 0.25;
    master.connect(ctx.destination);

    // Genre-specific tone configs
    const configs: Record<string, { freqs: number[]; type: OscillatorType; lfoRate: number; filterFreq: number }> = {
      calm:  { freqs: [220, 277, 330], type: "sine", lfoRate: 0.1, filterFreq: 800 },
      sad:   { freqs: [196, 233, 294], type: "triangle", lfoRate: 0.08, filterFreq: 600 },
      happy: { freqs: [262, 330, 392, 523], type: "sine", lfoRate: 0.2, filterFreq: 2000 },
      metal: { freqs: [110, 165, 220], type: "sawtooth", lfoRate: 0.3, filterFreq: 1200 },
      lofi:  { freqs: [196, 247, 294, 370], type: "triangle", lfoRate: 0.05, filterFreq: 500 },
      rage:  { freqs: [82, 123, 165], type: "sawtooth", lfoRate: 0.5, filterFreq: 1800 },
    };
    const cfg = configs[genre.id] || configs.calm;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cfg.filterFreq;
    filter.Q.value = 2;
    filter.connect(master);

    // LFO for gentle movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = cfg.lfoRate;
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    nodes.push(lfo);

    // Pad oscillators with staggered fade-in
    cfg.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = cfg.type;
      osc.frequency.value = freq;
      // Slight detune for richness
      osc.detune.value = (i - 1) * 8;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1 + i * 0.5);
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      nodes.push(osc);
    });

    webAudioNodesRef.current = nodes;
  };

  const playMusic = async (genre: typeof SOS_MUSIC_GENRES[0]) => {
    if (musicAudioRef.current) { musicAudioRef.current.pause(); musicAudioRef.current = null; }
    if (abortRef.current) { abortRef.current.abort(); }
    stopWebAudio();
    setMusicGenre(genre);
    setMusicLoading(true);
    setMusicPlaying(false);
    setMusicError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ prompt: genre.prompt, duration: 22 }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Music generation failed");
      const blob = await response.blob();
      if (blob.size < 1000) throw new Error("Empty audio");
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      musicAudioRef.current = audio;
      audio.loop = true;
      audio.onended = () => setMusicPlaying(false);
      audio.onerror = () => { setMusicPlaying(false); setMusicLoading(false); setMusicError("Přehrávání selhalo"); };
      await audio.play();
      setMusicPlaying(true);
    } catch (e: any) {
      // Fallback: Web Audio API ambient tones
      console.log("API failed, using Web Audio fallback for genre:", genre.id);
      try {
        playWebAudioFallback(genre);
        setMusicPlaying(true);
        setMusicError(null);
      } catch {
        setMusicError("Generování selhalo. Zkus to znovu.");
      }
    }
    setMusicLoading(false);
  };

  const stopMusic = () => {
    if (musicAudioRef.current) { musicAudioRef.current.pause(); musicAudioRef.current = null; }
    stopWebAudio();
    setMusicPlaying(false);
  };

  const nextGenre = () => {
    if (!musicGenre) return;
    const idx = SOS_MUSIC_GENRES.findIndex(g => g.id === musicGenre.id);
    const next = SOS_MUSIC_GENRES[(idx + 1) % SOS_MUSIC_GENRES.length];
    playMusic(next);
  };

  useEffect(() => {
    return () => { if (musicAudioRef.current) { musicAudioRef.current.pause(); } stopWebAudio(); };
  }, []);

  const overlay: React.CSSProperties = {position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",overflowY:"auto",padding:"24px 16px",gap:16};
  const backBtn = (target: "menu"|null) => (
    <button onClick={()=> target ? setScreen(target) : onClose()} style={{alignSelf:"flex-start",padding:"8px 16px",background:"none",border:`1px solid ${T.t3}`,borderRadius:99,color:T.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:4}}>← Zpět</button>
  );

  // ── MENU ──
  if (screen === "menu") return (
    <div style={overlay} className="anim-fadeIn">
      <img src={monkeySos} alt="SOS" style={{width:90,height:90,objectFit:"contain",filter:"drop-shadow(0 0 30px rgba(255,59,92,0.5))",marginTop:20}} className="anim-float" />
      <div style={{color:T.t1,fontSize:24,fontWeight:900,textAlign:"center"}}>Co ti teď pomůže?</div>
      <div style={{color:T.t2,fontSize:13,textAlign:"center",marginBottom:8}}>Vyber si — opice je tu pro tebe</div>
      {[
        {img:monkeyAngry,label:"Motivační řeč",sub:"Náhodná krizová řeč od opice",color:T.accent,action:pickRandomSpeech},
        {img:monkeyZen,label:"Box Breathing",sub:"4-4-4-4 dýchání na uklidnění",color:T.teal,action:()=>setScreen("breathe")},
        {img:monkeyMusic,label:"Hudba",sub:"Metal, klid, smutek, energie…",color:T.purple,action:()=>setScreen("music")},
      ].map((o,i)=>
        <button key={i} onClick={o.action} className="reason-card" style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:360,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
          <img src={o.img} alt={o.label} style={{width:50,height:50,objectFit:"contain",borderRadius:14}} loading="lazy" />
          <div><div style={{color:T.t1,fontSize:16,fontWeight:700}}>{o.label}</div><div style={{color:T.t2,fontSize:12}}>{o.sub}</div></div>
        </button>
      )}
      <a href="tel:116111" style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:T.redDim,border:`1px solid ${T.red}40`,borderRadius:16,width:"100%",maxWidth:360,textDecoration:"none"}}>
        <span style={{fontSize:24}}>📞</span>
        <div><div style={{color:T.red,fontSize:22,fontWeight:900}}>116 111</div><div style={{color:T.t2,fontSize:12}}>Linka bezpečí — nonstop, zdarma</div></div>
      </a>
      <button onClick={onClose} style={{padding:"10px 28px",background:"none",border:`1px solid ${T.t3}`,borderRadius:99,color:T.t2,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>✕ Zavřít</button>
    </div>
  );

  // ── SPEECH ──
  if (screen === "speech" && sosSpeech) return (
    <div style={overlay} className="anim-fadeIn">
      {backBtn("menu")}
      <div style={{fontSize:60,marginTop:16}} className="anim-bounce">{sosSpeech.icon}</div>
      <div style={{color:T.t1,fontSize:22,fontWeight:900,textAlign:"center"}}>{sosSpeech.title}</div>
      <div style={{color:T.t2,fontSize:12,marginBottom:8}}>{sosSpeech.src}</div>
      <div style={{background:T.card,border:`1px solid ${sosSpeech.color}30`,borderRadius:16,padding:20,maxWidth:380,width:"100%",lineHeight:1.7}}>
        <div style={{color:T.t1,fontSize:15}}>{sosSpeech.text}</div>
      </div>
      <SpeechPlayer text={sosSpeech.text} label="Přehraj řeč" speechId={sosSpeech.id} emotion="all" />
      <button onClick={pickRandomSpeech} style={{padding:"12px 28px",background:T.accentDim,border:`1px solid ${T.accent}40`,borderRadius:99,color:T.accent,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>🔀 Další řeč</button>
    </div>
  );

  // ── BREATHE ──
  if (screen === "breathe") return (
    <div style={overlay} className="anim-fadeIn">
      {backBtn("menu")}
      <div style={{marginTop:20,width:"100%",maxWidth:380}}>
        <BreathingExercise type="box" />
      </div>
    </div>
  );

  // ── MUSIC ──
  if (screen === "music") return (
    <div style={overlay} className="anim-fadeIn">
      {backBtn("menu")}
      <img src={monkeyMusic} alt="Music" style={{width:70,height:70,objectFit:"contain",marginTop:8}} className={musicPlaying ? "anim-monkeyBob" : ""} />
      <div style={{color:T.t1,fontSize:20,fontWeight:800,textAlign:"center"}}>Jakou hudbu potřebuješ?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%",maxWidth:380}}>
        {SOS_MUSIC_GENRES.map(g => (
          <button key={g.id} onClick={() => playMusic(g)} disabled={musicLoading}
            className="reason-card"
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"16px 12px",background: musicGenre?.id === g.id ? `${g.color}20` : T.card,border:`1px solid ${musicGenre?.id === g.id ? g.color : T.border}`,borderRadius:14,cursor:musicLoading?"wait":"pointer",fontFamily:"inherit",textAlign:"center"}}>
            <div style={{fontSize:28}}>{g.label.split(" ")[0]}</div>
            <div style={{color:T.t1,fontSize:14,fontWeight:700}}>{g.label.split(" ").slice(1).join(" ")}</div>
            <div style={{color:T.t2,fontSize:11}}>{g.sub}</div>
          </button>
        ))}
      </div>
      {musicLoading && (
        <div style={{color:T.accent,fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
          <span style={{animation:"pulse 1.5s infinite"}}>⏳</span> Generuji hudbu… (může trvat ~15s)
        </div>
      )}
      {musicError && !musicLoading && (
        <div style={{color:T.red,fontSize:13,fontWeight:600,textAlign:"center",padding:"8px 16px",background:T.redDim,borderRadius:10,maxWidth:340}}>
          ⚠️ {musicError}
        </div>
      )}
      {musicPlaying && musicGenre && (
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={stopMusic} style={{padding:"10px 24px",background:T.redDim,border:`1px solid ${T.red}40`,borderRadius:99,color:T.red,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>■ Stop</button>
          <button onClick={nextGenre} style={{padding:"10px 24px",background:T.accentDim,border:`1px solid ${T.accent}40`,borderRadius:99,color:T.accent,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🔀 Další žánr</button>
        </div>
      )}
    </div>
  );

  return null;
}

// ══════════════════════════════
// ── MAIN APP ──
// ══════════════════════════════
export default function Index() {
  const { signOut } = useAuth();
  const cloud = useCloudData();
  const premium = usePremium();
  const { moodLog, xp, streakCount, completedQuests, equippedSkin, userName, lastCheckinDate, loading: cloudLoading } = cloud;

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tab, setTab] = useState("feel");
  const [showSOS, setShowSOS] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  const [avatar, setAvatar] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [xpPopup, setXpPopup] = useState<{xp:number;label:string}|null>(null);
  const [levelUp, setLevelUp] = useState<{level:number;skin?:typeof MONKEY_SKINS[0]|null}|null>(null);
  const [step, setStep] = useState(1);
  const [sliderIndex, setSliderIndex] = useState(3); // middle = meh
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [intensity, setIntensity] = useState(3);
  const [peerEcho, setPeerEcho] = useState<Record<string, number>>({});
  const [shareCard, setShareCard] = useState<{quote:string;rank:string;mood:string}|null>(null);
  const [recs, setRecs] = useState<any>(null);
  const [shareCard, setShareCard] = useState<{quote:string;rank:string;mood:string}|null>(null);
  const [recs, setRecs] = useState<any>(null);

  const requirePremium = (feature: string) => {
    if (premium.isPremium) return false;
    setPaywallFeature(feature);
    setShowPaywall(true);
    return true;
  };

  // Show onboarding for new users (onboarded flag not set)
  useEffect(() => {
    if (!cloudLoading && cloud.profile && !cloud.profile.onboarded) setShowOnboarding(true);
  }, [cloudLoading, cloud.profile]);

  // Fetch anonymous peer echo (how many warriors felt each mood today)
  useEffect(() => {
    supabase.rpc("get_today_mood_counts").then(({ data }) => {
      if (data) {
        const counts: Record<string, number> = {};
        (data as any[]).forEach((r: any) => { counts[r.mood_id] = Number(r.count); });
        setPeerEcho(counts);
      }
    });
  }, [moodLog.length]);

  const handleOnboardingComplete = async (newName: string, moodId: string) => {
    if (newName) cloud.updateName(newName);
    const uid = cloud.profile?.id;
    if (uid) {
      await supabase.from("profiles").update({ onboarded: true } as any).eq("id", uid);
    }
    const mood = MOODS.find(m => m.id === moodId);
    if (mood) {
      const tier = MOOD_TIERS.find(t => t.id === (mood as any).tier);
      if (tier) setSelectedTier(tier);
      setSelectedMood(mood);
      setStep(2);
    }
    setShowOnboarding(false);
  };

  const handleNameChange = (n: string) => { cloud.updateName(n); };
  const handleAvatar = (e: any) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onload = (ev: any) => { setAvatar(ev.target.result); }; r.readAsDataURL(f); }
  };

  const completeQuest = (questId: string) => {
    const key = `${new Date().toISOString().split("T")[0]}:${questId}`;
    if (completedQuests.includes(key)) return;
    const quest = DAILY_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    const newQ = [...completedQuests, key];
    const oldLevel = Math.floor(xp / 100) + 1;
    const newXp = xp + quest.xp;
    const newLevel = Math.floor(newXp / 100) + 1;
    cloud.updateProgress(newXp, streakCount, newQ);
    setXpPopup({ xp: quest.xp, label: quest.label });
    if (newLevel > oldLevel) {
      const newSkin = MONKEY_SKINS.find(s => s.xpNeeded <= newXp && s.xpNeeded > xp) || null;
      setTimeout(() => setLevelUp({ level: newLevel, skin: newSkin }), 1200);
    }
  };
  const equipSkin = (id: string) => {
    cloud.updateSkin(id);
    const skin = MONKEY_SKINS.find(s => s.id === id);
    if (skin) setXpPopup({ xp: 0, label: `${skin.name} nasazen!` });
  };
  const currentSkinImg = MONKEY_SKINS.find(s => s.id === equippedSkin)?.img || monkeyHero;

  const selectTier = (tier: typeof MOOD_TIERS[0]) => { setSelectedTier(tier); setStep(2); };
  const selectMood = (m: any) => { setSelectedMood(m); setIntensity(3); };
  const selectReason = (r: any) => {
    setSelectedReason(r);
    cloud.logMood(selectedMood.id, r.id);
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = lastCheckinDate !== today;
    let newStreak = streakCount;
    if (isNewDay) {
      if (lastCheckinDate) {
        const lastDate = new Date(lastCheckinDate);
        const diff = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
        newStreak = diff <= 1 ? streakCount + 1 : 1;
      } else {
        newStreak = 1;
      }
    }
    cloud.updateProgress(xp, newStreak, completedQuests);
    setRecs(getRecommendations(selectedMood, r));
    setStep(4);
    completeQuest("checkin");
    if (newStreak >= 3) completeQuest("streak3");
    if (newStreak >= 7) completeQuest("streak7");
  };
  const confirmSubMood = () => { setStep(3); };
  const resetFlow = () => { setStep(1); setSelectedTier(null); setSelectedMood(null); setSelectedReason(null); setRecs(null); setIntensity(3); setShareCard(null); };

  const handleSpeechComplete = (speech: any) => {
    completeQuest("speech");
    const rank = getWarriorRank(xp);
    setShareCard({ quote: speech.title, rank: rank.name, mood: selectedMood?.label || "" });
  };

  const lastMoodMonkey = selectedMood ? MOOD_MONKEY[selectedMood.id] : (moodLog.length > 0 ? MOOD_MONKEY[moodLog[0].mood.id] : null);

  if (cloudLoading) return (
    <div style={{width:"100%",height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0C13"}}>
      <img src={monkeyHero} alt="" style={{width:80,height:80,objectFit:"contain",animation:"float 2s ease-in-out infinite"}} />
    </div>
  );

  return (
    <>
    {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
    <div style={{maxWidth:430,margin:"0 auto",height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,fontFamily:"'Segoe UI',system-ui,sans-serif",color:T.t1,overflow:"hidden"}}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes bounceIn{0%{opacity:0;transform:scale(0.6)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 8px rgba(255,122,47,0.2)}50%{box-shadow:0 0 20px rgba(255,122,47,0.4)}}
        @keyframes xpPopIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}60%{transform:translate(-50%,-50%) scale(1.15)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes xpFloat{0%{opacity:1;transform:translateY(0)}70%{opacity:1}100%{opacity:0;transform:translateY(-60px)}}
        @keyframes particle0{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(-80px,-120px) scale(0)}}
        @keyframes particle1{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(90px,-100px) scale(0)}}
        @keyframes particle2{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(-60px,80px) scale(0)}}
        @keyframes particle3{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(70px,90px) scale(0)}}
        @keyframes monkeyBob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-4px) rotate(-3deg)}75%{transform:translateY(-2px) rotate(3deg)}}
        .anim-fadeUp{animation:fadeUp .4s ease-out both}
        .anim-fadeIn{animation:fadeIn .3s ease-out both}
        .anim-slideIn{animation:slideInRight .4s ease-out both}
        .anim-bounce{animation:bounceIn .5s cubic-bezier(.36,1.1,.3,1) both}
        .anim-float{animation:float 3s ease-in-out infinite}
        .anim-monkeyBob{animation:monkeyBob 2s ease-in-out infinite}
        .anim-d1{animation-delay:.05s}.anim-d2{animation-delay:.1s}.anim-d3{animation-delay:.15s}.anim-d4{animation-delay:.2s}.anim-d5{animation-delay:.25s}.anim-d6{animation-delay:.3s}.anim-d7{animation-delay:.35s}
        .mood-btn{transition:all .25s ease;position:relative;overflow:hidden}
        .mood-btn:hover{transform:scale(1.02);filter:brightness(1.15);box-shadow:0 0 18px rgba(255,122,47,0.25)}
        .mood-btn:active{transform:scale(0.97)}
        .reason-card{transition:all .25s cubic-bezier(.4,0,.2,1);position:relative}
        .reason-card::after{content:'';position:absolute;inset:-1px;border-radius:15px;background:linear-gradient(135deg,transparent,rgba(255,122,47,0.15),transparent);opacity:0;transition:opacity .3s ease;pointer-events:none;z-index:0}
        .reason-card:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 0 14px rgba(255,122,47,0.2),0 0 30px rgba(255,122,47,0.08);border-color:rgba(255,122,47,0.4)!important}
        .reason-card:hover::after{opacity:1}
        .reason-card:hover img{transform:scale(1.1);filter:drop-shadow(0 0 6px rgba(255,122,47,0.4))}
        .reason-card img{transition:all .25s ease}
        .reason-card:active{transform:scale(0.96)}
        .speech-card{transition:all .25s ease;position:relative;overflow:hidden}
        .speech-card::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);transition:left .5s ease}
        .speech-card:hover{border-color:rgba(255,122,47,0.25)!important;box-shadow:0 0 20px rgba(255,122,47,0.1)}
        .speech-card:hover::before{left:100%}
        .nav-btn{transition:all .2s ease}
        .nav-btn:hover{transform:scale(1.1);filter:drop-shadow(0 0 6px rgba(255,122,47,0.3))}
        .tab-monkey{transition:all .3s ease}
        .tab-monkey:hover{transform:scale(1.05) rotate(-3deg);filter:drop-shadow(0 0 10px rgba(255,122,47,0.3))}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.t3};border-radius:4px}
        input::placeholder,textarea::placeholder{color:${T.t3}}
      `}</style>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{display:"none"}}/>
      {showSOS && <SOSOverlay onClose={()=>setShowSOS(false)}/>}
      {showPaywall && <PaywallOverlay onClose={()=>setShowPaywall(false)} premium={premium} feature={paywallFeature} />}
      {xpPopup && <XpPopup xp={xpPopup.xp} label={xpPopup.label} onDone={() => setXpPopup(null)} />}
      {levelUp && <LevelUpOverlay level={levelUp.level} skin={levelUp.skin} onDone={() => setLevelUp(null)} />}

      <div style={{flex:1,overflowY:"auto",padding:"0 16px 16px",display:"flex",flexDirection:"column"}}>
        {/* Trial banner */}
        {premium.isTrial && (
          <div style={{padding:"8px 16px",background:`linear-gradient(90deg, ${T.accent}20, ${T.purple}15)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between",margin:"8px 0"}}>
            <div style={{color:T.accent,fontSize:12,fontWeight:700}}>👑 Premium trial · {premium.trialDaysLeft} dní zbývá</div>
          </div>
        )}
        {premium.status === "expired" && (
          <button onClick={()=>requirePremium("Premium")} style={{padding:"10px 16px",background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:12,color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",margin:"8px 0",textAlign:"center"}}>
            ⏰ Trial skončil — odemkni Premium za 99 CZK/měs
          </button>
        )}
        {/* ════════ FEEL TAB ════════ */}
        {tab === "feel" && (
          <div>
            {/* Profile bar */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",marginBottom:4}}>
              <button onClick={()=>fileRef.current?.click()} style={{width:48,height:48,borderRadius:"50%",background:avatar?"none":`linear-gradient(135deg, ${T.accent}30, ${T.purple}30)`,border:`2px solid ${T.accent}50`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0,padding:0}}>
                {avatar ? <img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <img src={monkeyHero} alt="" style={{width:36,height:36,objectFit:"contain"}}/>}
              </button>
              <div style={{flex:1,minWidth:0}}>
                <input value={userName} onChange={e=>handleNameChange(e.target.value)} placeholder="Tvoje jméno…"
                  style={{background:"transparent",border:"none",outline:"none",color:T.t1,fontFamily:"inherit",fontSize:15,fontWeight:700,width:"100%"}} />
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                  <span style={{color:getWarriorRank(xp).color,fontSize:11,fontWeight:700}}>{getWarriorRank(xp).name}</span>
                  <span style={{color:T.t3,fontSize:11}}>·</span>
                  <span style={{color:T.accent,fontSize:13,fontWeight:800}}>{streakCount}🔥</span>
                </div>
              </div>
              {lastMoodMonkey ? (
                <img src={lastMoodMonkey} alt="" className="anim-monkeyBob" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              ) : (
                <img src={currentSkinImg} alt="" className="anim-float" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              )}
            </div>

            {/* STEP 1 — How are you? Good / OK / Bad */}
            {step === 1 && (
              <>
                <InAppNotifications lastCheckinDate={lastCheckinDate} streakCount={streakCount} userName={userName} onNavigate={(t) => { setTab(t); resetFlow(); }} />
                <div className="anim-fadeUp" style={{display:"flex",alignItems:"center",gap:14,marginBottom:24,padding:20,background:`linear-gradient(135deg, ${T.accent}15, transparent)`,borderRadius:24,border:`1px solid ${T.accent}20`}}>
                  <img src={monkeyHero} alt="" className="tab-monkey" style={{width:72,height:72,objectFit:"contain"}} />
                  <div>
                    <div style={{color:T.t1,fontSize:26,fontWeight:900,letterSpacing:-0.5}}>Jak se cítíš?</div>
                    <div style={{color:T.t2,fontSize:14,marginTop:4}}>Stačí jedno kliknutí 👇</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {MOOD_TIERS.map((tier, i) => (
                    <button key={tier.id} onClick={()=>selectTier(tier)} className={`reason-card anim-fadeUp anim-d${i+1}`} style={{
                      display:"flex",alignItems:"center",gap:16,padding:"20px 24px",
                      background:tier.gradient,border:`1px solid ${tier.color}25`,borderRadius:20,
                      cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                    }}>
                      <span style={{fontSize:44,lineHeight:1}}>{tier.emoji}</span>
                      <div style={{flex:1}}>
                        <div style={{color:T.t1,fontSize:20,fontWeight:900}}>{tier.label}</div>
                        <div style={{color:T.t2,fontSize:13,marginTop:2}}>{tier.sub}</div>
                      </div>
                      <span style={{color:tier.color,fontSize:20,opacity:0.6}}>→</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 — Sub-emotions + Intensity */}
            {step === 2 && selectedTier && (
              <>
                <button onClick={()=>{setStep(1);setSelectedTier(null);setSelectedMood(null)}} style={{background:"none",border:"none",color:T.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12,display:"flex",alignItems:"center",gap:4}}>← Zpět</button>
                <div className="anim-fadeUp" style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:16,background:selectedTier.gradient,borderRadius:20,border:`1px solid ${selectedTier.color}25`}}>
                  <span style={{fontSize:40}}>{selectedTier.emoji}</span>
                  <div>
                    <div style={{color:T.t1,fontSize:20,fontWeight:900}}>{selectedTier.label}</div>
                    <div style={{color:T.t2,fontSize:13}}>Co přesně cítíš?</div>
                  </div>
                </div>

                {/* Sub-emotion cards */}
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                  {MOODS.filter(m => (m as any).tier === selectedTier.id).map((m, i) => {
                    const isSelected = selectedMood?.id === m.id;
                    return (
                      <button key={m.id} onClick={()=>selectMood(m)} className={`reason-card anim-fadeUp anim-d${i+1}`} style={{
                        display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
                        background:isSelected ? `${m.color}15` : T.card,
                        border:`2px solid ${isSelected ? m.color : T.border}`,
                        borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                        transition:"all .2s",
                      }}>
                        <img src={MOOD_MONKEY[m.id]} alt={m.label} style={{width:48,height:48,objectFit:"contain",borderRadius:12}} loading="lazy" />
                        <div style={{flex:1}}>
                          <div style={{color:isSelected ? m.color : T.t1,fontSize:16,fontWeight:800}}>{m.label}</div>
                          <div style={{color:T.t2,fontSize:12,marginTop:1}}>{m.sub}</div>
                        </div>
                        {isSelected && <span style={{color:m.color,fontSize:20}}>✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Intensity — only shows after picking sub-emotion */}
                {selectedMood && (
                  <div className="anim-fadeUp" style={{padding:20,background:T.card,border:`1px solid ${selectedMood.color}20`,borderRadius:20,marginBottom:16}}>
                    <div style={{color:T.t1,fontSize:16,fontWeight:800,marginBottom:12,textAlign:"center"}}>Jak moc to cítíš?</div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <span style={{color:T.t2,fontSize:22}}>😌</span>
                      <div style={{flex:1,display:"flex",gap:6}}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={()=>setIntensity(n)}
                            style={{
                              flex:1,height:44,borderRadius:12,
                              background:intensity===n ? `${selectedMood.color}30` : intensity >= n ? `${selectedMood.color}10` : "transparent",
                              border:`2px solid ${intensity>=n ? selectedMood.color : T.border}`,
                              color:intensity>=n ? selectedMood.color : T.t3,
                              fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",
                              transition:"all .2s",
                            }}>{n}</button>
                        ))}
                      </div>
                      <span style={{color:T.t2,fontSize:22}}>🔥</span>
                    </div>
                    <div style={{color:T.t2,fontSize:13,textAlign:"center"}}>
                      {intensity <= 2 ? "Lehce to cítíš" : intensity <= 3 ? "Střední intenzita" : intensity === 4 ? "Cítíš to silně" : "Na plný — Goggins mode 💀"}
                    </div>
                  </div>
                )}

                {/* Peer echo */}
                {selectedMood && Object.values(peerEcho).reduce((a,b)=>a+b,0) > 0 && (
                  <div className="anim-fadeUp" style={{padding:12,background:`${selectedMood.color}08`,border:`1px solid ${selectedMood.color}15`,borderRadius:12,marginBottom:16,textAlign:"center"}}>
                    <span style={{color:selectedMood.color,fontSize:14,fontWeight:700}}>
                      {peerEcho[selectedMood.id] || 0} opičích válečníků cítí {selectedMood.label.toLowerCase()} dnes
                    </span>
                    <div style={{color:T.t3,fontSize:11,marginTop:2}}>Nejsi v tom sám/a 🐵</div>
                  </div>
                )}

                {/* Continue button */}
                {selectedMood && (
                  <button onClick={confirmSubMood} className="reason-card" style={{width:"100%",padding:"16px 0",background:`linear-gradient(135deg, ${selectedMood.color}25, ${selectedMood.color}10)`,border:`1px solid ${selectedMood.color}35`,borderRadius:16,color:selectedMood.color,fontSize:17,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
                    Pokračuj →
                  </button>
                )}
              </>
            )}

            {/* STEP 3 — why */}
            {step === 3 && (
              <>
                <button onClick={()=>setStep(2)} style={{background:"none",border:"none",color:T.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12,display:"flex",alignItems:"center",gap:4}}>← Zpět</button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:12,background:`linear-gradient(135deg, ${selectedMood.color}12, transparent)`,borderRadius:14,border:`1px solid ${selectedMood.color}25`}}>
                  <img src={MOOD_MONKEY[selectedMood.id] || monkeyHero} alt="" style={{width:48,height:48,objectFit:"contain"}} loading="lazy" />
                  <div>
                    <div style={{color:T.t1,fontSize:15,fontWeight:700}}>Cítíš se: {selectedMood.label} ({intensity}/5)</div>
                    <div style={{color:T.t2,fontSize:12}}>Co za tím stojí?</div>
                  </div>
                </div>
                <div style={{color:T.t1,fontSize:18,fontWeight:800,marginBottom:4}}>Proč nebo co cítíš?</div>
                <div style={{color:T.t2,fontSize:12,marginBottom:16}}>Vyber co je nejblíž — opice najde co ti pomůže</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {REASONS.map(r => (
                    <button key={r.id} onClick={()=>selectReason(r)} className="reason-card" style={{display:"flex",alignItems:"center",gap:10,padding:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <img src={REASON_MONKEY[r.id]} alt={r.label} style={{width:40,height:40,objectFit:"contain",borderRadius:8}} loading="lazy" />
                      <div style={{flex:1}}>
                        <div style={{color:T.t1,fontSize:13,fontWeight:700}}>{r.label}</div>
                        <div style={{color:T.t2,fontSize:10}}>{r.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 4 — tailored results */}
            {step === 4 && recs && (
              <>
                <button onClick={resetFlow} style={{background:"none",border:"none",color:T.accent,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>← Nový check-in</button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:12,background:`linear-gradient(135deg, ${selectedMood.color}12, transparent)`,borderRadius:14,border:`1px solid ${selectedMood.color}25`}}>
                  <img src={EMO_MONKEY[recs.emo] || monkeyHero} alt="" style={{width:48,height:48,objectFit:"contain"}} loading="lazy" />
                  <div>
                    <div style={{color:T.t1,fontSize:14,fontWeight:700}}>{selectedMood.label} · {selectedReason.label} · {intensity}/5</div>
                    <div style={{color:T.t2,fontSize:12}}>Opice ti vybrala tohle 👇</div>
                  </div>
                </div>

                {/* Speeches */}
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <img src={monkeyWarrior} alt="" style={{width:28,height:28,objectFit:"contain"}} loading="lazy"/>
                    <span style={{color:T.t1,fontSize:16,fontWeight:800}}>Řeč pro tebe</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {(premium.isPremium ? recs.speeches : recs.speeches.slice(0,1)).map((s: any) => (
                      <div key={s.id} className="speech-card" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <span style={{fontSize:22}}>{s.icon}</span>
                          <div>
                            <div style={{color:T.t1,fontSize:15,fontWeight:800}}>{s.title}</div>
                            <span style={{color:T.t2,fontSize:11}}>{s.src}</span>
                          </div>
                        </div>
                        <div style={{color:T.t2,fontSize:13,marginBottom:10,lineHeight:1.5}}>{s.text.substring(0,140)}...</div>
                        <SpeechPlayer text={s.text} label="Přehraj řeč" speechId={s.id} emotion={s.emo} intensity={intensity} onComplete={()=>handleSpeechComplete(s)}/>
                      </div>
                    ))}
                    {!premium.isPremium && recs.speeches.length > 1 && (
                      <button onClick={()=>requirePremium("Plná knihovna řečí")} className="reason-card" style={{display:"flex",alignItems:"center",gap:12,padding:16,background:`${T.accent}08`,border:`1px dashed ${T.accent}40`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                        <span style={{fontSize:28}}>🔒</span>
                        <div>
                          <div style={{color:T.accent,fontSize:14,fontWeight:800}}>+{recs.speeches.length - 1} dalších řečí</div>
                          <div style={{color:T.t2,fontSize:12}}>Odemkni Premium pro přístup ke všem</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Breathing */}
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <img src={monkeyZen} alt="" style={{width:32,height:32,objectFit:"contain"}} loading="lazy" />
                    <span style={{color:T.t1,fontSize:16,fontWeight:800}}>Zklidni opici — dýchej</span>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16}}>
                    <BreathingExercise type={recs.breathType} onComplete={()=>completeQuest("breathe")}/>
                  </div>
                </div>

                {/* Heavy metal — use SOS music instead */}
                {recs.showMetal && (
                  <div style={{marginBottom:20}}>
                    <button onClick={()=>setShowSOS(true)} className="reason-card" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:16,background:T.redDim,border:`1px solid ${T.red}30`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <img src={monkeyMusic} alt="" style={{width:40,height:40,objectFit:"contain"}} loading="lazy"/>
                      <div>
                        <div style={{color:T.red,fontSize:16,fontWeight:900}}>🤘 Vypusť páru — Hudba</div>
                        <div style={{color:T.t2,fontSize:12}}>Metal, rage a další žánry v SOS</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Grounding */}
                {recs.showGrounding && (
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                      <img src={monkeyGamer} alt="" style={{width:28,height:28,objectFit:"contain"}} loading="lazy"/>
                      <span style={{color:T.t1,fontSize:16,fontWeight:800}}>5-4-3-2-1 Reset</span>
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16}}>
                      <div style={{color:T.t2,fontSize:13,marginBottom:12}}>Z hlavy do přítomnosti:</div>
                      {[{n:5,q:"Co vidíš?"},{n:4,q:"Co cítíš dotykem?"},{n:3,q:"Co slyšíš?"},{n:2,q:"Co cítíš vůní?"},{n:1,q:"Jaká chuť?"}].map(s=>
                        <div key={s.n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <span style={{color:T.accent,fontSize:20,fontWeight:900}}>{s.n}</span>
                          <input placeholder={s.q} onChange={(e)=>{if(e.target.value.trim()&&s.n===1)completeQuest("grounding")}} style={{flex:1,padding:8,background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Share warrior card — visual canvas-based */}
                {shareCard && (
                  <div className="anim-fadeUp" style={{marginBottom:20}}>
                    {/* Card preview */}
                    <div id="warrior-card" style={{
                      padding:24,borderRadius:24,textAlign:"center",position:"relative",overflow:"hidden",
                      background:`linear-gradient(145deg, #1a1030 0%, #0d0f1a 40%, ${selectedMood?.color || T.accent}15 100%)`,
                      border:`1px solid ${T.accent}30`,
                    }}>
                      {/* Decorative elements */}
                      <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle,${selectedMood?.color || T.accent}20,transparent)`,filter:"blur(20px)"}} />
                      <div style={{position:"absolute",bottom:-30,left:-30,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${T.purple}15,transparent)`,filter:"blur(25px)"}} />
                      
                      <div style={{fontSize:14,color:T.t3,fontWeight:600,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>🐵 Monkey Mind</div>
                      <div style={{fontSize:32,marginBottom:8}}>⚔️</div>
                      <div style={{color:T.t1,fontSize:22,fontWeight:900,marginBottom:6,lineHeight:1.2}}>Warrior Moment</div>
                      <div style={{color:selectedMood?.color || T.accent,fontSize:16,fontWeight:700,marginBottom:12,fontStyle:"italic",lineHeight:1.4}}>„{shareCard.quote}"</div>
                      
                      {/* Mood transformation */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}>
                        <div style={{padding:"6px 14px",background:`${selectedMood?.color || T.accent}15`,border:`1px solid ${selectedMood?.color || T.accent}30`,borderRadius:99}}>
                          <span style={{color:selectedMood?.color || T.accent,fontSize:13,fontWeight:700}}>{selectedMood?.label || "?"}</span>
                        </div>
                        <span style={{color:T.t3,fontSize:16}}>→</span>
                        <div style={{padding:"6px 14px",background:`${T.teal}15`,border:`1px solid ${T.teal}30`,borderRadius:99}}>
                          <span style={{color:T.teal,fontSize:13,fontWeight:700}}>Silnější 💪</span>
                        </div>
                      </div>
                      
                      {/* Rank badge */}
                      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",background:`${getWarriorRank(xp).color}12`,border:`1px solid ${getWarriorRank(xp).color}25`,borderRadius:99,marginBottom:8}}>
                        <span style={{color:getWarriorRank(xp).color,fontSize:14,fontWeight:800}}>{shareCard.rank}</span>
                      </div>
                      
                      <div style={{color:T.t3,fontSize:11,marginTop:8}}>monkeymind.lovable.app</div>
                    </div>
                    
                    {/* Action buttons */}
                    <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"center"}}>
                      <button onClick={async ()=>{
                        // Try canvas-based image share
                        try {
                          const el = document.getElementById("warrior-card");
                          if (el) {
                            // Fallback: share as text with visual indicator
                            const text = `🐵 Monkey Mind warrior moment!\n⚔️ „${shareCard.quote}"\n${shareCard.rank}\n${selectedMood?.label} → Silnější 💪\nmonkeymind.lovable.app`;
                            if (navigator.share) {
                              await navigator.share({title:"Monkey Mind Warrior",text});
                            } else {
                              await navigator.clipboard.writeText(text);
                              setXpPopup({xp:0,label:"Zkopírováno! 📋"});
                            }
                          }
                        } catch { /* user cancelled */ }
                      }} className="reason-card" style={{padding:"12px 28px",background:`linear-gradient(135deg, ${T.accent}20, ${T.accent}08)`,border:`1px solid ${T.accent}40`,borderRadius:99,color:T.accent,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                        📤 Sdílej na sítě
                      </button>
                      <button onClick={()=>{
                        const text = `🐵 „${shareCard.quote}" · ${shareCard.rank}\nmonkeymind.lovable.app`;
                        navigator.clipboard.writeText(text).then(()=>setXpPopup({xp:0,label:"Zkopírováno! 📋"}));
                      }} className="reason-card" style={{padding:"12px 20px",background:T.card,border:`1px solid ${T.border}`,borderRadius:99,color:T.t2,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                        📋 Kopírovat
                      </button>
                    </div>
                  </div>
                )}

                {/* Talk to Opičák CTA */}
                <button onClick={()=>{ if (!requirePremium("Opičák AI chat")) setTab("chat"); }} className="reason-card" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:16,background:`linear-gradient(135deg, ${T.teal}12, ${T.blue}08)`,border:`1px solid ${T.teal}25`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:10}}>
                  <img src={monkeyChat} alt="" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
                  <div>
                    <div style={{color:T.t1,fontSize:15,fontWeight:800}}>Chceš si promluvit? {premium.isPremium ? "🐵" : "👑"}</div>
                    <div style={{color:T.t2,fontSize:12}}>{premium.isPremium ? "Opičák ti pomůže — pokecej s ním" : "Premium · Odemkni AI chat"}</div>
                  </div>
                </button>

                {/* Quests CTA */}
                <button onClick={()=>setTab("quests")} className="reason-card" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:16,background:`linear-gradient(135deg, ${T.accent}08, ${T.purple}08)`,border:`1px solid ${T.accent}20`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:20}}>
                  <img src={monkeyQuests} alt="" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
                  <div>
                    <div style={{color:T.t1,fontSize:15,fontWeight:800}}>Splň výzvy, odemkni skiny! ⚔️</div>
                    <div style={{color:T.t2,fontSize:12}}>Sbírej XP a vylepši svou opici</div>
                  </div>
                </button>

                {/* Crisis */}
                <a href="tel:116111" style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:T.redDim,border:`1px solid ${T.red}30`,borderRadius:16,textDecoration:"none",marginBottom:20}}>
                  <span style={{fontSize:22}}>📞</span>
                  <div>
                    <div style={{color:T.red,fontSize:18,fontWeight:900}}>116 111</div>
                    <div style={{color:T.t2,fontSize:12}}>Linka bezpečí — nonstop, zdarma</div>
                  </div>
                </a>
              </>
            )}
          </div>
        )}

        {/* ════════ CHAT TAB ════════ */}
        {tab === "chat" && (premium.isPremium ? <MonkeyChat /> : (
          <div className="anim-fadeUp" style={{textAlign:"center",padding:"40px 16px"}}>
            <img src={monkeyChat} alt="" className="anim-float" style={{width:80,height:80,objectFit:"contain",margin:"0 auto 16px"}} />
            <div style={{color:T.t1,fontSize:20,fontWeight:900,marginBottom:8}}>Opičák je Premium 👑</div>
            <div style={{color:T.t2,fontSize:14,lineHeight:1.6,marginBottom:20}}>AI chat má provozní náklady — je součástí Premium plánu. Zkus 7 dní zdarma!</div>
            <button onClick={()=>requirePremium("Opičák AI chat")} style={{padding:"14px 32px",background:`linear-gradient(135deg, ${T.accent}, #FF9A5C)`,border:"none",borderRadius:14,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 0 20px ${T.accent}40`}}>
              Odemknout Opičáka 🐵
            </button>
          </div>
        ))}

        {/* ════════ QUESTS TAB ════════ */}
        {tab === "quests" && <QuestsTab xp={xp} completedQuests={completedQuests} onEquipSkin={equipSkin} equippedSkin={equippedSkin} />}

        {/* ════════ PROFILE TAB ════════ */}
        {tab === "profile" && (
          <ProfileTab moodLog={moodLog} streakCount={streakCount} userName={userName} avatar={avatar} onNameChange={handleNameChange} onAvatarClick={()=>fileRef.current?.click()} onSignOut={signOut} diaryEntries={cloud.diaryEntries} sosContacts={cloud.sosContacts} onSaveDiary={(content)=>cloud.saveDiaryEntry(content)} onSaveContacts={(contacts)=>cloud.saveSosContacts(contacts)} onCompleteQuest={completeQuest} isPremium={premium.isPremium} onUpgrade={()=>requirePremium("Plný deník & historie")} />
        )}
      </div>

      {/* ── BOTTOM NAV (4 tabs + SOS) ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",padding:"4px 0 8px",borderTop:`1px solid ${T.border}`,background:`linear-gradient(to top, ${T.bg}, rgba(10,12,19,0.95))`,flexShrink:0}}>
        <button onClick={()=>{setTab("feel");if(tab==="feel")resetFlow()}} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="feel"?T.accent:T.t3,fontSize:9,fontWeight:700}}>
          <img src={monkeyHero} alt="" style={{width:24,height:24,objectFit:"contain",opacity:tab==="feel"?1:0.5,transition:"opacity .2s"}} />CÍTÍM
        </button>

        <button onClick={()=>setTab("chat")} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="chat"?T.teal:T.t3,fontSize:9,fontWeight:700}}>
          <img src={monkeyChat} alt="" style={{width:24,height:24,objectFit:"contain",opacity:tab==="chat"?1:0.5,transition:"opacity .2s"}} />OPIČÁK
        </button>

        <button onClick={()=>setShowSOS(true)} className="nav-btn" style={{width:52,height:52,borderRadius:"50%",background:`radial-gradient(circle,${T.red},#CC2040)`,border:"3px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${T.red}50`,transform:"translateY(-8px)",animation:"pulse 3s infinite",flexShrink:0}}>
          <img src={monkeySos} alt="SOS" style={{width:28,height:28,objectFit:"contain"}} />
        </button>

        <button onClick={()=>setTab("quests")} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="quests"?T.accent:T.t3,fontSize:9,fontWeight:700}}>
          <img src={monkeyQuests} alt="" style={{width:24,height:24,objectFit:"contain",opacity:tab==="quests"?1:0.5,transition:"opacity .2s"}} />VÝZVY
        </button>

        <button onClick={()=>setTab("profile")} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="profile"?T.accent:T.t3,fontSize:9,fontWeight:700}}>
          <img src={monkeyProfile} alt="" style={{width:24,height:24,objectFit:"contain",opacity:tab==="profile"?1:0.5,transition:"opacity .2s"}} />PROFIL
        </button>
      </div>
    </div>
    </>
  );
}
