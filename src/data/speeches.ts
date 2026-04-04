// ── SPEECH DATA ──
// 3 tailored speeches per mood-emotion × reason combination
// Emotions: positive (great/pumped), anger (angry), sadness (sad/awful), anxiety (meh/anxious)
// Reasons: school, siblings, parents, friends, social, identity, lonely, other

const T = {
  teal: "#00D4AA", red: "#FF3B5C", blue: "#4A8FFF",
  purple: "#A855F7", orange: "#FF7A2F", green: "#00D4AA",
  lonely: "#6C7EB7", overwhelm: "#00D4AA",
};

export interface Speech {
  id: string;
  emo: string;
  reason: string[];
  icon: string;
  title: string;
  src: string;
  color: string;
  text: string;
}

// ════════════════════════════════════════
//  POSITIVE SPEECHES (great / pumped)
// ════════════════════════════════════════

const POSITIVE_SPEECHES: Speech[] = [
  // ── school ──
  {id:"p-school-1",emo:"positive",reason:["school"],icon:"📚",title:"Škola tě neporazí.",src:"Growth Mindset",color:T.teal,text:"Dobrý den ve škole? To je důkaz, že to zvládáš. Každý dobrý den je cihla. A ty stavíš. Nemusíš být nejlepší — stačí být lepší než včera. A dneska to jde. Tak jdi dál."},
  {id:"p-school-2",emo:"positive",reason:["school"],icon:"🎯",title:"Flow state aktivován.",src:"Mihaly Csikszentmihalyi",color:T.teal,text:"Znáš ten pocit, kdy ti všechno jde? Csikszentmihalyi tomu říká 'flow'. Tvůj mozek je v zóně. Využij to — udělej tu jednu věc navíc, co jsi odkládal. Dneska máš superpower."},
  {id:"p-school-3",emo:"positive",reason:["school"],icon:"⚡",title:"Důkaz, že to umíš.",src:"Motivace",color:T.teal,text:"Dneska je den, kdy si můžeš říct: zvládám to. A příště, když bude těžko — vrať se sem. Protože tohle je důkaz. Tvůj vlastní důkaz, že škola tě nezlomí."},

  // ── siblings ──
  {id:"p-siblings-1",emo:"positive",reason:["siblings"],icon:"🤜",title:"Sourozenci = tvůj tým.",src:"Psychologie",color:T.teal,text:"Dobrá vibe s bráchou nebo ségrou? To je zlato. Jednou budou tvoji nejbližší lidi na planetě. Tohle je moment, kdy se buduje celoživotní bond. Užij si to. A řekni jim, že jsou hustý."},
  {id:"p-siblings-2",emo:"positive",reason:["siblings"],icon:"🏠",title:"Domov je silnější.",src:"Rodinná psychologie",color:T.teal,text:"Když funguje vibe se sourozencem, celý dům se změní. Energie stoupá. Rodiče se usmívají. Ty máš klid. Tohle je ripple efekt — a ty jsi ho začal. Dobrá práce, opice."},
  {id:"p-siblings-3",emo:"positive",reason:["siblings"],icon:"💪",title:"Spolu jste neporazitelní.",src:"Motivace",color:T.teal,text:"Brácha nebo ségra — to je člověk, co zná tvoje nejhorší i nejlepší já. A pořád tu je. To je vzácnější, než si myslíš. Dneska to funguje. Zapamatuj si ten pocit."},

  // ── parents ──
  {id:"p-parents-1",emo:"positive",reason:["parents"],icon:"💛",title:"Rodiče jsou základ.",src:"Motivace",color:T.teal,text:"Máš super den díky rodině? To je vzácný. Hodně lidí to nemá. Pamatuj si tenhle moment — až bude jednou těžko, vrať se sem. Tahle energie je tvoje palivo."},
  {id:"p-parents-2",emo:"positive",reason:["parents"],icon:"🏡",title:"Bezpečný přístav.",src:"Attachment Theory",color:T.teal,text:"Když se cítíš dobře s rodiči, máš něco, co spousta lidí hledá celý život — bezpečný přístav. Místo, kam se můžeš vrátit. To tě dělá silnějším pro celý svět venku."},
  {id:"p-parents-3",emo:"positive",reason:["parents"],icon:"🌟",title:"Řekni jim to.",src:"Psychologie",color:T.teal,text:"Víš co je nejtěžší? Říct rodičům, že je máš rád. Ale dneska máš tu energii. Zkus to. Stačí krátká zpráva, objetí, cokoliv. Udělá to jejich den. A tvůj taky."},

  // ── friends ──
  {id:"p-friends-1",emo:"positive",reason:["friends"],icon:"🤝",title:"Parťáci na celej život.",src:"Motivace",color:T.teal,text:"Dobří kámoši jsou jako vzácný loot. Když máš dobrej den díky nim — řekni jim to. Lidi potřebujou slyšet, že jsou důležitý. A ty máš tu sílu to udělat právě teď."},
  {id:"p-friends-2",emo:"positive",reason:["friends"],icon:"🎉",title:"Tvůj kmen tě nabíjí.",src:"Social Psychology",color:T.teal,text:"Dobrý kamarádi jsou jak dobíječka na tvůj mentální battery. Dneska jsi na 100%. Využij tu energii — naplánuj něco, co budete vzpomínat za 10 let. Tohle jsou ty momenty."},
  {id:"p-friends-3",emo:"positive",reason:["friends"],icon:"🔥",title:"Friendship = wealth.",src:"Aristoteles",color:T.teal,text:"Aristoteles říkal, že přátelství je jediné skutečné bohatství. A ty ho dneska máš. Lidi kolem tebe, kteří tě berou takového, jaký jsi. To je víc než jakákoliv známka nebo follower count."},

  // ── social ──
  {id:"p-social-1",emo:"positive",reason:["social"],icon:"📱",title:"Zdravý social = power.",src:"Motivace",color:T.teal,text:"Pozitivní vibe ze sítí? To je vzácný. Většinou nás to stahuje dolů. Ale když najdeš komunitu nebo obsah, co tě nabíjí — drž se toho. To je tvůj digitální kmen."},
  {id:"p-social-2",emo:"positive",reason:["social"],icon:"🌐",title:"Creator, ne consumer.",src:"Cal Newport",color:T.teal,text:"Dneska jsi použil sítě správně. Newport říká: buď creator, ne consumer. Když tě online svět nabíjí, znamená to, že ho používáš jako nástroj, ne jako drogu. Keep going."},
  {id:"p-social-3",emo:"positive",reason:["social"],icon:"💡",title:"Inspirace z dobrých zdrojů.",src:"Digital Wellness",color:T.teal,text:"Našel jsi obsah, co tě pozvedl? Uložil sis to. Zapamatuj si, kde tě ten dobrý feeling přišel — a vrať se tam, až bude těžko. Tvůj feed = tvůj mindset."},

  // ── identity ──
  {id:"p-identity-1",emo:"positive",reason:["identity"],icon:"🪞",title:"Znáš sám sebe.",src:"Stoicismus",color:T.teal,text:"Cítíš se dobře sám se sebou? To je nejcennější skill, co existuje. Marcus Aurelius říkal: kdo zná sebe, zná vesmír. Dneska jsi na to přišel. Zapamatuj si to."},
  {id:"p-identity-2",emo:"positive",reason:["identity"],icon:"🦋",title:"Stáváš se sebou.",src:"Carl Rogers",color:T.teal,text:"Rogers říkal: 'Zvláštní paradox — když přijmu sebe takového, jaký jsem, mohu se změnit.' Dneska se přijímáš. A to je ten nejsilnější základ pro růst."},
  {id:"p-identity-3",emo:"positive",reason:["identity"],icon:"💎",title:"Autentický = neporazitelný.",src:"Brené Brown",color:T.teal,text:"Brown říká: autenticita je denní praxe. Dneska jsi autentický. Cítíš se ve své kůži. Tohle je tvůj benchmark — příště, když budeš pochybovat, vrať se k tomuhle momentu."},

  // ── lonely ──
  {id:"p-lonely-1",emo:"positive",reason:["lonely"],icon:"🌟",title:"Samota jako superpower.",src:"Rilke",color:T.teal,text:"Jsi sám/a a cítíš se dobře? To je next level. Většina lidí se bojí ticha. Ty v něm nacházíš sílu. Rilke říkal: samota je laboratoř velikosti. A ty právě experimentuješ."},
  {id:"p-lonely-2",emo:"positive",reason:["lonely"],icon:"🧘",title:"Klid v tichu.",src:"Meditace",color:T.teal,text:"Být sám a cítit klid — to umí málokdo. Tvůj mozek právě regeneruje. Žádný input, žádný noise. Jenom ty a tvoje myšlenky. A dneska jsou ty myšlenky dobré."},
  {id:"p-lonely-3",emo:"positive",reason:["lonely"],icon:"🎨",title:"Kreativita v tichu.",src:"Psychologie",color:T.teal,text:"Největší nápady přicházejí v tichu. Newton, Tesla, Rowling — všichni tvořili v samotě. Ty teď máš svůj prostor. Co s ním uděláš? Cokoliv — a bude to tvoje."},

  // ── other ──
  {id:"p-other-1",emo:"positive",reason:["other"],icon:"✨",title:"Good vibes only.",src:"Monkey Mind",color:T.teal,text:"Dobrý den je dobrý den. Nemusíš to analyzovat. Prostě si ho užij. Opice tančí. 🐵 A pamatuj — tenhle pocit si zasloužíš. Vždycky."},
  {id:"p-other-2",emo:"positive",reason:["other"],icon:"🎵",title:"Dneska hraje tvůj song.",src:"Motivace",color:T.teal,text:"Někdy prostě klapne všechno. Nemusíš vědět proč. Prostě to přijmi. Pusť si svůj oblíbený song, udělej si něco dobrého a užij si ten moment. Zasloužíš si ho."},
  {id:"p-other-3",emo:"positive",reason:["other"],icon:"🐵",title:"Opice je šťastná.",src:"Monkey Mind",color:T.teal,text:"Tvoje vnitřní opice dneska neskáče a nekřičí. Sedí v klidu, usmívá se a jí banán. Užij si ten klid. Zítra může být jinak — ale dneska? Dneska je pecka."},
];

// ════════════════════════════════════════
//  ANGER SPEECHES (angry)
// ════════════════════════════════════════

const ANGER_SPEECHES: Speech[] = [
  // ── school ──
  {id:"a-school-1",emo:"anger",reason:["school"],icon:"⚡",title:"Zkoušky nejsou o tobě.",src:"Motivace",color:T.red,text:"Víš co je ve skutečnosti ta zkouška? Test papíru. Ne test tebe. Ty jsi víc než známka. Víc než číslo. Tvůj vztek na systém je oprávněný — ale použij ho. Uč se jako rebel. Ukaž jim, že to zvládneš navzdory."},
  {id:"a-school-2",emo:"anger",reason:["school"],icon:"🏛",title:"Kontroluješ jen jednu věc.",src:"Marcus Aurelius",color:T.red,text:"Marcus Aurelius vládl celé říši. A každé ráno si připomínal: kontroluji jen svou reakci. Ne co řekl učitel. Ne tu známku. Jen jak odpovíš. Budeš řízen vztekem, nebo budeš vztek řídit ty?"},
  {id:"a-school-3",emo:"anger",reason:["school"],icon:"🔥",title:"Vztek na systém? Použij ho.",src:"David Goggins",color:T.red,text:"Goggins nesnášel školu. A místo aby to vzdal, udělal z toho palivo. Každá blbá úloha, každý test — další důkaz, že to zvládne. Tvůj vztek je energie. Nasměruj ho správně."},

  // ── siblings ──
  {id:"a-siblings-1",emo:"anger",reason:["siblings"],icon:"🔥",title:"Je to těžké? Dobře.",src:"Jocko Willink",color:T.red,text:"Je to těžké? Dobře. Jocko říká: když je těžce — dobře. Sourozenec tě vytáčí? Dobře. To tě učí zvládat lidi, se kterými nemůžeš utéct. Každý moment, kdy to bolí, tě posiluje."},
  {id:"a-siblings-2",emo:"anger",reason:["siblings"],icon:"🔥",title:"Přeměň vztek v palivo.",src:"David Goggins",color:T.red,text:"Slyšíš ten vztek? Goggins říká — to není tvůj nepřítel. Brácha nebo ségra tě sere? Místo aby ses hádal — dýchej. Za 6 minut ten chemický koktejl opadne. A pak mluv. S hlavou, ne s pěstí."},
  {id:"a-siblings-3",emo:"anger",reason:["siblings"],icon:"🧠",title:"6 minut. Pak se rozhodni.",src:"Neurověda",color:T.red,text:"Tvůj mozek je teď unešen amygdalou. Sourozenec stiskl tlačítko — a ty jsi na autopilotu. Za 6 minut chemie opadne. Nezačínej hádku teď. Počkej. Pak řekni, co opravdu cítíš."},

  // ── parents ──
  {id:"a-parents-1",emo:"anger",reason:["parents"],icon:"🏛",title:"Jejich pravidla ≠ tvůj život.",src:"Stoicismus",color:T.red,text:"Marcus Aurelius říkal: nemůžeš ovládat ostatní, jen svoji reakci. Rodiče mají své důvody — i když jsou otravné. Tvůj vztek je oprávněný. Ale co s ním uděláš, to je na tobě."},
  {id:"a-parents-2",emo:"anger",reason:["parents"],icon:"🧠",title:"Slyšíš jen šum.",src:"Neurověda",color:T.red,text:"Když se hádáš s rodiči, tvůj mozek přepne do fight-or-flight. Neslyšíš, co říkají — slyšíš jen šum. Odejdi na 10 minut. Dýchej. A pak se vrať. Budeš jiný člověk."},
  {id:"a-parents-3",emo:"anger",reason:["parents"],icon:"💪",title:"Vztek = hranice.",src:"Jordan Peterson",color:T.red,text:"Peterson říká: vztek ukazuje, kde jsou tvé hranice. Kde rodiče překročili čáru. Nepotlačuj to — ale taky nevybuchuj. Zapiš si, co tě sere. A pak to řekni klidně. To je síla."},

  // ── friends ──
  {id:"a-friends-1",emo:"anger",reason:["friends"],icon:"🔥",title:"Zrada bolí jinak.",src:"Psychologie",color:T.red,text:"Když tě naštve kamarád, bolí to dvojnásobně. Protože jsi jim věřil. Tvůj vztek říká: 'Tohle si nezasloužím.' A má pravdu. Ale dej si čas. Impulzivní reakce ničí víc než pomáhá."},
  {id:"a-friends-2",emo:"anger",reason:["friends"],icon:"⚔",title:"Ne každý si zaslouží místo.",src:"Motivace",color:T.red,text:"Některý lidi nemají místo v tvém životě. A to je OK. Vztek ti říká, kdo překročil hranici. Poslechni ho — ale jednaj s chladnou hlavou. Nejlepší pomsta? Žít dobře bez nich."},
  {id:"a-friends-3",emo:"anger",reason:["friends"],icon:"🧊",title:"Cool down, pak jednej.",src:"Neurověda",color:T.red,text:"Za 90 sekund opadne první vlna chemie v mozku. Nepřijímej rozhodnutí o přátelství v první vlně. Dýchej. Počkej. A pak se rozhodni s jasnou hlavou — ne s hořícím žaludkem."},

  // ── social ──
  {id:"a-social-1",emo:"anger",reason:["social"],icon:"💥",title:"Algoritmus tě provokuje.",src:"Cal Newport",color:T.red,text:"Víš proč jsi naštvanej? Protože aplikace jsou navržený, aby tě provokovaly. Vztek = engagement = peníze pro ně. Pokaždý, když se naštveš online, někdo na tom vydělá. Chceš být produkt, nebo hráč?"},
  {id:"a-social-2",emo:"anger",reason:["social"],icon:"📱",title:"Polož telefon. Teď.",src:"Digital Detox",color:T.red,text:"Scrolluješ a sereš se? To není náhoda. Každý post je navržený, aby v tobě vyvolal reakci. A ty právě reaguješ přesně jak chtěli. Polož telefon na 15 minut. Jdi ven. Vztek opadne."},
  {id:"a-social-3",emo:"anger",reason:["social"],icon:"🎭",title:"Online drama ≠ realita.",src:"Jonathan Haidt",color:T.red,text:"Haidt dokázal, že online konflikty aktivují mozek stejně jako fyzické ohrožení. Ale nejsi v ohrožení. Je to screen. Pixely. Zavři appku. Tvůj skutečný život je kolem tebe, ne v telefonu."},

  // ── identity ──
  {id:"a-identity-1",emo:"anger",reason:["identity"],icon:"🔥",title:"Vztek je kompas.",src:"Jordan Peterson",color:T.red,text:"Peterson říká: vztek ti ukazuje, kde jsou tvé hranice. Kde jsi řekl 'ano' a měl říct 'ne'. Nepotlačuj ho. Poslouchej ho. A pak jednaj — ale s přesností chirurga, ne s brutalitou kladiva."},
  {id:"a-identity-2",emo:"anger",reason:["identity"],icon:"🪞",title:"Seš naštvanej na sebe?",src:"Self-Compassion",color:T.red,text:"Být naštvaný sám na sebe je nejtěžší forma vztek. Protože nemůžeš utéct. Kristin Neff říká: zacházej se sebou jako s kamarádem. Co bys řekl jemu? Řekni to sobě. Teď."},
  {id:"a-identity-3",emo:"anger",reason:["identity"],icon:"⚡",title:"Transformace začíná vztekem.",src:"Motivace",color:T.red,text:"Každá velká změna začíná momentem, kdy řekneš: dost. Tenhle vztek na sebe? To je startovní výstřel. Ne konec. Začátek. Co uděláš jinak od zítřka?"},

  // ── lonely ──
  {id:"a-lonely-1",emo:"anger",reason:["lonely"],icon:"🔥",title:"Vztek na svět je normální.",src:"Existencialismus",color:T.red,text:"Jsi sám a naštvaný na celý svět? Sartre říkal: 'Hell is other people.' Ale taky: ty máš svobodu si vybrat. Vztek na osamělost je signál, že chceš víc. A to je dobře. Teď s tím něco udělej."},
  {id:"a-lonely-2",emo:"anger",reason:["lonely"],icon:"💢",title:"Nikdo nerozumí? Fajn.",src:"Motivace",color:T.red,text:"Nikdo ti nerozumí? Možná proto, že jsi jiný. A jiný ≠ špatný. Jiný = vzácný. Tvůj vztek je z frustrace, že svět nefunguje jako ty. Ale svět se nezmění — ty najdeš svůj kmen. Drž to."},
  {id:"a-lonely-3",emo:"anger",reason:["lonely"],icon:"🧠",title:"Osamělost ≠ slabost.",src:"Neurověda",color:T.red,text:"Tvůj mozek zpracovává osamělost jako fyzickou bolest. Doslova. Takže ten vztek je reálný, chemický, biologický. Není to slabost — je to evoluce. A evoluce se přežívá. Jako ty teď."},

  // ── other ──
  {id:"a-other-1",emo:"anger",reason:["other"],icon:"🔥",title:"Přeměň vztek v palivo.",src:"David Goggins",color:T.red,text:"Goggins říká: každý den, kdy jsi naštvanej, je den, kdy máš extra energii. Otázka je — kam ji nasměruješ? Do ničení? Nebo do budování? Rozhodnutí je tvoje. Teď. Tady."},
  {id:"a-other-2",emo:"anger",reason:["other"],icon:"🧠",title:"90 sekund pravidlo.",src:"Neurověda",color:T.red,text:"Jill Bolte Taylor — neuroložka — říká: jakákoliv emoce trvá 90 sekund. Pak je to jen tvůj příběh, co ji drží naživu. Počkej 90 sekund. Dýchej. A pak se rozhodni, jestli ten vztek ještě potřebuješ."},
  {id:"a-other-3",emo:"anger",reason:["other"],icon:"⚔",title:"Válečník, ne oběť.",src:"Stoicismus",color:T.red,text:"Epiktétos říkal: nejsi oběť okolností — jsi válečník, co si vybírá reakci. Cokoli tě sere — máš dvě možnosti. Nechat to, aby tě zničilo. Nebo to použít jako zbraň. Co si vybereš?"},
];

// ════════════════════════════════════════
//  SADNESS SPEECHES (sad / awful)
// ════════════════════════════════════════

const SADNESS_SPEECHES: Speech[] = [
  // ── school ──
  {id:"sd-school-1",emo:"sadness",reason:["school"],icon:"📚",title:"Známky neměří tvou hodnotu.",src:"Carol Dweck",color:T.blue,text:"Dweck dokázala, že inteligence není fixní. Špatný den ve škole neznamená, že jsi hloupý. Znamená to, že se učíš. A učení bolí. Ale ta bolest je růst — i když to tak teď nevypadá."},
  {id:"sd-school-2",emo:"sadness",reason:["school"],icon:"🌅",title:"Tma je nejtemnější před svítáním.",src:"Les Brown",color:T.blue,text:"Les Brown říká: nejtemnější je vždy těsně před svítáním. Škola tě drtí? To není konec. Je to průchod. A na druhé straně je verze tebe, co tohle přežila. A je silnější."},
  {id:"sd-school-3",emo:"sadness",reason:["school"],icon:"👟",title:"Jeden krok. Jen jeden.",src:"Eric Thomas",color:T.blue,text:"Eric Thomas vyrostl jako bezdomovec. Říká: stačilo mi vidět první schod. Nemusíš vědět, jak celá škola dopadne. Jen dnešní úkol. Jeden krok. Pak další. To je celé tajemství."},

  // ── siblings ──
  {id:"sd-siblings-1",emo:"sadness",reason:["siblings"],icon:"💙",title:"Sourozenci = celoživotní tým.",src:"Psychologie",color:T.blue,text:"Hádky s bráchou nebo ségrou bolí jinak. Protože je to rodina — nikam neutečeš. Ale jednou budou tvoji nejbližší lidi na světě. Tahle bolest je investice, i když to teď tak nevypadá."},
  {id:"sd-siblings-2",emo:"sadness",reason:["siblings"],icon:"🌊",title:"Vlny přijdou a odejdou.",src:"Mindfulness",color:T.blue,text:"Smutek ze sourozence je jako vlna — přijde, zvedne tě, a pak odejde. Nemusíš ji zastavit. Nemusíš ji analyzovat. Prostě ji nech projít. Ty jsi břeh. Vlny přicházejí a odcházejí. Ty zůstáváš."},
  {id:"sd-siblings-3",emo:"sadness",reason:["siblings"],icon:"💪",title:"Cítit bolest = cítit lásku.",src:"Brené Brown",color:T.blue,text:"Bolí to, protože ti na ní/něm záleží. Brown říká: nemůžeš cítit hlubokou radost, aniž bys cítil hluboký smutek. To, že tě to bolí, znamená, že jsi schopný milovat. A to je síla, ne slabost."},

  // ── parents ──
  {id:"sd-parents-1",emo:"sadness",reason:["parents"],icon:"🌊",title:"Oni taky bojují.",src:"Motivace",color:T.blue,text:"Tvoji rodiče nejsou dokonalí. Nikdy nebyli. Ale většina z nich dělá to nejlepší, co umí — i když to nevypadá. Smutek z toho je normální. A je to OK. Tvoje pocity jsou validní."},
  {id:"sd-parents-2",emo:"sadness",reason:["parents"],icon:"💔",title:"Nerozumí ≠ nemilují.",src:"Psychologie",color:T.blue,text:"Rodiče často milují způsobem, kterému nerozumíš. Jejich generace se učila jinak. Smutek z nepochopení je reálný — ale za tím nepochopením je většinou strach o tebe. I když to vypadá jako kritika."},
  {id:"sd-parents-3",emo:"sadness",reason:["parents"],icon:"📝",title:"Zapiš, co cítíš.",src:"Journaling",color:T.blue,text:"Když nemůžeš mluvit s rodiči, piš. Zapiš si, co cítíš. Ne proto, abys jim to ukázal — ale abys sám pochopil svůj smutek. Slova na papíře mají moc. Zkus to. Teď."},

  // ── friends ──
  {id:"sd-friends-1",emo:"sadness",reason:["friends"],icon:"🌅",title:"Tma je nejtemnější před svítáním.",src:"Les Brown",color:T.blue,text:"Les Brown vyrostl v chudobě, ztratil vše. Říká: nejtemnější je vždy těsně před svítáním. Ztratil jsi kamaráda? Bolí to. Ale nové spojení přijde — a bude hlubší, protože teď víš, co chceš."},
  {id:"sd-friends-2",emo:"sadness",reason:["friends"],icon:"💪",title:"Cítit je síla.",src:"Brené Brown",color:T.blue,text:"Víš co je na smutku z kamaráda? Dokazuje, že ti záleží. Ty cítíš — protože jsi dost lidský na to, aby tě to zasáhlo. Ta schopnost cítit — to je tvoje největší síla. Ne slabost."},
  {id:"sd-friends-3",emo:"sadness",reason:["friends"],icon:"🔄",title:"Lidi přicházejí a odcházejí.",src:"Životní fáze",color:T.blue,text:"Ne každé přátelství je na celý život. Některý lidi jsou tu na sezónu, ne na věčnost. A to je OK. Smutek je normální — ale taky je to prostor pro někoho nového. Kdo přijde příště?"},

  // ── social ──
  {id:"sd-social-1",emo:"sadness",reason:["social"],icon:"📱",title:"Scrolluješ, ale necítíš se líp.",src:"Jonathan Haidt",color:T.blue,text:"Haidt dokázal, že čím víc scrolluješ, tím hůř se cítíš. Instagram ukazuje highlights jiných a tvoje lowlights. Polož telefon. Jdi ven. Pět minut. Smutná opice potřebuje vzduch, ne pixely."},
  {id:"sd-social-2",emo:"sadness",reason:["social"],icon:"🎭",title:"Srovnávání je zloděj radosti.",src:"Theodore Roosevelt",color:T.blue,text:"Roosevelt řekl: 'Srovnávání je zloděj radosti.' A měl pravdu. Na sítích vidíš edited verze životů. Nikdo nepostuje, jak brečí v posteli. Ale všichni to dělají. Včetně těch 'dokonalých' lidí."},
  {id:"sd-social-3",emo:"sadness",reason:["social"],icon:"🔌",title:"Digital detox = reset.",src:"Digital Wellness",color:T.blue,text:"Dej si 24 hodin bez sítí. Vím, zní to šíleně. Ale tvůj mozek potřebuje reset. Smutek, co cítíš, je zčásti chemický — dopaminové receptory jsou přetížené. Dej jim pauzu. Vrátíš se silnější."},

  // ── identity ──
  {id:"sd-identity-1",emo:"sadness",reason:["identity"],icon:"💎",title:"Tvoje bolest tě přetváří.",src:"Carl Jung",color:T.blue,text:"Jung říkal, že lidé nepřijdou ke svému já skrze světlo — ale skrze temnotu. Ty teď jsi v dolině. Ale dolina je kde rosteš. Diamanty vznikají pod tlakem. A ty jsi pod tlakem právě teď."},
  {id:"sd-identity-2",emo:"sadness",reason:["identity"],icon:"🦋",title:"Motýl taky prochází tmou.",src:"Transformace",color:T.blue,text:"Víš co dělá housenka v kokonu? Kompletně se rozloží. Doslova se stane kaší. A pak se znovu složí — jako motýl. Ty jsi teď v tom kokonu. A je to děsivé. Ale to, co z toho vyjde, bude krásné."},
  {id:"sd-identity-3",emo:"sadness",reason:["identity"],icon:"👟",title:"Nemusíš vědět, kdo jsi.",src:"Erik Erikson",color:T.blue,text:"Erikson říkal, že hledání identity je práce teenagerů. Nemáš to vědět teď. Nikdo to neví v tvém věku. Ten smutek z nejistoty je normální — je to důkaz, že hledáš. A kdo hledá, najde."},

  // ── lonely ──
  {id:"sd-lonely-1",emo:"sadness",reason:["lonely"],icon:"🔬",title:"Velcí lidé jsou budovaní v tichu.",src:"Jordan Peterson",color:T.blue,text:"Nejlepší myšlenky vznikají v tichu. Newton vymyslel gravitaci v karanténě. Da Vinci trávil hodiny sám. Tvoje osamělost je laboratoř. Co v ní vynalezneš?"},
  {id:"sd-lonely-2",emo:"sadness",reason:["lonely"],icon:"🎧",title:"Jsi v tom sám? Ne.",src:"Statistika",color:T.blue,text:"46% teenagerů říká, že se cítí osamělí. Skoro polovina. Takže i ten kluk vedle tebe v lavici. I ta holka co vypadá, že má všechno. Nejsi sám v tom, že jsi sám."},
  {id:"sd-lonely-3",emo:"sadness",reason:["lonely"],icon:"🌍",title:"Tvůj kmen existuje.",src:"Social Psychology",color:T.blue,text:"Tvoji lidi existují — jen jsi je ještě nenašel. Každý 'weird' člověk v historii nakonec našel svůj kmen. Internet, kroužky, nové město — tvoji lidi čekají. Drž to."},

  // ── other ──
  {id:"sd-other-1",emo:"sadness",reason:["other"],icon:"🌅",title:"Tohle přejde.",src:"Buddhismus",color:T.blue,text:"Buddha říkal: vše je pomíjivé. Radost i smutek. Ten smutek, co teď cítíš — přejde. Ne za rok. Ne za měsíc. Možná za hodinu. Možná za den. Ale přejde. A ty budeš silnější."},
  {id:"sd-other-2",emo:"sadness",reason:["other"],icon:"💧",title:"Plakat je OK.",src:"Neurověda",color:T.blue,text:"Víš že slzy obsahují stresové hormony? Doslova vyplakáváš stres z těla. Není to slabost — je to biologický mechanismus. Tělo se léčí. Nech ho. A pak se napij vody."},
  {id:"sd-other-3",emo:"sadness",reason:["other"],icon:"🐵",title:"Opice je tu s tebou.",src:"Monkey Mind",color:T.blue,text:"Hele. Vím, že to teď sere. A nemám žádnou magickou radu. Ale jsem tu. Tvoje opice je tu. A budu tu i zítra. A pozítří. Nejsi v tom sám. Nikdy."},
];

// ════════════════════════════════════════
//  ANXIETY SPEECHES (anxious / meh)
// ════════════════════════════════════════

const ANXIETY_SPEECHES: Speech[] = [
  // ── school ──
  {id:"x-school-1",emo:"anxiety",reason:["school"],icon:"🎭",title:"Strach je lhář.",src:"Neurověda",color:T.orange,text:"95% věcí ze kterých se bojíme se nikdy nestane. Amygdala je přehnaně dramatická — byla naprogramována pro tygry, ne pro zkoušky. Tvůj strach není pravda. Je to jen starý software běžící na novém hardwaru."},
  {id:"x-school-2",emo:"anxiety",reason:["school"],icon:"🎯",title:"Zkrať horizont.",src:"David Goggins",color:T.orange,text:"Goggins říká: když je maraton nejhorší, dívám se jen 10 metrů dopředu. Nemysli na celý semestr. Jen dnešní den. Příštích 30 minut. Co zvládneš teď? Jeden malý krok."},
  {id:"x-school-3",emo:"anxiety",reason:["school"],icon:"📋",title:"Rozděl to na kusy.",src:"Produktivita",color:T.orange,text:"Tvůj mozek panikuje, protože vidí obrovský blok práce. Ale co kdybys to rozsekal na 5minutové úkoly? Jeden. Pak další. Pak další. Náhle jsi v polovině a ani to nevíš."},

  // ── siblings ──
  {id:"x-siblings-1",emo:"anxiety",reason:["siblings"],icon:"🧘",title:"Dech je tvoje kotva.",src:"Wim Hof",color:T.orange,text:"Sourozenec tě stresuje? Dech je tvůj reset button. Nadechni se na 4 sekundy. Zadrž na 4. Vydechni na 6. Opakuj 3×. Tvůj nervový systém se uklidní. A pak můžeš jednat."},
  {id:"x-siblings-2",emo:"anxiety",reason:["siblings"],icon:"🌊",title:"Ty nejsi zodpovědný za ně.",src:"Psychologie",color:T.orange,text:"Úzkost ze sourozence často znamená, že přebíráš zodpovědnost za jejich pocity. Ale ty jsi zodpovědný jen za sebe. Jejich emoce jsou jejich. Tvoje jsou tvoje. Oddělení ≠ lhostejnost."},
  {id:"x-siblings-3",emo:"anxiety",reason:["siblings"],icon:"🎯",title:"Co přesně tě trápí?",src:"CBT",color:T.orange,text:"Úzkost je často mlhavá — všechno se zdá špatně. Zkus to zúžit: co přesně tě na sourozeneckém vztahu trápí? Pojmenuj to. Jedna věc. Když to pojmenuješ, ztratí to polovinu síly."},

  // ── parents ──
  {id:"x-parents-1",emo:"anxiety",reason:["parents"],icon:"🛡",title:"Jejich očekávání ≠ tvůj osud.",src:"Viktor Frankl",color:T.orange,text:"Frankl přežil koncentrák a říká: poslední lidská svoboda je vybrat si svůj postoj. Rodiče mají plány. Ale tvůj příběh píšeš ty. Úzkost z jejich očekávání nemusí být tvůj motor."},
  {id:"x-parents-2",emo:"anxiety",reason:["parents"],icon:"🧠",title:"Fight-flight-freeze.",src:"Neurověda",color:T.orange,text:"Tvůj nervový systém reaguje na rodiče jako na ohrožení? To je normální. Hádka s rodičem aktivuje stejné obvody jako nebezpečí. Dýchej. Vagusový nerv — pomalý výdech ho aktivuje. 4 sekundy nádech, 6 sekund výdech."},
  {id:"x-parents-3",emo:"anxiety",reason:["parents"],icon:"📝",title:"Zapiš si scénáře.",src:"CBT",color:T.orange,text:"Co nejhoršího se může stát? Zapiš si to. Pak se zeptej: jak pravděpodobné to je? A co bys udělal, kdyby se to stalo? Většina strachu z rodičů je projekce — ne realita."},

  // ── friends ──
  {id:"x-friends-1",emo:"anxiety",reason:["friends"],icon:"🎪",title:"Nikdo se na tebe tak nedívá.",src:"Spotlight Effect",color:T.orange,text:"Psychologie to nazývá 'spotlight effect'. Myslíš, že se na tebe všichni dívají. Ve skutečnosti každý řeší sám sebe. Nikdo si nevšiml toho, co tě trápí. Jsi svobodnější, než si myslíš."},
  {id:"x-friends-2",emo:"anxiety",reason:["friends"],icon:"🎭",title:"Nemusíš hrát roli.",src:"Brené Brown",color:T.orange,text:"Brown říká: nejodvážnější věc je být sám sebou. Úzkost z kamarádů často znamená, že hraješ roli, která tě vysiluje. Co kdybys zkusil být real? Pravý lidi tě za to budou mít radši."},
  {id:"x-friends-3",emo:"anxiety",reason:["friends"],icon:"💭",title:"Co si myslí? Nevíš.",src:"CBT",color:T.orange,text:"Tvůj mozek ti říká, co si o tobě myslí ostatní. Ale on to neví. Doslova si to vymýšlí. CBT tomu říká 'mind reading'. Nemáš telepatii. Přestaň hádat a zeptej se — nebo to nech být."},

  // ── social ──
  {id:"x-social-1",emo:"anxiety",reason:["social"],icon:"📱",title:"Doomscrolling = anxiety fuel.",src:"Neurověda",color:T.orange,text:"Každý scroll uvolňuje mikrodávku dopaminu a kortizolu zároveň. Jsi v dopaminové smyčce, která zvyšuje úzkost. Polož telefon. Nastavit timer na 30 minut bez screenu. Tvůj mozek ti poděkuje."},
  {id:"x-social-2",emo:"anxiety",reason:["social"],icon:"🔔",title:"Notifikace = stres triggers.",src:"Digital Wellness",color:T.orange,text:"Každá notifikace je mikrostres. Zvuk, vibrace, červená tečka — tvůj mozek to čte jako urgenci. Vypni notifikace na 1 hodinu. Svět se nezhroutí. Ale tvoje úzkost klesne. Zaručeně."},
  {id:"x-social-3",emo:"anxiety",reason:["social"],icon:"🌊",title:"FOMO je iluze.",src:"Psychologie",color:T.orange,text:"Fear Of Missing Out — strach, že ti něco uniká. Ale uniká ti jen curated verze reality. Nikdo nežije ten život, co ukazuje. Ty nežiješ horší život — žiješ reálný život. A to je víc."},

  // ── identity ──
  {id:"x-identity-1",emo:"anxiety",reason:["identity"],icon:"🌊",title:"Ty nejsi své myšlenky.",src:"CBT & Meditace",color:T.orange,text:"Myšlenka je jen myšlenka. Není to ty. Představ si řeku — myšlenky jsou lodě. Ty je nemusíš nastoupit. Ty jsi břeh. Břeh se nehýbe. Stůj pevně a nech lodě plout."},
  {id:"x-identity-2",emo:"anxiety",reason:["identity"],icon:"🧩",title:"Nemusíš mít jasno.",src:"Erik Erikson",color:T.orange,text:"Erikson říkal: hledání identity je normální práce teenagerů. Nemáš to mít vyřešené. Úzkost z 'kdo jsem?' je signál, že rosteš. Neběž od toho — sedni si s tím. Odpovědi přijdou."},
  {id:"x-identity-3",emo:"anxiety",reason:["identity"],icon:"🧘",title:"Grounding: 5-4-3-2-1.",src:"Psychoterapie",color:T.orange,text:"Úzkost tě vytrhává z těla. Vrať se zpět: 5 věcí vidíš. 4 slyšíš. 3 cítíš dotykem. 2 cítíš čichem. 1 ochutnáš. Jsi tady. Jsi v bezpečí. Tady a teď."},

  // ── lonely ──
  {id:"x-lonely-1",emo:"anxiety",reason:["lonely"],icon:"🧘",title:"Klid v chaosu.",src:"Wim Hof",color:T.orange,text:"Wim Hof říká: dech je tvůj kotevní bod. Když se všechno točí, vrať se k dechu. Nadechni se. 4 sekundy. Zadrž. 4 sekundy. Vydechni. 4 sekundy. Opakuj. Opice se uklidňuje."},
  {id:"x-lonely-2",emo:"anxiety",reason:["lonely"],icon:"🌍",title:"Osamělost je dočasná.",src:"Psychologie",color:T.orange,text:"Mozek v osamělosti zesiluje úzkost — evoluční mechanismus, aby tě donutil hledat kmen. Ale tenhle pocit je dočasný. Zkus jednu malou věc: napiš jednomu člověku. Jedinou zprávu. Začni malé."},
  {id:"x-lonely-3",emo:"anxiety",reason:["lonely"],icon:"💭",title:"Úzkost ze samoty lže.",src:"CBT",color:T.orange,text:"Tvůj mozek říká: 'Budeš sám navždy.' To je lež. Kognitivní zkreslení — catastrophizing. Podívej se na fakta: měl jsi kamarády dřív? Budeš je mít znovu. Tohle je fáze, ne stav."},

  // ── other ──
  {id:"x-other-1",emo:"anxiety",reason:["other"],icon:"🧘",title:"4-7-8 dýchání.",src:"Andrew Weil",color:T.orange,text:"Dr. Weil vyvinul techniku 4-7-8. Nadechni se na 4. Zadrž na 7. Pomalu vydechni na 8. Opakuj 3×. Aktivuješ parasympatikus — systém klidu. Za 60 sekund budeš jiný člověk."},
  {id:"x-other-2",emo:"anxiety",reason:["other"],icon:"📋",title:"Worry time: 15 minut.",src:"CBT",color:T.orange,text:"Dej si 'worry time' — 15 minut, kdy se smíš bát. Zapiš si všechno, co tě trápí. Pak zavři sešit. A když přijde úzkost mimo worry time? Řekni: 'Teď ne. V 18:00.' Mozek to přijme."},
  {id:"x-other-3",emo:"anxiety",reason:["other"],icon:"🐵",title:"Opice skáče. Ty ne.",src:"Monkey Mind",color:T.orange,text:"Tvoje vnitřní opice skáče ze stromu na strom. Panikuje. Křičí. Ale ty nejsi ta opice. Ty jsi ten, kdo ji pozoruje. A pozorovatel je vždy v klidu. Sedni si. Dýchej. Pozoruj opici. Nech ji skákat."},
];

// ════════════════════════════════════════
//  GENERIC SPEECHES (all moods)
// ════════════════════════════════════════

const GENERIC_SPEECHES: Speech[] = [
  {id:"g1",emo:"all",reason:[],icon:"🐵",title:"Opice není ty.",src:"Monkey Mind",color:T.orange,text:"Ta opice v tvé hlavě — co skáče a křičí — to není ty. Ty jsi ten, kdo ji pozoruje. A pozorovatel je vždy silnější. Kdo má dnes kontrolu? Opice, nebo ty?"},
  {id:"g2",emo:"all",reason:[],icon:"⚡",title:"Puberta je superpower.",src:"Motivace",color:T.orange,text:"Zlato se čistí v ohni. Ocel se kalí v chladu. Ty se stáváš silnějším právě teď. Puberta je nejtěžší přestavba mozku v celém životě. A ty ji přežíváš. To je výkon."},
  {id:"g3",emo:"all",reason:[],icon:"🧬",title:"Tvůj mozek se mění.",src:"Neurověda",color:T.orange,text:"Mezi 12 a 25 se tvůj mozek kompletně přestavuje. Myelin. Synapse. Prefrontální kortex. Jsi doslova pod rekonstrukcí. Takže když se cítíš divně — to není bug. To je update."},
];

// ════════════════════════════════════════
//  EXPORTS
// ════════════════════════════════════════

export const ALL_SPEECHES: Speech[] = [
  ...POSITIVE_SPEECHES,
  ...ANGER_SPEECHES,
  ...SADNESS_SPEECHES,
  ...ANXIETY_SPEECHES,
  ...GENERIC_SPEECHES,
];

export function getRecommendations(mood: { id: string } | null, reason: { id: string } | null) {
  const moodId = mood?.id || "";
  const reasonId = reason?.id || "";
  const isPositive = moodId === "great" || moodId === "pumped";

  const emoMap: Record<string, string> = {
    great: "positive", pumped: "positive",
    meh: "anxiety", angry: "anger",
    sad: "sadness", anxious: "anxiety", awful: "sadness",
  };
  const realEmo = emoMap[moodId] || "all";

  // Pick the right pool
  const pool = isPositive ? POSITIVE_SPEECHES
    : realEmo === "anger" ? ANGER_SPEECHES
    : realEmo === "sadness" ? SADNESS_SPEECHES
    : realEmo === "anxiety" ? ANXIETY_SPEECHES
    : GENERIC_SPEECHES;

  // 1. Exact match: same emotion + reason
  let speeches = pool.filter(s => s.reason.includes(reasonId));

  // 2. If we have 3+, take exactly 3
  if (speeches.length >= 3) {
    speeches = speeches.slice(0, 3);
  } else {
    // Fill from same emotion pool (different reasons)
    const remaining = pool.filter(s => !speeches.includes(s));
    speeches = [...speeches, ...remaining].slice(0, 3);
  }

  // 3. Final fallback to generics if still short
  if (speeches.length < 3) {
    const generics = GENERIC_SPEECHES.filter(s => !speeches.includes(s));
    speeches = [...speeches, ...generics].slice(0, 3);
  }

  return {
    speeches,
    breathType: realEmo === "anxiety" ? "sleep" as const : "box" as const,
    showMetal: realEmo === "anger" || reasonId === "siblings",
    showGrounding: realEmo === "anxiety",
    emo: realEmo,
  };
}
