import { useState, useEffect, useRef, useCallback } from "react";
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
};

const T={bg:"#0A0C13",accent:"#FF7A2F",accentDim:"rgba(255,122,47,0.12)",teal:"#00D4AA",tealDim:"rgba(0,212,170,0.12)",red:"#FF3B5C",redDim:"rgba(255,59,92,0.12)",blue:"#4A8FFF",purple:"#A855F7",t1:"#F0EEFF",t2:"#9298B4",t3:"#5A6080",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)"};

// ── SPEECHES ──
const SPEECHES=[
{id:"s1",emo:"anger",reason:["siblings","parents"],icon:"🔥",title:"Je to těžké? Dobře.",src:"Jocko Willink",color:"#FF3B5C",text:"Je to těžké? Dobře. Jocko Willink říká: když je těžce — dobře. Protože to tě posiluje. Každý moment kdy to bolí — to je přesně ten moment, kdy se z tebe stane někdo jiný. Silnější. Tvrdší. Lepší. Takže díky, brácho. Díky za tu bolest."},
{id:"s2",emo:"anger",reason:["siblings","friends"],icon:"🔥",title:"Přeměň vztek v palivo.",src:"David Goggins",color:"#FF3B5C",text:"Slyšíš ten vztek uvnitř? Goggins říká — to není tvůj nepřítel. To je palivo. Záleží jen na tom, co s ním uděláš. Tvůj vztek je energie — čistá, surová, brutální. Rozhodl ses jak ji utratit? Nebo ji necháš, aby tě spálila zevnitř?"},
{id:"s3",emo:"anger",reason:["siblings","parents","friends"],icon:"🧠",title:"6 minut. Pak se rozhodni.",src:"Neurověda",color:"#FF3B5C",text:"Zastav se. Tvůj mozek je teď unešen amygdalou. Prefrontální kortex je offline. Za 6 minut chemie opadne. Nezavolej. Nepiš zprávu. Jen dýchej. Počítej do 360. Pak se rozhodni — s hlavou, ne s žaludkem."},
{id:"s4",emo:"anger",reason:["school","parents"],icon:"🏛",title:"Kontroluješ jen jednu věc.",src:"Marcus Aurelius",color:"#FF3B5C",text:"Marcus Aurelius vládl celé říši. A každé ráno si připomínal: kontroluji jen svou reakci. Ne co se stalo. Jen jak odpovím. Budeš řízen vztekem, nebo budeš vztek řídit ty? Imperátor, nebo otrok?"},
{id:"s18",emo:"anger",reason:["school"],icon:"⚡",title:"Zkoušky nejsou o tobě.",src:"Motivace",color:"#FF3B5C",text:"Víš co je ve skutečnosti ta zkouška? Test papíru. Ne test tebe. Ty jsi víc než známka. Víc než číslo. Tvůj vztek na systém je oprávněný — ale použij ho. Uč se jako rebel. Ukaž jim, že to zvládneš navzdory."},
{id:"s19",emo:"anger",reason:["social"],icon:"💥",title:"Algoritmus tě provokuje.",src:"Cal Newport",color:"#FF3B5C",text:"Víš proč jsi naštvanej? Protože aplikace jsou navržený, aby tě provokoval. Vztek = engagement = peníze pro ně. Pokaždý, když se naštveš online, někdo na tom vydělá. Chceš být produkt, nebo hráč?"},
{id:"s20",emo:"anger",reason:["identity"],icon:"🔥",title:"Vztek je kompas.",src:"Jordan Peterson",color:"#FF3B5C",text:"Peterson říká: vztek ti ukazuje, kde jsou tvé hranice. Kde jsi řekl 'ano' a měl říct 'ne'. Nepotlačuj ho. Poslouchej ho. A pak jednaj — ale s přesností chirurga, ne s brutalitou kladiva."},
{id:"s5",emo:"sadness",reason:["friends","lonely"],icon:"🌅",title:"Tma je nejtemnější před svítáním.",src:"Les Brown",color:"#4A8FFF",text:"Les Brown vyrostl v chudobě, ztratil vše. A říká: nejtemnější je vždy těsně před svítáním. Ty teď jsi v té temnotě. Ale jsi blíž než kdy jindy. Vydržet — to je největší výkon. A ty ho právě podáváš."},
{id:"s6",emo:"sadness",reason:["identity","lonely"],icon:"💎",title:"Tvoje bolest tě přetváří.",src:"Carl Jung",color:"#4A8FFF",text:"Jung říkal, že lidé nepřijdou ke svému já skrze světlo — ale skrze temnotu. Ty teď jsi v dolině. Ale dolina je kde rosteš. Diamanty vznikají pod tlakem. A ty jsi pod tlakem právě teď."},
{id:"s7",emo:"sadness",reason:["friends","parents"],icon:"💪",title:"Cítit je síla.",src:"Brené Brown",color:"#4A8FFF",text:"Víš co je na smutku? Dokazuje, že ti záleží. Ty cítíš — protože jsi dost chytrý a dost lidský na to, aby tě věci zasáhly. Ta schopnost cítit — to je tvoje největší síla. Ne slabost."},
{id:"s8",emo:"sadness",reason:["school","identity"],icon:"👟",title:"Jeden krok. Jen jeden.",src:"Eric Thomas",color:"#4A8FFF",text:"Eric Thomas vyrostl jako bezdomovec. Říká: stačilo mi vidět první schod. Ty nemusíš vidět jak to dopadne. Potřebuješ jen jeden krok. A pak další. A pak ještě jeden. To je celé tajemství."},
{id:"s21",emo:"sadness",reason:["parents"],icon:"🌊",title:"Oni taky bojují.",src:"Motivace",color:"#4A8FFF",text:"Tvoji rodiče nejsou dokonalí. Nikdy nebyli. Ale většina z nich dělá to nejlepší, co umí — i když to nevypadá. Jejich láska je někdy neohrabaná, ale je tam. Smutek z toho je normální. A je to OK."},
{id:"s22",emo:"sadness",reason:["siblings"],icon:"💙",title:"Sourozenci = celoživotní tým.",src:"Psychologie",color:"#4A8FFF",text:"Hádky s bráchou nebo ségrou bolí jinak. Protože je to rodina — nikam neutečeš. Ale jednou budou tvoji nejbližší lidi na světě. Tahle bolest je investice do budoucnosti, i když to teď tak nevypadá."},
{id:"s23",emo:"sadness",reason:["social"],icon:"📱",title:"Scrolluješ, ale necítíš se líp.",src:"Jonathan Haidt",color:"#4A8FFF",text:"Haidt dokázal, že čím víc scrolluješ, tím hůř se cítíš. Instagram ukazuje highlights jiných a tvoje lowlights. Polož telefon. Jdi ven. Pět minut. Smutná opice potřebuje vzduch, ne pixely."},
{id:"s9",emo:"anxiety",reason:["school","social"],icon:"🎭",title:"Strach je lhář.",src:"Neurověda",color:"#FF7A2F",text:"95% věcí ze kterých se bojíme se nikdy nestane. Amygdala je přehnaně dramatická — byla naprogramována pro tygry, ne pro zkoušky. Tvůj strach není pravda. Je to jen starý software běžící na novém hardwaru."},
{id:"s10",emo:"anxiety",reason:["school","identity"],icon:"🎯",title:"Zkrať horizont.",src:"David Goggins",color:"#FF7A2F",text:"Goggins říká: když je maraton nejhorší, dívám se jen 10 metrů dopředu. Příštích deset minut. Co zvládneš teď? Jeden malý krok. Nemysli na zítra. Zítra neexistuje."},
{id:"s11",emo:"anxiety",reason:["social","identity"],icon:"🌊",title:"Ty nejsi své myšlenky.",src:"CBT & Meditace",color:"#FF7A2F",text:"Myšlenka je jen myšlenka. Není to ty. Představ si řeku — myšlenky jsou lodě. Ty je nemusíš nastoupit. Ty jsi břeh. Břeh se nehýbe. Stůj pevně a nech lodě plout."},
{id:"s24",emo:"anxiety",reason:["parents"],icon:"🛡",title:"Jejich očekávání ≠ tvůj osud.",src:"Viktor Frankl",color:"#FF7A2F",text:"Frankl přežil koncentrák a říká: poslední lidská svoboda je vybrat si svůj postoj. Rodiče mají plány. Učitelé mají plány. Ale tvůj příběh píšeš ty. Úzkost z jejich očekávání nemusí být tvůj motor."},
{id:"s25",emo:"anxiety",reason:["friends"],icon:"🎪",title:"Nikdo se na tebe tak nedívá.",src:"Spotlight Effect",color:"#FF7A2F",text:"Psychologie to nazývá 'spotlight effect'. Myslíš, že se na tebe všichni dívají. Ve skutečnosti každý řeší sám sebe. Nikdo si nevšiml toho, co tě trápí. Jsi svobodnější, než si myslíš."},
{id:"s26",emo:"anxiety",reason:["lonely"],icon:"🧘",title:"Klid v chaosu.",src:"Wim Hof",color:"#FF7A2F",text:"Wim Hof říká: dech je tvůj kotevní bod. Když se všechno točí, vrať se k dechu. Nadechni se. 4 sekundy. Zadrž. 4 sekundy. Vydechni. 4 sekundy. Opakuj. Opice se uklidňuje."},
{id:"s12",emo:"fear",reason:["school","friends"],icon:"🦁",title:"Udělej to se strachem.",src:"Brené Brown",color:"#A855F7",text:"Odvaha není absence strachu. Brené Brown říká: každý člověk, který dělal něco velkého — byl vyděšený. Každý. Rozdíl je v tom, kdo šel dál přesto. Strach je vstupenka. Zaplať a jdi."},
{id:"s13",emo:"fear",reason:["identity","parents"],icon:"⚔",title:"Premeditatio malorum.",src:"Stoicismus",color:"#A855F7",text:"Představ si nejhorší scénář. Přežil bys to? Pravděpodobně ano. Epiktétos byl otrok. Marcus Aurelius čelil moru. Přežili. Ty taky přežiješ. Co tě nezabije, to tě upgradne."},
{id:"s27",emo:"fear",reason:["social"],icon:"🎭",title:"Strach z odmítnutí je iluze.",src:"Psychologie",color:"#A855F7",text:"Tvůj mozek zpracovává sociální odmítnutí stejně jako fyzickou bolest. Ale je to bug, ne feature. Odmítnutí neznamená, že jsi bezcenný. Znamená jen, že jeden člověk měl jiný pohled. To je vše."},
{id:"s28",emo:"fear",reason:["lonely"],icon:"🌟",title:"Samota ≠ osamělost.",src:"Rainer Maria Rilke",color:"#A855F7",text:"Rilke psal: 'Přijmi svou samotu a miluj ji. Práce, která z ní vzejde, bude překrásná.' Největší umělci, vědci, filozofové — všichni znali samotu. A udělali z ní zlato."},
{id:"s14",emo:"lonely",reason:["lonely","friends"],icon:"🔬",title:"Velcí lidé jsou budovaní v tichu.",src:"Jordan Peterson",color:"#6C7EB7",text:"Nejlepší myšlenky vznikají v tichu. Newton vymyslel gravitaci v karanténě. Da Vinci trávil hodiny sám. Tvoje osamělost je laboratoř. Co v ní vynalezneš?"},
{id:"s29",emo:"lonely",reason:["school"],icon:"🎧",title:"Jsi v tom sám? Ne.",src:"Statistika",color:"#6C7EB7",text:"46% teenagerů říká, že se cítí osamělí. Skoro polovina. Takže i ten kluk vedle tebe v lavici. I ta holka co vypadá, že má všechno. Nejsi sám v tom, že jsi sám."},
{id:"s30",emo:"lonely",reason:["social","identity"],icon:"🌍",title:"Online přátelství ≠ přátelství.",src:"Sherry Turkle",color:"#6C7EB7",text:"Turkle z MIT říká: jsme 'spolu sami'. 500 followerů, ale nikdo, komu zavoláš ve 2 ráno. Skutečný connection vyžaduje zranitelnost. A to je těžké. Ale stojí to za to."},
{id:"s15",emo:"overwhelm",reason:["school","social"],icon:"📋",title:"Jeden den. Jedna věc.",src:"Jocko Willink",color:"#00D4AA",text:"Když je lista nekonečná — udělej jen jednu věc. Ale dobře. Jeden den. Jedna priorita. Co je ta jedna věc dnes? Zapomeň na zbytek. Jen tuhle jednu. Tady. Teď."},
{id:"s31",emo:"overwhelm",reason:["parents","identity"],icon:"🧩",title:"Nemůžeš všechno.",src:"Esencialismus",color:"#00D4AA",text:"Greg McKeown říká: 'Pokud to není jasné ANO, je to NE.' Nemůžeš chodit na kroužky, mít samý jedničky, být populární a mít se dobře. Vyber si 2. Zbytek nech být."},
{id:"s16",emo:"all",reason:[],icon:"🐵",title:"Opice není ty.",src:"Monkey Mind",color:"#FF7A2F",text:"Ta opice v tvé hlavě — co skáče a křičí — to není ty. Ty jsi ten, kdo ji pozoruje. A pozorovatel je vždy silnější. Kdo má dnes kontrolu? Opice, nebo ty?"},
{id:"s17",emo:"all",reason:[],icon:"⚡",title:"Puberta je superpower.",src:"Motivace",color:"#FF7A2F",text:"Zlato se čistí v ohni. Ocel se kalí v chladu. Ty se stáváš silnějším právě teď. Puberta je nejtěžší přestavba mozku v celém životě. A ty ji přežíváš. To je výkon."},
{id:"s32",emo:"all",reason:[],icon:"🧬",title:"Tvůj mozek se mění.",src:"Neurověda",color:"#FF7A2F",text:"Mezi 12 a 25 se tvůj mozek kompletně přestavuje. Myelin. Synapse. Prefrontální kortex. Jsi doslova pod rekonstrukcí. Takže když se cítíš divně — to není bug. To je update."},
];

const MOODS=[
  {id:"great",label:"Skvěle",sub:"Mám energii, svět je můj",color:T.teal},
  {id:"pumped",label:"Nabitej/á",sub:"Ready na cokoliv",color:T.blue},
  {id:"meh",label:"Tak nějak",sub:"Nic moc, nic málo",color:T.accent},
  {id:"angry",label:"Naštvanej/á",sub:"Všechno mě sere",color:T.red},
  {id:"sad",label:"Smutnej/á",sub:"Bolí to uvnitř",color:T.purple},
  {id:"anxious",label:"Úzkostnej/á",sub:"Svírá mě to",color:"#FF7A2F"},
  {id:"awful",label:"Na dně",sub:"Nevím co dál",color:T.red},
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

function getRecommendations(mood: any, reason: any) {
  const emoMap: Record<string,string> = {great:"all",pumped:"all",meh:"anxiety",angry:"anger",sad:"sadness",anxious:"anxiety",awful:"sadness"};
  const realEmo = emoMap[mood?.id] || "all";
  let speeches = SPEECHES.filter(s => {
    if (s.emo === "all") return true;
    if (s.emo !== realEmo) return false;
    if (s.reason.length === 0) return true;
    return s.reason.includes(reason?.id);
  }).slice(0, 4);
  if (speeches.length < 2) speeches = SPEECHES.filter(s => s.emo === realEmo || s.emo === "all").slice(0, 4);
  return { speeches, breathType: realEmo === "anxiety" ? "sleep" : "box", showMetal: realEmo === "anger" || reason?.id === "siblings", showGrounding: realEmo === "anxiety" || realEmo === "fear", emo: realEmo };
}

const audioCache = new Map<string, string>();

// ── SPEECH PLAYER ──
function SpeechPlayer({text, label, speechId, emotion}: {text: string; label: string; speechId: string; emotion: string}) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const play = async () => {
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    let audioUrl = audioCache.get(speechId);
    if (!audioUrl) {
      setLoading(true);
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ text, emotion }),
        });
        if (!response.ok) throw new Error(`TTS failed`);
        const audioBlob = await response.blob();
        audioUrl = URL.createObjectURL(audioBlob);
        audioCache.set(speechId, audioUrl);
      } catch {
        setLoading(false);
        const u = new SpeechSynthesisUtterance(text); u.lang = "cs-CZ"; u.rate = 0.82;
        u.onend = () => setPlaying(false); u.onerror = () => setPlaying(false);
        setPlaying(true); window.speechSynthesis.speak(u); return;
      }
      setLoading(false);
    }
    const audio = new Audio(audioUrl); audioRef.current = audio;
    audio.onended = () => setPlaying(false); audio.onerror = () => setPlaying(false);
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
function BreathingExercise({type="box"}: {type?: string}) {
  const [active, setActive] = useState(false);
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
  const start = () => {
    if(active){stop();return} setActive(true);phaseRef.current=0;
    const p=pat.phases[0];setPhase(p.label);setCount(p.dur);let c=p.dur;
    timerRef.current=setInterval(()=>{c--;if(c<=0){phaseRef.current=(phaseRef.current+1)%pat.phases.length;const np=pat.phases[phaseRef.current];setPhase(np.label);c=np.dur;setCount(np.dur)}else setCount(c)},1000);
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

function QuestsTab({ xp, completedQuests, onEquipSkin, equippedSkin }: { xp: number; completedQuests: string[]; onEquipSkin: (id: string) => void; equippedSkin: string }) {
  const [view, setView] = useState<"quests" | "skins">("quests");
  const todayKey = new Date().toISOString().split("T")[0];
  const todayCompleted = completedQuests.filter(q => q.startsWith(todayKey)).map(q => q.split(":")[1]);

  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const nextSkin = MONKEY_SKINS.find(s => s.xpNeeded > xp);

  return (
    <div style={{ paddingTop: 8 }} className="anim-fadeUp">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: 16, background: `linear-gradient(135deg, ${T.accent}15, ${T.purple}08)`, borderRadius: 20, border: `1px solid ${T.accent}20` }}>
        <img src={monkeyQuests} alt="" className="anim-monkeyBob" style={{ width: 64, height: 64, objectFit: "contain" }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: T.t1, fontSize: 20, fontWeight: 900 }}>Level {currentLevel} 🐵</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div style={{ flex: 1, height: 8, background: T.card, borderRadius: 99, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpInLevel}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.teal})`, borderRadius: 99, transition: "width .5s ease" }} />
            </div>
            <span style={{ color: T.accent, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{xp} XP</span>
          </div>
          {nextSkin && <div style={{ color: T.t3, fontSize: 11, marginTop: 4 }}>Další skin: {nextSkin.name} za {nextSkin.xpNeeded} XP</div>}
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

// ── PROFILE TAB (with Mood Insights) ──
function ProfileTab({moodLog, streakCount, userName, avatar, onNameChange, onAvatarClick}: {moodLog:any[]; streakCount:number; userName:string; avatar:string|null; onNameChange:(n:string)=>void; onAvatarClick:()=>void}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [contacts, setContacts] = useState([{name:"",phone:""}]);
  const [diary, setDiary] = useState("");
  const days = ["Po","Út","St","Čt","Pá","So","Ne"];
  const calendarWeeks: any[] = [];
  for(let w=0;w<4;w++){const week=[];for(let d=0;d<7;d++){const dayIdx=w*7+d;week.push(moodLog[dayIdx]||null)}calendarWeeks.push(week)}

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
            <>
              {/* Mood distribution bars */}
              <div style={{marginBottom:20}}>
                <div style={{color:T.t2,fontSize:13,marginBottom:8}}>Rozložení nálad</div>
                {(() => {
                  const counts: Record<string, number> = {};
                  moodLog.forEach((l: any) => { counts[l.mood.id] = (counts[l.mood.id] || 0) + 1; });
                  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                  const max = sorted[0]?.[1] || 1;
                  return sorted.map(([moodId, count]) => {
                    const mood = MOODS.find(m => m.id === moodId);
                    if (!mood) return null;
                    return (
                      <div key={moodId} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        <img src={MOOD_MONKEY[moodId]} alt="" style={{width:24,height:24,objectFit:"contain"}} />
                        <span style={{color:T.t2,fontSize:12,width:80,flexShrink:0}}>{mood.label}</span>
                        <div style={{flex:1,height:16,background:T.card,borderRadius:8,overflow:"hidden",border:`1px solid ${T.border}`}}>
                          <div style={{height:"100%",width:`${(count / max) * 100}%`,background:`linear-gradient(90deg, ${mood.color}60, ${mood.color})`,borderRadius:8,transition:"width .5s"}} />
                        </div>
                        <span style={{color:mood.color,fontSize:13,fontWeight:800,width:24,textAlign:"right"}}>{count}</span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Top reasons */}
              <div style={{marginBottom:20}}>
                <div style={{color:T.t2,fontSize:13,marginBottom:8}}>Nejčastější důvody</div>
                {(() => {
                  const counts: Record<string, number> = {};
                  moodLog.forEach((l: any) => { if (l.reason) counts[l.reason.id] = (counts[l.reason.id] || 0) + 1; });
                  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
                  return sorted.map(([reasonId, count]) => {
                    const reason = REASONS.find(r => r.id === reasonId);
                    if (!reason) return null;
                    return (
                      <div key={reasonId} className="reason-card" style={{display:"flex",alignItems:"center",gap:10,padding:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:6}}>
                        <img src={REASON_MONKEY[reasonId]} alt="" style={{width:28,height:28,objectFit:"contain"}} />
                        <span style={{color:T.t1,fontSize:13,fontWeight:700,flex:1}}>{reason.label}</span>
                        <span style={{color:T.accent,fontSize:14,fontWeight:800}}>{count}×</span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Weekly trend bars */}
              <div style={{marginBottom:20}}>
                <div style={{color:T.t2,fontSize:13,marginBottom:8}}>Poslední 7 dní</div>
                <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80,background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"12px 8px"}}>
                  {(() => {
                    const moodScore: Record<string, number> = { great: 5, pumped: 4, meh: 3, angry: 2, sad: 2, anxious: 1, awful: 0 };
                    const last7: number[] = [];
                    for (let d = 6; d >= 0; d--) {
                      const date = new Date(); date.setDate(date.getDate() - d);
                      const ds = date.toLocaleDateString("cs-CZ");
                      const dayLogs = moodLog.filter((l: any) => l.ts.startsWith(ds));
                      if (dayLogs.length === 0) { last7.push(-1); continue; }
                      const avg = dayLogs.reduce((s: number, l: any) => s + (moodScore[l.mood.id] ?? 3), 0) / dayLogs.length;
                      last7.push(avg);
                    }
                    const dayLabels = ["Ne","Po","Út","St","Čt","Pá","So"];
                    const today = new Date().getDay();
                    return last7.map((v, i) => {
                      const dayIdx = (today - 6 + i + 7) % 7;
                      const h = v < 0 ? 4 : Math.max(8, (v / 5) * 56);
                      const color = v < 0 ? T.t3 : v >= 4 ? T.teal : v >= 2.5 ? T.accent : T.red;
                      return (
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                          <div style={{width:"100%",height:h,background:color,borderRadius:4,opacity:v<0?0.2:0.8,transition:"height .3s"}} />
                          <span style={{color:T.t3,fontSize:9}}>{dayLabels[dayIdx]}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* AI insight summary */}
              <div style={{background:`linear-gradient(135deg, ${T.accent}10, ${T.purple}08)`,border:`1px solid ${T.accent}20`,borderRadius:16,padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:18}}>💡</span>
                  <span style={{color:T.t1,fontSize:14,fontWeight:700}}>Opičí analýza</span>
                </div>
                {(() => {
                  const counts: Record<string, number> = {};
                  moodLog.forEach((l: any) => { counts[l.mood.id] = (counts[l.mood.id] || 0) + 1; });
                  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                  const topMood = MOODS.find(m => m.id === top?.[0]);
                  const topReasonCounts: Record<string, number> = {};
                  moodLog.forEach((l: any) => { if (l.reason) topReasonCounts[l.reason.id] = (topReasonCounts[l.reason.id] || 0) + 1; });
                  const topR = Object.entries(topReasonCounts).sort((a, b) => b[1] - a[1])[0];
                  const topReason = REASONS.find(r => r.id === topR?.[0]);
                  return (
                    <div style={{color:T.t2,fontSize:13,lineHeight:1.6}}>
                      Tvoje nejčastější nálada je <span style={{color:topMood?.color||T.accent,fontWeight:700}}>{topMood?.label || "?"}</span>
                      {topReason && <>, hlavně kvůli <span style={{color:T.accent,fontWeight:700}}>{topReason.label.toLowerCase()}</span></>}.
                      {top && Number(top[1]) >= 3 && <> Zkus se zaměřit na to, co ti pomáhá v těchto momentech. 🐵</>}
                    </div>
                  );
                })()}
              </div>
            </>
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
          <button onClick={()=>setContacts(p=>[...p,{name:"",phone:""}])} style={{padding:"8px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:16}}>+ Přidat kontakt</button>
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
          <textarea value={diary} onChange={(e)=>setDiary(e.target.value)} rows={12} placeholder="Vysyp hlavu... co ti běží hlavou?" style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,color:T.t1,padding:16,fontSize:14,fontFamily:"inherit",resize:"none",lineHeight:1.7}}/>
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
    stopWebAudio();
    setMusicGenre(genre);
    setMusicLoading(true);
    setMusicPlaying(false);
    setMusicError(null);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ prompt: genre.prompt, duration: 22 }),
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
  const [tab, setTab] = useState("feel");
  const [showSOS, setShowSOS] = useState(false);
  const [moodLog, setMoodLog] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [xp, setXp] = useState(() => Number(localStorage.getItem("mm_xp") || "0"));
  const [completedQuests, setCompletedQuests] = useState<string[]>(() => JSON.parse(localStorage.getItem("mm_quests") || "[]"));
  const [equippedSkin, setEquippedSkin] = useState(() => localStorage.getItem("mm_skin") || "default");
  const [userName, setUserName] = useState(() => localStorage.getItem("mm_name") || "");
  const [avatar, setAvatar] = useState<string|null>(() => localStorage.getItem("mm_avatar"));
  const fileRef = useRef<HTMLInputElement>(null);
  const [xpPopup, setXpPopup] = useState<{xp:number;label:string}|null>(null);
  const [levelUp, setLevelUp] = useState<{level:number;skin?:typeof MONKEY_SKINS[0]|null}|null>(null);
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [recs, setRecs] = useState<any>(null);

  const handleNameChange = (n: string) => { setUserName(n); localStorage.setItem("mm_name", n); };
  const handleAvatar = (e: any) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onload = (ev: any) => { setAvatar(ev.target.result); localStorage.setItem("mm_avatar", ev.target.result); }; r.readAsDataURL(f); }
  };

  const completeQuest = (questId: string) => {
    const key = `${new Date().toISOString().split("T")[0]}:${questId}`;
    if (completedQuests.includes(key)) return;
    const quest = DAILY_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    const newQ = [...completedQuests, key];
    setCompletedQuests(newQ);
    localStorage.setItem("mm_quests", JSON.stringify(newQ));
    const oldLevel = Math.floor(xp / 100) + 1;
    const newXp = xp + quest.xp;
    const newLevel = Math.floor(newXp / 100) + 1;
    setXp(newXp);
    localStorage.setItem("mm_xp", String(newXp));
    // XP popup
    setXpPopup({ xp: quest.xp, label: quest.label });
    // Level up check
    if (newLevel > oldLevel) {
      const newSkin = MONKEY_SKINS.find(s => s.xpNeeded <= newXp && s.xpNeeded > xp) || null;
      setTimeout(() => setLevelUp({ level: newLevel, skin: newSkin }), 1200);
    }
  };
  const equipSkin = (id: string) => {
    setEquippedSkin(id); localStorage.setItem("mm_skin", id);
    const skin = MONKEY_SKINS.find(s => s.id === id);
    if (skin) setXpPopup({ xp: 0, label: `${skin.name} nasazen!` });
  };
  const currentSkinImg = MONKEY_SKINS.find(s => s.id === equippedSkin)?.img || monkeyHero;

  const selectMood = (m: any) => { setSelectedMood(m); setStep(2); };
  const selectReason = (r: any) => {
    setSelectedReason(r);
    setMoodLog(p => [{ mood: selectedMood, reason: r, ts: new Date().toLocaleString("cs-CZ"), id: Date.now() }, ...p.slice(0, 99)]);
    setStreakCount(p => p + 1);
    setRecs(getRecommendations(selectedMood, r));
    setStep(3);
    completeQuest("checkin");
    if (streakCount + 1 >= 3) completeQuest("streak3");
    if (streakCount + 1 >= 7) completeQuest("streak7");
  };
  const resetFlow = () => { setStep(1); setSelectedMood(null); setSelectedReason(null); setRecs(null); };

  const lastMoodMonkey = selectedMood ? MOOD_MONKEY[selectedMood.id] : (moodLog.length > 0 ? MOOD_MONKEY[moodLog[0].mood.id] : null);

  return (
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
      {xpPopup && <XpPopup xp={xpPopup.xp} label={xpPopup.label} onDone={() => setXpPopup(null)} />}
      {levelUp && <LevelUpOverlay level={levelUp.level} skin={levelUp.skin} onDone={() => setLevelUp(null)} />}

      <div style={{flex:1,overflowY:"auto",padding:"0 16px 16px",display:"flex",flexDirection:"column"}}>
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
                  <span style={{color:T.accent,fontSize:13,fontWeight:800}}>{streakCount} dní v řadě 🔥</span>
                </div>
              </div>
              {lastMoodMonkey ? (
                <img src={lastMoodMonkey} alt="" className="anim-monkeyBob" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              ) : (
                <img src={currentSkinImg} alt="" className="anim-float" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              )}
            </div>

            {/* STEP 1 — mood grid */}
            {step === 1 && (
              <>
                <div className="anim-fadeUp" style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,padding:16,background:`linear-gradient(135deg, ${T.accent}15, transparent)`,borderRadius:20,border:`1px solid ${T.accent}20`}}>
                  <img src={monkeyHero} alt="" className="tab-monkey" style={{width:64,height:64,objectFit:"contain"}} />
                  <div>
                    <div style={{color:T.t1,fontSize:22,fontWeight:900,letterSpacing:-0.5}}>Jak se cítíš?</div>
                    <div style={{color:T.t2,fontSize:13,marginTop:2}}>Vyber náladu — tvoje opice ti poradí</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {MOODS.map((m, i) => (
                    <button key={m.id} onClick={()=>selectMood(m)} className={`reason-card anim-fadeUp anim-d${i+1}`} style={{display:"flex",alignItems:"center",gap:10,padding:12,background:`linear-gradient(135deg, ${m.color}08, transparent)`,border:`1px solid ${m.color}20`,borderRadius:14,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <img src={MOOD_MONKEY[m.id]} alt={m.label} style={{width:44,height:44,objectFit:"contain",borderRadius:10}} loading="lazy" />
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{color:T.t1,fontSize:14,fontWeight:800}}>{m.label}</div>
                        <div style={{color:T.t2,fontSize:10,marginTop:1}}>{m.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 — why */}
            {step === 2 && (
              <>
                <button onClick={()=>{setStep(1);setSelectedMood(null)}} style={{background:"none",border:"none",color:T.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12,display:"flex",alignItems:"center",gap:4}}>← Zpět</button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:12,background:`linear-gradient(135deg, ${selectedMood.color}12, transparent)`,borderRadius:14,border:`1px solid ${selectedMood.color}25`}}>
                  <img src={MOOD_MONKEY[selectedMood.id] || monkeyHero} alt="" style={{width:48,height:48,objectFit:"contain"}} loading="lazy" />
                  <div>
                    <div style={{color:T.t1,fontSize:15,fontWeight:700}}>Cítíš se: {selectedMood.label}</div>
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

            {/* STEP 3 — tailored results (merged: speeches + breathing + tools) */}
            {step === 3 && recs && (
              <>
                <button onClick={resetFlow} style={{background:"none",border:"none",color:T.accent,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>← Nový check-in</button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:12,background:`linear-gradient(135deg, ${selectedMood.color}12, transparent)`,borderRadius:14,border:`1px solid ${selectedMood.color}25`}}>
                  <img src={EMO_MONKEY[recs.emo] || monkeyHero} alt="" style={{width:48,height:48,objectFit:"contain"}} loading="lazy" />
                  <div>
                    <div style={{color:T.t1,fontSize:14,fontWeight:700}}>{selectedMood.label} · {selectedReason.label}</div>
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
                    {recs.speeches.map((s: any) => (
                      <div key={s.id} className="speech-card" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <span style={{fontSize:22}}>{s.icon}</span>
                          <div>
                            <div style={{color:T.t1,fontSize:15,fontWeight:800}}>{s.title}</div>
                            <span style={{color:T.t2,fontSize:11}}>{s.src}</span>
                          </div>
                        </div>
                        <div style={{color:T.t2,fontSize:13,marginBottom:10,lineHeight:1.5}}>{s.text.substring(0,140)}...</div>
                        <SpeechPlayer text={s.text} label="Přehraj řeč" speechId={s.id} emotion={s.emo}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breathing */}
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <img src={monkeyZen} alt="" style={{width:32,height:32,objectFit:"contain"}} loading="lazy" />
                    <span style={{color:T.t1,fontSize:16,fontWeight:800}}>Zklidni opici — dýchej</span>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16}}>
                    <BreathingExercise type={recs.breathType}/>
                  </div>
                </div>

                {/* Heavy metal */}
                {recs.showMetal && (
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                      <img src={monkeyMusic} alt="" style={{width:28,height:28,objectFit:"contain"}} loading="lazy"/>
                      <span style={{color:T.t1,fontSize:16,fontWeight:800}}>Vypusť páru</span>
                    </div>
                    <button onClick={()=>{try{const c=new (window.AudioContext||(window as any).webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.type="sawtooth";o.frequency.value=82+Math.random()*40;g.gain.value=0.3;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+4);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+4)}catch(e){}}} style={{width:"100%",padding:"16px",background:T.redDim,border:`1px solid ${T.red}30`,borderRadius:16,color:T.red,fontSize:18,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
                      🤘 HEAVY METAL — BLAST 🔊
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
                          <input placeholder={s.q} style={{flex:1,padding:8,background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Talk to Opičák CTA */}
                <button onClick={()=>setTab("chat")} className="reason-card" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:16,background:`linear-gradient(135deg, ${T.teal}12, ${T.blue}08)`,border:`1px solid ${T.teal}25`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:10}}>
                  <img src={monkeyChat} alt="" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
                  <div>
                    <div style={{color:T.t1,fontSize:15,fontWeight:800}}>Chceš si promluvit? 🐵</div>
                    <div style={{color:T.t2,fontSize:12}}>Opičák ti pomůže — pokecej s ním</div>
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
        {tab === "chat" && <MonkeyChat />}

        {/* ════════ QUESTS TAB ════════ */}
        {tab === "quests" && <QuestsTab xp={xp} completedQuests={completedQuests} onEquipSkin={equipSkin} equippedSkin={equippedSkin} />}

        {/* ════════ PROFILE TAB ════════ */}
        {tab === "profile" && (
          <ProfileTab moodLog={moodLog} streakCount={streakCount} userName={userName} avatar={avatar} onNameChange={handleNameChange} onAvatarClick={()=>fileRef.current?.click()} />
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
  );
}
