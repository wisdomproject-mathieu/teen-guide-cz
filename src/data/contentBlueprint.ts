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
    notes: "One of the top 3 free speeches. Must hit hard immediately.",
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
    notes: "High-value free sample tied to a known trigger moment.",
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
    notes: "Third free speech from the taste layer.",
  },
  {
    id: "free-youtube-school-push",
    title: "Watch next: school motivation",
    access: "free",
    format: "external_embed",
    mood: ["anger", "anxiety", "all"],
    reasons: ["school"],
    intensity: [2, 3],
    durationSeconds: 653,
    tags: ["youtube", "school", "external"],
    hook: "Když chceš delší nakopnutí, tady je oficiální video v YouTube přehrávači.",
    sourceKind: "curated_embed",
    embedUrl: "https://www.youtube.com/watch?v=dcrw7209Szs",
    notes: "Official embed only. Do not extract audio or transcript.",
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
    notes: "Premium because it includes intensity variants and a full pack.",
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
    notes: "Should use original script plus Monkey avatar motion.",
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
    notes: "Target Sunday dread and late-night scrolling windows.",
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
    hook: "Teens want to understand why they feel wrecked after scrolling.",
    sourceKind: "original",
    educationPoints: [
      "Algoritmus neodměňuje klid. Odměňuje reakci, srovnávání a návrat do appky.",
      "Po scrollu často necítíš únavu jen psychicky. Je to i dopaminový crash a přetížená pozornost.",
      "Nejsilnější obrana není disciplína navždy. Je to menší friction: vypnuté notifikace, limity, záchytný rituál po scrollu.",
    ],
    notes: "Keep one education module free, gate the full curriculum.",
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
    notes: "Use as paid chat quick-starter prompts.",
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
    hook: "Future lane for a real Czech creator voice with explicit permission.",
    sourceKind: "licensed_creator",
    notes: "Only populate after written permission and usage rights are secured.",
  },
];

export const FREE_TASTE_LAYER_IDS = [
  "free-rage-reset-30",
  "free-sunday-dread-60",
  "free-lonely-proof-45",
  "free-youtube-school-push",
] as const;

export const PREMIUM_HERO_IDS = [
  "premium-rage-pack-01",
  "premium-monkey-short-rage",
  "premium-night-spiral-short",
  "premium-pochopto-social",
  "premium-chat-school-fail",
] as const;
