export type ContentAccess = "free" | "premium";
export type ContentFormat = "speech" | "video_short" | "external_embed" | "education" | "chat_prompt";
export type ContentIntensity = 1 | 2 | 3;
export type MoodFamily = "positive" | "anger" | "sadness" | "anxiety" | "all";
export type ContentReason =
  | "school"
  | "siblings"
  | "parents"
  | "friends"
  | "social"
  | "identity"
  | "lonely"
  | "other";

export interface ContentItem {
  id: string;
  title: string;
  access: ContentAccess;
  format: ContentFormat;
  mood: MoodFamily[];
  reasons: ContentReason[];
  intensity: ContentIntensity[];
  durationSeconds: number;
  tags: string[];
  hook: string;
  sourceKind: "original" | "curated_embed" | "licensed_creator";
  embedUrl?: string;
  text?: string;
  emotion?: string;
  educationPoints?: string[];
  chatPrompt?: string;
  shortLines?: string[];
  notes?: string;
}

// Copyright-safe blueprint:
// - "original" means Monkey Mind owns the script/audio/video
// - "curated_embed" means official third-party embeds only
// - "licensed_creator" is reserved for future permission-based creator packs
export const CONTENT_BLUEPRINT: ContentItem[] = [
  {
    id: "free-rage-reset-30",
    title: "Rage reset za 30 sekund",
    access: "free",
    format: "speech",
    mood: ["anger"],
    reasons: ["parents", "friends", "school", "other"],
    intensity: [2, 3],
    durationSeconds: 30,
    tags: ["reset", "rage", "fast"],
    hook: "Jsi na hraně? Tohle je rychlý reset dřív, než to bouchne.",
    sourceKind: "original",
    emotion: "anger",
    text: "Zastav. Neodpovídej hned. Ten tlak v tobě je energie, ne rozkaz. Tři nádechy. Tři výdechy. To, co uděláš za dalších deset sekund, rozhodne, jestli tenhle moment ovládneš, nebo on ovládne tebe. Ty nejsi výbuch. Ty jsi ten, kdo ho drží v ruce.",
    notes: "Rychlý zásah pro chvíle, kdy cítíš, že to každou sekundu bouchne.",
  },
  {
    id: "free-sunday-dread-60",
    title: "Nedělní dread přežiješ",
    access: "free",
    format: "speech",
    mood: ["anxiety"],
    reasons: ["school", "social", "other"],
    intensity: [1, 2],
    durationSeconds: 60,
    tags: ["sunday", "school", "night"],
    hook: "Neděle večer je nejhorší? Tohle je speech přesně pro ten moment.",
    sourceKind: "original",
    emotion: "anxiety",
    text: "Nedělní večer ti lže. Zítra není soudný den. Je to jen pondělí. Nemusíš zvládnout celý týden najednou. Jen ráno vstát. Jen dát první hodinu. Jen projít první blok. Zmenši horizont. Přežij první krok. Pak druhý. Takhle se poráží dread.",
    notes: "Krátká pomoc přesně pro neděli večer, pondělní tlak a noční stres.",
  },
  {
    id: "free-lonely-proof-45",
    title: "Nejsi v tom sám",
    access: "free",
    format: "speech",
    mood: ["sadness", "anxiety"],
    reasons: ["lonely", "identity", "friends"],
    intensity: [1, 2],
    durationSeconds: 45,
    tags: ["lonely", "validation", "free-core"],
    hook: "Když máš pocit, že tě nikdo nechápe, začni tady.",
    sourceKind: "original",
    emotion: "lonely",
    text: "To, že se teď cítíš sám, neznamená, že jsi sám. Znamená to jen, že jsi v momentu, kdy tvůj mozek nevidí celý obraz. Tvůj kmen může být ještě před tebou. Tvoje budoucí lidi existují. Dýchej. Vydrž dnešek. To někdy stačí jako největší vítězství.",
    notes: "Když máš pocit, že na všechno zůstáváš sám, začni právě tady.",
  },
  {
    id: "free-youtube-hero",
    title: "Watch next: Denzel - Fall Forward",
    access: "free",
    format: "external_embed",
    mood: ["sadness", "anxiety", "all"],
    reasons: ["identity", "lonely", "other"],
    intensity: [2, 3],
    durationSeconds: 608,
    tags: ["youtube", "denzel", "external"],
    hook: "Silný free hero pick: tvrdý Denzel message o pádu dopředu, riziku a růstu skrz těžké chvíle.",
    sourceKind: "curated_embed",
    embedUrl: "https://www.youtube.com/watch?v=tbnzAVRZ9Xc",
    chatPrompt: "Dokoukal jsem Denzel video o tom, že máme padat dopředu, a chci ten pocit převést do konkrétního dalšího kroku v mém životě.",
    notes: "Pusť si to celé a pak si ten pocit převeď do vlastního dalšího kroku.",
  },
  {
    id: "premium-youtube-rise-pack",
    title: "Premium video: rise through the pain",
    access: "premium",
    format: "external_embed",
    mood: ["anger", "sadness", "all"],
    reasons: ["parents", "friends", "identity", "other"],
    intensity: [2, 3],
    durationSeconds: 520,
    tags: ["youtube", "premium", "resilience"],
    hook: "Silnější premium video pro chvíle, kdy chceš tvrdší message a delší nálož energie.",
    sourceKind: "curated_embed",
    embedUrl: "https://www.youtube.com/watch?v=UB7nGT3egak",
    chatPrompt: "Dokoukal jsem to premium video a chci ten pocit udržet. Pomoz mi přetavit ho do jedné konkrétní akce ještě dnes.",
    notes: "Delší video pro momenty, kdy potřebuješ tvrdší message a víc energie.",
  },
  {
    id: "premium-youtube-belief-pack",
    title: "Premium video: belief under pressure",
    access: "premium",
    format: "external_embed",
    mood: ["anxiety", "sadness", "all"],
    reasons: ["school", "identity", "lonely", "other"],
    intensity: [1, 2, 3],
    durationSeconds: 510,
    tags: ["youtube", "premium", "belief"],
    hook: "Druhé premium video pro momenty, kdy potřebuješ víru v sebe, ne jen další tip.",
    sourceKind: "curated_embed",
    embedUrl: "https://www.youtube.com/watch?v=I_mPoUWBMf4",
    chatPrompt: "To video mi něco připomnělo a nechci ten pocit zase ztratit. Pomoz mi to přeložit do reality v mém životě.",
    notes: "Video pro chvíle, kdy potřebuješ znovu uvěřit sobě a nezabalit to.",
  },
  {
    id: "premium-rage-pack-01",
    title: "Rage pack: rodiče, škola, zrada",
    access: "premium",
    format: "speech",
    mood: ["anger"],
    reasons: ["parents", "school", "friends"],
    intensity: [1, 2, 3],
    durationSeconds: 90,
    tags: ["premium", "rage", "pack"],
    hook: "Tři úrovně tlaku, tři různé zásahy podle toho, jak moc to v tobě vaří.",
    sourceKind: "original",
    emotion: "anger",
    text: "Jestli to v tobě vaří, použij to chytře. Nízký tlak? Ochlaď hlavu a mluv čistě. Střední tlak? Jdi ven, rozhýbej tělo, nenech to shnít. Maximální tlak? Žádné zprávy, žádné rozhodnutí, nejdřív reset nervového systému. Vztek není plán. Vztek je palivo.",
    notes: "Silnější speech pack podle toho, jak moc to v tobě právě vaří.",
  },
  {
    id: "premium-monkey-short-rage",
    title: "Monkey short: hit-back speech",
    access: "premium",
    format: "video_short",
    mood: ["anger"],
    reasons: ["parents", "friends", "school", "other"],
    intensity: [3],
    durationSeconds: 20,
    tags: ["video", "shorts", "shareable"],
    hook: "Krátký video zásah, ne další podcast do pozadí.",
    sourceKind: "original",
    emotion: "anger",
    text: "Nepiš to hned. Neposílej to hned. Tenhle moment není na útok, ale na převzetí kontroly. Dýchej. Ustup o krok. To nejsilnější, co teď můžeš udělat, je nerozbít další věc jen proto, že to v tobě hoří.",
    shortLines: [
      "Nepiš to hned.",
      "Neposílej to hned.",
      "Tenhle moment není na útok.",
      "Tenhle moment je na kontrolu.",
      "Dýchej. Ustup. Ovládni to.",
    ],
    notes: "Krátký zásah do momentu, kdy máš chuť vrátit úder a všechno zhoršit.",
  },
  {
    id: "premium-night-spiral-short",
    title: "Monkey short: noční spirála stop",
    access: "premium",
    format: "video_short",
    mood: ["anxiety", "sadness"],
    reasons: ["social", "identity", "lonely", "other"],
    intensity: [2, 3],
    durationSeconds: 15,
    tags: ["night", "video", "spiral"],
    hook: "Pro 10pm-midnight doomscroll momenty.",
    sourceKind: "original",
    emotion: "anxiety",
    text: "Zastav scrolling. Ten pocit, že musíš pokračovat, není pravda, je to smyčka. Polož telefon na chvíli vedle sebe. Podívej se kolem. Není tu žádná katastrofa, jen přetížená hlava. Vrať se do těla. Vrať se do pokoje. Vrať se k sobě.",
    shortLines: [
      "Zastav scrolling.",
      "Tohle není pravda. To je smyčka.",
      "Polož telefon vedle sebe.",
      "Vrať se do pokoje.",
      "Vrať se k sobě.",
    ],
    notes: "Krátký stop moment pro noční scroll, tlak v hlavě a přetížený večer.",
  },
  {
    id: "premium-pochopto-social",
    title: "Pochop to: proč ti sítě rozbíjí hlavu",
    access: "premium",
    format: "education",
    mood: ["anxiety", "sadness", "all"],
    reasons: ["social"],
    intensity: [1, 2],
    durationSeconds: 150,
    tags: ["education", "social", "curriculum"],
    hook: "Pochop, proč se po scrollu cítíš rozbitě, i když jsi jen ležel v posteli.",
    sourceKind: "original",
    educationPoints: [
      "Algoritmus neodměňuje klid. Odměňuje reakci, srovnávání a návrat do appky.",
      "Po scrollu často necítíš únavu jen psychicky. Je to i dopaminový crash a přetížená pozornost.",
      "Nejsilnější obrana není disciplína navždy. Je to menší friction: vypnuté notifikace, limity, záchytný rituál po scrollu.",
    ],
    notes: "Pomůže pochopit, co s tebou dělají sítě, a jak z toho ven bez hero výkonu.",
  },
  {
    id: "premium-chat-school-fail",
    title: "Chat starter: fail ve škole",
    access: "premium",
    format: "chat_prompt",
    mood: ["anxiety", "sadness", "anger"],
    reasons: ["school"],
    intensity: [1, 2, 3],
    durationSeconds: 10,
    tags: ["chat", "starter", "premium"],
    hook: "Pomůže AI chatu začít konkrétně a bez trapného prázdna.",
    sourceKind: "original",
    chatPrompt: "Propadl jsem nebo jsem pokazil něco ve škole a mám pocit, že jsem úplně k ničemu. Potřebuju se z toho vyhrabat a slyšet jeden konkrétní další krok.",
    notes: "Otevře Opičáka rovnou s konkrétním tématem, bez prázdné obrazovky.",
  },
  {
    id: "licensed-creator-pack-001",
    title: "Licensed Czech creator pack",
    access: "premium",
    format: "speech",
    mood: ["anger", "anxiety", "sadness"],
    reasons: ["school", "identity", "friends", "other"],
    intensity: [2, 3],
    durationSeconds: 75,
    tags: ["licensed", "creator", "premium"],
    hook: "Budoucí premium série s reálným českým hlasem a jasně vyřešenou licencí.",
    sourceKind: "licensed_creator",
    notes: "Tahle část se zapne až ve chvíli, kdy budou hotová všechna práva a souhlasy.",
  },
];

export const FREE_TASTE_LAYER_IDS = [
  "free-rage-reset-30",
  "free-sunday-dread-60",
  "free-lonely-proof-45",
  "free-youtube-hero",
] as const;

export const PREMIUM_HERO_IDS = [
  "premium-youtube-rise-pack",
  "premium-youtube-belief-pack",
  "premium-rage-pack-01",
  "premium-monkey-short-rage",
  "premium-night-spiral-short",
  "premium-pochopto-social",
  "premium-chat-school-fail",
] as const;
