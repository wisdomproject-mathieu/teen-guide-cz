import { useState, useEffect, useRef, useCallback } from "react";
import monkeyHero from "@/assets/monkey-hero.png";
import monkeySad from "@/assets/monkey-sad.png";
import monkeyAngry from "@/assets/monkey-angry.png";
import monkeyZen from "@/assets/monkey-zen.png";
import monkeyAnxious from "@/assets/monkey-anxious.png";
import monkeySos from "@/assets/monkey-sos.png";
import monkeyLearn from "@/assets/monkey-learn.png";
import monkeyTrain from "@/assets/monkey-train.png";
import monkeyGreat from "@/assets/monkey-great.png";
import monkeyMeh from "@/assets/monkey-meh.png";
import monkeyBad from "@/assets/monkey-bad.png";
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
import monkeyShield from "@/assets/monkey-shield.png";
import monkeyMusic from "@/assets/monkey-music.png";
import monkeyGamer from "@/assets/monkey-gamer.png";
import monkeyGender from "@/assets/monkey-gender.png";
import monkeyAngryMood from "@/assets/monkey-angry-mood.png";
import monkeyAnxiousMood from "@/assets/monkey-anxious-mood.png";
import monkeyPumped from "@/assets/monkey-pumped.png";
import monkeySadMood from "@/assets/monkey-sad-mood.png";

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

// ── SPEECHES (expanded per mood+reason) ──
const SPEECHES=[
// ANGER speeches
{id:"s1",emo:"anger",reason:["siblings","parents"],icon:"🔥",title:"Je to těžké? Dobře.",src:"Jocko Willink",color:"#FF3B5C",text:"Je to těžké? Dobře. Jocko Willink říká: když je těžce — dobře. Protože to tě posiluje. Každý moment kdy to bolí — to je přesně ten moment, kdy se z tebe stane někdo jiný. Silnější. Tvrdší. Lepší. Takže díky, brácho. Díky za tu bolest."},
{id:"s2",emo:"anger",reason:["siblings","friends"],icon:"🔥",title:"Přeměň vztek v palivo.",src:"David Goggins",color:"#FF3B5C",text:"Slyšíš ten vztek uvnitř? Goggins říká — to není tvůj nepřítel. To je palivo. Záleží jen na tom, co s ním uděláš. Tvůj vztek je energie — čistá, surová, brutální. Rozhodl ses jak ji utratit? Nebo ji necháš, aby tě spálila zevnitř?"},
{id:"s3",emo:"anger",reason:["siblings","parents","friends"],icon:"🧠",title:"6 minut. Pak se rozhodni.",src:"Neurověda",color:"#FF3B5C",text:"Zastav se. Tvůj mozek je teď unešen amygdalou. Prefrontální kortex je offline. Za 6 minut chemie opadne. Nezavolej. Nepiš zprávu. Jen dýchej. Počítej do 360. Pak se rozhodni — s hlavou, ne s žaludkem."},
{id:"s4",emo:"anger",reason:["school","parents"],icon:"🏛",title:"Kontroluješ jen jednu věc.",src:"Marcus Aurelius",color:"#FF3B5C",text:"Marcus Aurelius vládl celé říši. A každé ráno si připomínal: kontroluji jen svou reakci. Ne co se stalo. Jen jak odpovím. Budeš řízen vztekem, nebo budeš vztek řídit ty? Imperátor, nebo otrok?"},
{id:"s18",emo:"anger",reason:["school"],icon:"⚡",title:"Zkoušky nejsou o tobě.",src:"Motivace",color:"#FF3B5C",text:"Víš co je ve skutečnosti ta zkouška? Test papíru. Ne test tebe. Ty jsi víc než známka. Víc než číslo. Tvůj vztek na systém je oprávněný — ale použij ho. Uč se jako rebel. Ukaž jim, že to zvládneš navzdory."},
{id:"s19",emo:"anger",reason:["social"],icon:"💥",title:"Algoritmus tě provokuje.",src:"Cal Newport",color:"#FF3B5C",text:"Víš proč jsi naštvanej? Protože aplikace jsou navržený, aby tě provokoval. Vztek = engagement = peníze pro ně. Pokaždý, když se naštveš online, někdo na tom vydělá. Chceš být produkt, nebo hráč?"},
{id:"s20",emo:"anger",reason:["identity"],icon:"🔥",title:"Vztek je kompas.",src:"Jordan Peterson",color:"#FF3B5C",text:"Peterson říká: vztek ti ukazuje, kde jsou tvé hranice. Kde jsi řekl 'ano' a měl říct 'ne'. Nepotlačuj ho. Poslouchej ho. A pak jednaj — ale s přesností chirurga, ne s brutalitou kladiva."},
// SADNESS speeches
{id:"s5",emo:"sadness",reason:["friends","lonely"],icon:"🌅",title:"Tma je nejtemnější před svítáním.",src:"Les Brown",color:"#4A8FFF",text:"Les Brown vyrostl v chudobě, ztratil vše. A říká: nejtemnější je vždy těsně před svítáním. Ty teď jsi v té temnotě. Ale jsi blíž než kdy jindy. Vydržet — to je největší výkon. A ty ho právě podáváš."},
{id:"s6",emo:"sadness",reason:["identity","lonely"],icon:"💎",title:"Tvoje bolest tě přetváří.",src:"Carl Jung",color:"#4A8FFF",text:"Jung říkal, že lidé nepřijdou ke svému já skrze světlo — ale skrze temnotu. Ty teď jsi v dolině. Ale dolina je kde rosteš. Diamanty vznikají pod tlakem. A ty jsi pod tlakem právě teď."},
{id:"s7",emo:"sadness",reason:["friends","parents"],icon:"💪",title:"Cítit je síla.",src:"Brené Brown",color:"#4A8FFF",text:"Víš co je na smutku? Dokazuje, že ti záleží. Ty cítíš — protože jsi dost chytrý a dost lidský na to, aby tě věci zasáhly. Ta schopnost cítit — to je tvoje největší síla. Ne slabost."},
{id:"s8",emo:"sadness",reason:["school","identity"],icon:"👟",title:"Jeden krok. Jen jeden.",src:"Eric Thomas",color:"#4A8FFF",text:"Eric Thomas vyrostl jako bezdomovec. Říká: stačilo mi vidět první schod. Ty nemusíš vidět jak to dopadne. Potřebuješ jen jeden krok. A pak další. A pak ještě jeden. To je celé tajemství."},
{id:"s21",emo:"sadness",reason:["parents"],icon:"🌊",title:"Oni taky bojují.",src:"Motivace",color:"#4A8FFF",text:"Tvoji rodiče nejsou dokonalí. Nikdy nebyli. Ale většina z nich dělá to nejlepší, co umí — i když to nevypadá. Jejich láska je někdy neohrabaná, ale je tam. Smutek z toho je normální. A je to OK."},
{id:"s22",emo:"sadness",reason:["siblings"],icon:"💙",title:"Sourozenci = celoživotní tým.",src:"Psychologie",color:"#4A8FFF",text:"Hádky s bráchou nebo ségrou bolí jinak. Protože je to rodina — nikam neutečeš. Ale jednou budou tvoji nejbližší lidi na světě. Tahle bolest je investice do budoucnosti, i když to teď tak nevypadá."},
{id:"s23",emo:"sadness",reason:["social"],icon:"📱",title:"Scrolluješ, ale necítíš se líp.",src:"Jonathan Haidt",color:"#4A8FFF",text:"Haidt dokázal, že čím víc scrolluješ, tím hůř se cítíš. Instagram ukazuje highlights jiných a tvoje lowlights. Polož telefon. Jdi ven. Pět minut. Smutná opice potřebuje vzduch, ne pixely."},
// ANXIETY speeches
{id:"s9",emo:"anxiety",reason:["school","social"],icon:"🎭",title:"Strach je lhář.",src:"Neurověda",color:"#FF7A2F",text:"95% věcí ze kterých se bojíme se nikdy nestane. Amygdala je přehnaně dramatická — byla naprogramována pro tygry, ne pro zkoušky. Tvůj strach není pravda. Je to jen starý software běžící na novém hardwaru."},
{id:"s10",emo:"anxiety",reason:["school","identity"],icon:"🎯",title:"Zkrať horizont.",src:"David Goggins",color:"#FF7A2F",text:"Goggins říká: když je maraton nejhorší, dívám se jen 10 metrů dopředu. Příštích deset minut. Co zvládneš teď? Jeden malý krok. Nemysli na zítra. Zítra neexistuje."},
{id:"s11",emo:"anxiety",reason:["social","identity"],icon:"🌊",title:"Ty nejsi své myšlenky.",src:"CBT & Meditace",color:"#FF7A2F",text:"Myšlenka je jen myšlenka. Není to ty. Představ si řeku — myšlenky jsou lodě. Ty je nemusíš nastoupit. Ty jsi břeh. Břeh se nehýbe. Stůj pevně a nech lodě plout."},
{id:"s24",emo:"anxiety",reason:["parents"],icon:"🛡",title:"Jejich očekávání ≠ tvůj osud.",src:"Viktor Frankl",color:"#FF7A2F",text:"Frankl přežil koncentrák a říká: poslední lidská svoboda je vybrat si svůj postoj. Rodiče mají plány. Učitelé mají plány. Ale tvůj příběh píšeš ty. Úzkost z jejich očekávání nemusí být tvůj motor."},
{id:"s25",emo:"anxiety",reason:["friends"],icon:"🎪",title:"Nikdo se na tebe tak nedívá.",src:"Spotlight Effect",color:"#FF7A2F",text:"Psychologie to nazývá 'spotlight effect'. Myslíš, že se na tebe všichni dívají. Ve skutečnosti každý řeší sám sebe. Nikdo si nevšiml toho, co tě trápí. Jsi svobodnější, než si myslíš."},
{id:"s26",emo:"anxiety",reason:["lonely"],icon:"🧘",title:"Klid v chaosu.",src:"Wim Hof",color:"#FF7A2F",text:"Wim Hof říká: dech je tvůj kotevní bod. Když se všechno točí, vrať se k dechu. Nadechni se. 4 sekundy. Zadrž. 4 sekundy. Vydechni. 4 sekundy. Opakuj. Opice se uklidňuje."},
// FEAR speeches
{id:"s12",emo:"fear",reason:["school","friends"],icon:"🦁",title:"Udělej to se strachem.",src:"Brené Brown",color:"#A855F7",text:"Odvaha není absence strachu. Brené Brown říká: každý člověk, který dělal něco velkého — byl vyděšený. Každý. Rozdíl je v tom, kdo šel dál přesto. Strach je vstupenka. Zaplať a jdi."},
{id:"s13",emo:"fear",reason:["identity","parents"],icon:"⚔",title:"Premeditatio malorum.",src:"Stoicismus",color:"#A855F7",text:"Představ si nejhorší scénář. Přežil bys to? Pravděpodobně ano. Epiktétos byl otrok. Marcus Aurelius čelil moru. Přežili. Ty taky přežiješ. Co tě nezabije, to tě upgradne."},
{id:"s27",emo:"fear",reason:["social"],icon:"🎭",title:"Strach z odmítnutí je iluze.",src:"Psychologie",color:"#A855F7",text:"Tvůj mozek zpracovává sociální odmítnutí stejně jako fyzickou bolest. Ale je to bug, ne feature. Odmítnutí neznamená, že jsi bezcenný. Znamená jen, že jeden člověk měl jiný pohled. To je vše."},
{id:"s28",emo:"fear",reason:["lonely"],icon:"🌟",title:"Samota ≠ osamělost.",src:"Rainer Maria Rilke",color:"#A855F7",text:"Rilke psal: 'Přijmi svou samotu a miluj ji. Práce, která z ní vzejde, bude překrásná.' Největší umělci, vědci, filozofové — všichni znali samotu. A udělali z ní zlato."},
// LONELY speeches
{id:"s14",emo:"lonely",reason:["lonely","friends"],icon:"🔬",title:"Velcí lidé jsou budovaní v tichu.",src:"Jordan Peterson",color:"#6C7EB7",text:"Nejlepší myšlenky vznikají v tichu. Newton vymyslel gravitaci v karanténě. Da Vinci trávil hodiny sám. Tvoje osamělost je laboratoř. Co v ní vynalezneš?"},
{id:"s29",emo:"lonely",reason:["school"],icon:"🎧",title:"Jsi v tom sám? Ne.",src:"Statistika",color:"#6C7EB7",text:"46% teenagerů říká, že se cítí osamělí. Skoro polovina. Takže i ten kluk vedle tebe v lavici. I ta holka co vypadá, že má všechno. Nejsi sám v tom, že jsi sám."},
{id:"s30",emo:"lonely",reason:["social","identity"],icon:"🌍",title:"Online přátelství ≠ přátelství.",src:"Sherry Turkle",color:"#6C7EB7",text:"Turkle z MIT říká: jsme 'spolu sami'. 500 followerů, ale nikdo, komu zavoláš ve 2 ráno. Skutečný connection vyžaduje zranitelnost. A to je těžké. Ale stojí to za to."},
// OVERWHELM speeches
{id:"s15",emo:"overwhelm",reason:["school","social"],icon:"📋",title:"Jeden den. Jedna věc.",src:"Jocko Willink",color:"#00D4AA",text:"Když je lista nekonečná — udělej jen jednu věc. Ale dobře. Jeden den. Jedna priorita. Co je ta jedna věc dnes? Zapomeň na zbytek. Jen tuhle jednu. Tady. Teď."},
{id:"s31",emo:"overwhelm",reason:["parents","identity"],icon:"🧩",title:"Nemůžeš všechno.",src:"Esencialismus",color:"#00D4AA",text:"Greg McKeown říká: 'Pokud to není jasné ANO, je to NE.' Nemůžeš chodit na kroužky, mít samý jedničky, být populární a mít se dobře. Vyber si 2. Zbytek nech být."},
// ALL speeches
{id:"s16",emo:"all",reason:[],icon:"🐵",title:"Opice není ty.",src:"Monkey Mind",color:"#FF7A2F",text:"Ta opice v tvé hlavě — co skáče a křičí — to není ty. Ty jsi ten, kdo ji pozoruje. A pozorovatel je vždy silnější. Kdo má dnes kontrolu? Opice, nebo ty?"},
{id:"s17",emo:"all",reason:[],icon:"⚡",title:"Puberta je superpower.",src:"Motivace",color:"#FF7A2F",text:"Zlato se čistí v ohni. Ocel se kalí v chladu. Ty se stáváš silnějším právě teď. Puberta je nejtěžší přestavba mozku v celém životě. A ty ji přežíváš. To je výkon."},
{id:"s32",emo:"all",reason:[],icon:"🧬",title:"Tvůj mozek se mění.",src:"Neurověda",color:"#FF7A2F",text:"Mezi 12 a 25 se tvůj mozek kompletně přestavuje. Myelin. Synapse. Prefrontální kortex. Jsi doslova pod rekonstrukcí. Takže když se cítíš divně — to není bug. To je update."},
];

// ── MOODS (expanded, cooler) ──
const MOODS=[
  {id:"great",label:"Skvěle",sub:"Mám energii, svět je můj",color:T.teal},
  {id:"pumped",label:"Nabitej/á",sub:"Ready na cokoliv",color:T.blue},
  {id:"meh",label:"Tak nějak",sub:"Nic moc, nic málo",color:T.accent},
  {id:"angry",label:"Naštvanej/á",sub:"Všechno mě sere",color:T.red},
  {id:"sad",label:"Smutnej/á",sub:"Bolí to uvnitř",color:T.purple},
  {id:"anxious",label:"Úzkostnej/á",sub:"Svírá mě to",color:"#FF7A2F"},
  {id:"awful",label:"Na dně",sub:"Nevím co dál",color:T.red},
];
const MOOD_TO_EMO: Record<string, string>={great:"all",pumped:"all",meh:"anxiety",angry:"anger",sad:"sadness",anxious:"anxiety",awful:"sadness"};

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

// ── RECOMMENDATION ENGINE ──
function getRecommendations(mood: any, reason: any) {
  const emoMap: Record<string,string> = {great:"all",pumped:"all",meh:"anxiety",angry:"anger",sad:"sadness",anxious:"anxiety",awful:"sadness"};
  const realEmo = emoMap[mood?.id] || "all";

  let speeches = SPEECHES.filter(s => {
    if (s.emo === "all") return true;
    if (s.emo !== realEmo) return false;
    if (s.reason.length === 0) return true;
    return s.reason.includes(reason?.id);
  }).slice(0, 4);

  if (speeches.length < 2) {
    speeches = SPEECHES.filter(s => s.emo === realEmo || s.emo === "all").slice(0, 4);
  }

  const breathType = realEmo === "anxiety" ? "sleep" : "box";
  const showMetal = realEmo === "anger" || reason?.id === "siblings";
  const showGrounding = realEmo === "anxiety" || realEmo === "fear";

  return { speeches, breathType, showMetal, showGrounding, emo: realEmo };
}

// ── Audio cache ──
const audioCache = new Map<string, string>();

// ── SPEECH PLAYER (ElevenLabs TTS) ──
function SpeechPlayer({text, label, speechId, emotion}: {text: string; label: string; speechId: string; emotion: string}) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async () => {
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    const cacheKey = speechId;
    let audioUrl = audioCache.get(cacheKey);
    if (!audioUrl) {
      setLoading(true);
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ text, emotion }),
        });
        if (!response.ok) throw new Error(`TTS failed: ${response.status}`);
        const audioBlob = await response.blob();
        audioUrl = URL.createObjectURL(audioBlob);
        audioCache.set(cacheKey, audioUrl);
      } catch (err) {
        console.error("TTS error:", err); setLoading(false);
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

// ── PROFILE PANEL ──
function ProfilePanel({onClose, moodLog, streakCount, userName, avatar}: {onClose:()=>void; moodLog:any[]; streakCount:number; userName:string; avatar:string|null}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [contacts, setContacts] = useState([{name:"",phone:""}]);
  const [diary, setDiary] = useState("");

  const days = ["Po","Út","St","Čt","Pá","So","Ne"];
  const calendarWeeks: any[] = [];
  for(let w=0;w<4;w++){const week=[];for(let d=0;d<7;d++){const dayIdx=w*7+d;week.push(moodLog[dayIdx]||null)}calendarWeeks.push(week)}

  return (
    <div style={{position:"fixed",inset:0,background:T.bg,zIndex:9998,display:"flex",flexDirection:"column",overflow:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.t2,fontSize:18,cursor:"pointer",fontFamily:"inherit"}}>←</button>
        <div style={{color:T.t1,fontSize:18,fontWeight:800}}>Můj profil</div>
      </div>
      <div style={{padding:20,flex:1,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:avatar?"none":T.card,border:`2px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
            {avatar ? <img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <img src={monkeyHero} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>}
          </div>
          <div>
            <div style={{color:T.t1,fontSize:17,fontWeight:800}}>{userName || "Opičák"}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{color:T.accent,fontSize:28,fontWeight:900}}>{streakCount}</span>
              <span style={{color:T.t2,fontSize:13}}>dní v řadě 🔥</span>
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:20,paddingBottom:4}}>
          {[{id:"overview",label:"📊 Přehled"},{id:"contacts",label:"📞 SOS kontakty"},{id:"diary",label:"📝 Deník"},{id:"calendar",label:"📅 Historie"}].map(s=>
            <button key={s.id} onClick={()=>setActiveSection(s.id)} style={{padding:"7px 12px",background:activeSection===s.id?T.accentDim:T.card,border:`1px solid ${activeSection===s.id?T.accent:T.border}`,borderRadius:99,color:activeSection===s.id?T.accent:T.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{s.label}</button>
          )}
        </div>

        {activeSection==="overview" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,textAlign:"center"}}>
                <div style={{color:T.accent,fontSize:28,fontWeight:900}}>{moodLog.length}</div>
                <div style={{color:T.t2,fontSize:12}}>Check-inů celkem</div>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,textAlign:"center"}}>
                <div style={{color:T.accent,fontSize:28,fontWeight:900}}>{streakCount}🔥</div>
                <div style={{color:T.t2,fontSize:12}}>Aktuální streak</div>
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
                <img src={monkeyHero} alt="" style={{width:28,height:28,objectFit:"contain"}}/>
                <span style={{color:T.t1,fontSize:14,fontWeight:700}}>Tip od opice</span>
              </div>
              <div style={{color:T.t2,fontSize:13,lineHeight:1.6}}>Každý den, kdy otevřeš appku a řekneš jak se cítíš, je den, kdy ovládáš svou opici. Streak roste — a s ním i ty. 🐵</div>
            </div>
          </div>
        )}

        {activeSection==="contacts" && (
          <div>
            <div style={{color:T.t2,fontSize:13,marginBottom:16}}>Tvoje bezpečné čísla. Když bude zle, najdeš je tu.</div>
            {contacts.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={c.name} onChange={(e)=>{const n=[...contacts];n[i].name=e.target.value;setContacts(n)}} placeholder="Jméno" style={{flex:1,padding:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
                <input value={c.phone} onChange={(e)=>{const n=[...contacts];n[i].phone=e.target.value;setContacts(n)}} placeholder="Telefon" style={{width:120,padding:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
              </div>
            ))}
            <button onClick={()=>setContacts(p=>[...p,{name:"",phone:""}])} style={{padding:"8px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Přidat kontakt</button>
            <div style={{marginTop:16,padding:14,background:T.redDim,border:`1px solid ${T.red}20`,borderRadius:14}}>
              <div style={{color:T.red,fontSize:15,fontWeight:800}}>📞 Linka bezpečí: 116 111</div>
              <div style={{color:T.t2,fontSize:12}}>Nonstop, zdarma, anonymně</div>
            </div>
          </div>
        )}

        {activeSection==="diary" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span>🔒</span>
              <span style={{color:T.t2,fontSize:13}}>Jen pro tebe. Nikdo jiný to neuvidí.</span>
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
            {moodLog.length === 0 && <div style={{color:T.t3,fontSize:13,textAlign:"center",padding:20}}>Zatím žádné záznamy. Začni check-inem! 🐵</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SOS OVERLAY ──
function SOSOverlay({onClose}: {onClose:()=>void}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.94)",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:24}}>
      <img src={monkeySos} alt="SOS" style={{width:100,height:100,objectFit:"contain",filter:"drop-shadow(0 0 30px rgba(255,59,92,0.5))"}} />
      <div style={{color:T.t1,fontSize:22,fontWeight:800}}>Co ti teď pomůže?</div>
      {[{img:monkeyAngry,label:"Motivační řeč",sub:"Goggins, Jocko, Les Brown…",color:T.accent},{img:monkeyMusic,label:"Těžká hudba",sub:"Nech vztek ven",color:T.red},{img:monkeyZen,label:"Dýchání",sub:"Box breathing",color:T.teal}].map((o,i)=>
        <button key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:340,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
          <img src={o.img} alt={o.label} style={{width:50,height:50,objectFit:"contain",borderRadius:14}} loading="lazy" />
          <div><div style={{color:T.t1,fontSize:16,fontWeight:700}}>{o.label}</div><div style={{color:T.t2,fontSize:12}}>{o.sub}</div></div>
        </button>
      )}
      <a href="tel:116111" style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:T.redDim,border:`1px solid ${T.red}40`,borderRadius:16,width:"100%",maxWidth:340,textDecoration:"none"}}>
        <span style={{fontSize:24}}>📞</span>
        <div><div style={{color:T.red,fontSize:22,fontWeight:900}}>116 111</div><div style={{color:T.t2,fontSize:12}}>Linka bezpečí — nonstop, zdarma</div></div>
      </a>
      <button onClick={onClose} style={{padding:"10px 28px",background:"none",border:`1px solid ${T.t3}`,borderRadius:99,color:T.t2,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>✕ Zavřít</button>
    </div>
  );
}

// ══════════════════════════════
// ── MAIN APP ──
// ══════════════════════════════
export default function Index() {
  const [tab, setTab] = useState("feel");
  const [showSOS, setShowSOS] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [moodLog, setMoodLog] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [userName, setUserName] = useState(() => localStorage.getItem("mm_name") || "");
  const [avatar, setAvatar] = useState<string|null>(() => localStorage.getItem("mm_avatar"));
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [recs, setRecs] = useState<any>(null);

  const handleNameChange = (n: string) => { setUserName(n); localStorage.setItem("mm_name", n); };
  const handleAvatar = (e: any) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onload = (ev: any) => { setAvatar(ev.target.result); localStorage.setItem("mm_avatar", ev.target.result); }; r.readAsDataURL(f); }
  };

  const selectMood = (m: any) => { setSelectedMood(m); setStep(2); };
  const selectReason = (r: any) => {
    setSelectedReason(r);
    setMoodLog(p => [{ mood: selectedMood, reason: r, ts: new Date().toLocaleString("cs-CZ"), id: Date.now() }, ...p.slice(0, 99)]);
    setStreakCount(p => p + 1);
    const rec = getRecommendations(selectedMood, r);
    setRecs(rec);
    setStep(3);
  };
  const resetFlow = () => { setStep(1); setSelectedMood(null); setSelectedReason(null); setRecs(null); };

  // last mood monkey for profile bar animation
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
        @keyframes neonFlicker{0%,100%{opacity:1}50%{opacity:0.85}}
        @keyframes monkeyBob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-4px) rotate(-3deg)}75%{transform:translateY(-2px) rotate(3deg)}}
        .anim-fadeUp{animation:fadeUp .4s ease-out both}
        .anim-fadeIn{animation:fadeIn .3s ease-out both}
        .anim-slideIn{animation:slideInRight .4s ease-out both}
        .anim-bounce{animation:bounceIn .5s cubic-bezier(.36,1.1,.3,1) both}
        .anim-float{animation:float 3s ease-in-out infinite}
        .anim-monkeyBob{animation:monkeyBob 2s ease-in-out infinite}
        .anim-d1{animation-delay:.05s}.anim-d2{animation-delay:.1s}.anim-d3{animation-delay:.15s}.anim-d4{animation-delay:.2s}.anim-d5{animation-delay:.25s}.anim-d6{animation-delay:.3s}.anim-d7{animation-delay:.35s}
        .mood-btn{transition:all .25s ease;position:relative;overflow:hidden}
        .mood-btn:hover{transform:scale(1.02);filter:brightness(1.15);box-shadow:0 0 18px rgba(255,122,47,0.25),inset 0 0 12px rgba(255,122,47,0.06)}
        .mood-btn:active{transform:scale(0.97)}
        .card-hover{transition:all .25s cubic-bezier(.4,0,.2,1)}
        .card-hover:hover{transform:translateY(-3px);box-shadow:0 0 16px rgba(255,122,47,0.2),0 4px 20px rgba(0,0,0,0.3);border-color:rgba(255,122,47,0.35)!important}
        .card-hover:active{transform:scale(0.98)}
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
        .profile-input{background:transparent;border:none;outline:none;color:${T.t1};font-family:inherit;font-size:15px;font-weight:700;width:100%}
        .profile-input::placeholder{color:${T.t3}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.t3};border-radius:4px}
        input::placeholder,textarea::placeholder{color:${T.t3}}
      `}</style>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{display:"none"}}/>
      {showSOS && <SOSOverlay onClose={()=>setShowSOS(false)}/>}
      {showProfile && <ProfilePanel onClose={()=>setShowProfile(false)} moodLog={moodLog} streakCount={streakCount} userName={userName} avatar={avatar}/>}

      <div style={{flex:1,overflowY:"auto",padding:"0 16px 16px"}}>
        {/* ════════ FEEL TAB ════════ */}
        {tab === "feel" && (
          <div>
            {/* ── PROFILE BAR ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",marginBottom:4}}>
              <button onClick={()=>fileRef.current?.click()} style={{width:48,height:48,borderRadius:"50%",background:avatar?"none":`linear-gradient(135deg, ${T.accent}30, ${T.purple}30)`,border:`2px solid ${T.accent}50`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0,padding:0}}>
                {avatar ? <img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <img src={monkeyHero} alt="" style={{width:36,height:36,objectFit:"contain"}}/>}
              </button>
              <div style={{flex:1,minWidth:0}}>
                <input className="profile-input" value={userName} onChange={e=>handleNameChange(e.target.value)} placeholder="Tvoje jméno…" />
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                  <span style={{color:T.accent,fontSize:13,fontWeight:800}}>{streakCount} dní v řadě 🔥</span>
                  <span style={{color:T.t3,fontSize:11}}>•</span>
                  <span style={{color:T.t2,fontSize:11,cursor:"pointer"}} onClick={()=>setShowProfile(true)}>Profil →</span>
                </div>
              </div>
              {lastMoodMonkey && (
                <img src={lastMoodMonkey} alt="" className="anim-monkeyBob" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              )}
              {!lastMoodMonkey && (
                <img src={monkeyHero} alt="" className="anim-float" style={{width:44,height:44,objectFit:"contain",borderRadius:12}} />
              )}
            </div>

            {/* STEP 1 — mood grid (matches page 2 style) */}
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

            {/* STEP 2 */}
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

            {/* STEP 3 */}
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
                      <div style={{color:T.t2,fontSize:13,marginBottom:12}}>Z hlavy do přítomnosti — pojmenuj co vnímáš:</div>
                      {[{n:5,q:"Co vidíš?"},{n:4,q:"Co cítíš dotykem?"},{n:3,q:"Co slyšíš?"},{n:2,q:"Co cítíš vůní?"},{n:1,q:"Jaká chuť?"}].map(s=>
                        <div key={s.n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <span style={{color:T.accent,fontSize:20,fontWeight:900}}>{s.n}</span>
                          <input placeholder={s.q} style={{flex:1,padding:8,background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.t1,fontSize:13,fontFamily:"inherit"}}/>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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

        {/* ════════ LEARN TAB ════════ */}
        {tab === "learn" && (
          <div style={{paddingTop:16}} className="anim-fadeUp">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:16,background:`linear-gradient(135deg, ${T.purple}15, transparent)`,borderRadius:20,border:`1px solid ${T.purple}20`}}>
              <img src={monkeyLearn} alt="" className="tab-monkey" style={{width:72,height:72,objectFit:"contain"}} loading="lazy" />
              <div>
                <div style={{color:T.t1,fontSize:24,fontWeight:900,letterSpacing:-0.5}}>Pochop to</div>
                <div style={{color:T.t2,fontSize:13,marginTop:2}}>Věci co ti ve škole neřeknou</div>
              </div>
            </div>
            {[{img:monkeyGender,title:"Rozuměj klukům a holkám",sub:"Mars/Venus, komunikace, energie",color:T.purple},{img:monkeyWarrior,title:"Staň se válečníkem",sub:"Goggins, Jocko, Stoici, disciplína",color:T.red},{img:monkeyShield,title:"Nenech se zničit",sub:"NVC, hranice, šikana, CBT",color:T.teal},{img:monkeySocial,title:"Tvůj mozek vs. telefon",sub:"Haidt, dopamin, spánek, pozornost",color:T.accent},{img:monkeyIdentity,title:"Kdo jsi?",sub:"Identita, Frankl, Jung, puberta",color:T.blue}].map((g,i)=>
              <div key={i} className={`card-hover anim-slideIn anim-d${i+1}`} style={{display:"flex",alignItems:"center",gap:14,padding:16,background:`linear-gradient(135deg, ${g.color}08, transparent)`,border:`1px solid ${g.color}15`,borderRadius:16,marginBottom:10,cursor:"pointer"}}>
                <img src={g.img} alt={g.title} style={{width:44,height:44,objectFit:"contain",borderRadius:12}} loading="lazy" />
                <div style={{flex:1}}><div style={{color:T.t1,fontSize:15,fontWeight:700}}>{g.title}</div><div style={{color:T.t2,fontSize:12,marginTop:2}}>{g.sub}</div></div>
                <div style={{color:`${g.color}60`,fontSize:16}}>→</div>
              </div>
            )}
          </div>
        )}

        {/* ════════ PRACTICE TAB ════════ */}
        {tab === "practice" && (
          <div style={{paddingTop:16}} className="anim-fadeUp">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:16,background:`linear-gradient(135deg, ${T.accent}15, transparent)`,borderRadius:20,border:`1px solid ${T.accent}20`}}>
              <img src={monkeyTrain} alt="" className="tab-monkey" style={{width:72,height:72,objectFit:"contain"}} loading="lazy" />
              <div>
                <div style={{color:T.t1,fontSize:24,fontWeight:900,letterSpacing:-0.5}}>Trénuj svou opici</div>
                <div style={{color:T.t2,fontSize:13,marginTop:2}}>Nástroje pro každý den</div>
              </div>
            </div>
            {[{img:monkeyAngry,title:"Opičí řev",sub:"Motivační řeči — Goggins, Jocko, Les Brown",color:T.accent},{img:monkeyZen,title:"Opičí klid",sub:"Box breathing, Wim Hof, 4-7-8",color:T.teal},{img:monkeyMusic,title:"Opičí playlist",sub:"Metal, klasika, dramatická, příroda",color:T.purple},{img:monkeyGamer,title:"Opičí reset",sub:"5-4-3-2-1 grounding technika",color:T.blue}].map((g,i)=>
              <div key={i} className={`card-hover anim-slideIn anim-d${i+1}`} style={{display:"flex",alignItems:"center",gap:14,padding:16,background:`linear-gradient(135deg, ${g.color}08, transparent)`,border:`1px solid ${g.color}15`,borderRadius:16,marginBottom:10,cursor:"pointer"}}>
                <img src={g.img} alt={g.title} style={{width:44,height:44,objectFit:"contain",borderRadius:12}} loading="lazy" />
                <div style={{flex:1}}><div style={{color:T.t1,fontSize:15,fontWeight:700}}>{g.title}</div><div style={{color:T.t2,fontSize:12,marginTop:2}}>{g.sub}</div></div>
                <div style={{color:`${g.color}60`,fontSize:16}}>→</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",padding:"6px 0 10px",borderTop:`1px solid ${T.border}`,background:`linear-gradient(to top, ${T.bg}, rgba(10,12,19,0.95))`,flexShrink:0}}>
        <button onClick={()=>{setTab("feel");resetFlow()}} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="feel"?T.accent:T.t3,fontSize:10,fontWeight:700}}>
          <img src={monkeyHero} alt="" style={{width:28,height:28,objectFit:"contain",opacity:tab==="feel"?1:0.5,transition:"opacity .2s"}} />CÍTÍM
        </button>
        <button onClick={()=>setShowSOS(true)} className="nav-btn" style={{width:62,height:62,borderRadius:"50%",background:`radial-gradient(circle,${T.red},#CC2040)`,border:"3px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${T.red}50`,transform:"translateY(-10px)",animation:"pulse 3s infinite"}}>
          <img src={monkeySos} alt="SOS" style={{width:36,height:36,objectFit:"contain"}} />
        </button>
        <button onClick={()=>setTab("learn")} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="learn"?T.accent:T.t3,fontSize:10,fontWeight:700}}>
          <img src={monkeyLearn} alt="" style={{width:28,height:28,objectFit:"contain",opacity:tab==="learn"?1:0.5,transition:"opacity .2s"}} />POCHOP TO
        </button>
        <button onClick={()=>setTab("practice")} className="nav-btn" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",color:tab==="practice"?T.accent:T.t3,fontSize:10,fontWeight:700}}>
          <img src={monkeyTrain} alt="" style={{width:28,height:28,objectFit:"contain",opacity:tab==="practice"?1:0.5,transition:"opacity .2s"}} />TRÉNUJ
        </button>
      </div>
    </div>
  );
}
