 # Monkey Mind Content System

## Purpose

This document replaces the old 20-speech prototype assumptions from earlier planning docs.

Use this as the source of truth for:
- speech library structure
- tone and motivation level
- mood + reason routing
- future premium content expansion
- voice direction for ElevenLabs and video shorts

## What changed since the first prototype

The older implementation roadmap was useful for structure, but parts of its "current state" are now outdated.

Outdated assumptions:
- the app is no longer a single static HTML prototype
- the library is no longer capped at 20 speeches
- the app already has premium gating, AI chat, Supabase, and Monkey shorts
- curated YouTube embeds already exist
- the profile/library/content stack is now real, not placeholder-only

Still useful from that roadmap:
- speeches are still the product core
- every speech should feel intentional, not generic
- content should be organized by emotion, reason, and intensity
- motion and voice must carry emotional energy, not just information

## Current speech library

Current total:
- 99 speeches
- 24 `positive`
- 24 `anger`
- 24 `sadness`
- 24 `anxiety`
- 3 generic fallback speeches

Current structure:
- 8 reasons per mood family
- 3 speeches per reason
- 1 through 3 should behave like a progression, even if the UI does not yet expose them as "levels"

## Speech level model

Every 3-speech bundle should follow this emotional ladder:

1. `Level 1 — Validate`
- lowers panic
- names the feeling
- gives relief or perspective
- good for lower to medium intensity

2. `Level 2 — Reframe`
- adds meaning, perspective, or challenge
- turns the state into motion
- good for medium intensity

3. `Level 3 — Activate`
- strongest push
- direct language
- action-oriented
- best for high intensity or premium "hard reset" moments

This should guide:
- future writing
- future TTS tuning
- future routing from the mood slider
- premium pack curation

## Voice direction

The problem to avoid:
- flat, informational, explanatory delivery

The target:
- direct
- emotional
- motivating
- slightly theatrical when needed
- still believable in Czech

Voice principles:
- `anger` should sound contained but dangerous, not chaotic
- `anxiety` should sound calm but firm, not sleepy
- `sadness` should sound warm and lifting, not soft to the point of weakness
- `positive` should sound alive and confident, not cheesy
- `all` should sound like a coach speaking straight to one teen, not a narrator reading a paragraph

Performance notes for future audio generation:
- level 1: steadier, more grounding
- level 2: more urgency, more movement
- level 3: strongest emphasis, slightly faster, more bite

## Routing model for future use

Target routing inputs:
- mood family
- reason
- intensity from slider

Suggested routing:
- intensity `1`: level 1
- intensity `2`: level 1 or 2
- intensity `3`: level 2
- intensity `4`: level 2 or 3
- intensity `5`: level 3

Future premium upgrade:
- premium can unlock alternate versions of the same speech idea
- example: `measured`, `charged`, `maximum`

## Free vs premium content rule

Free should prove the app works.

Free:
- best rescue speeches
- at least one strong speech per major pain state
- one hero external video
- safety tools always free

Premium should go deeper, harder, and more personal.

Premium:
- stronger intensity variants
- Monkey shorts
- deeper packs by theme
- richer chat entry points
- full educational modules

## Full speech map

Below is the current speech library grouped by mood family, reason, and level progression.

### Positive

| Reason | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| School | `Škola tě neporazí.` | `Flow state aktivován.` | `Důkaz, že to umíš.` |
| Siblings | `Sourozenci = tvůj tým.` | `Domov je silnější.` | `Spolu jste neporazitelní.` |
| Parents | `Rodiče jsou základ.` | `Bezpečný přístav.` | `Řekni jim to.` |
| Friends | `Parťáci na celej život.` | `Tvůj kmen tě nabíjí.` | `Friendship = wealth.` |
| Social | `Zdravý social = power.` | `Creator, ne consumer.` | `Inspirace z dobrých zdrojů.` |
| Identity | `Znáš sám sebe.` | `Stáváš se sebou.` | `Autentický = neporazitelný.` |
| Lonely | `Samota jako superpower.` | `Klid v tichu.` | `Kreativita v tichu.` |
| Other | `Good vibes only.` | `Dneska hraje tvůj song.` | `Opice je šťastná.` |

### Anger

| Reason | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| School | `Zkoušky nejsou o tobě.` | `Kontroluješ jen jednu věc.` | `Vztek na systém? Použij ho.` |
| Siblings | `Je to těžké? Dobře.` | `Přeměň vztek v palivo.` | `6 minut. Pak se rozhodni.` |
| Parents | `Jejich pravidla ≠ tvůj život.` | `Slyšíš jen šum.` | `Vztek = hranice.` |
| Friends | `Zrada bolí jinak.` | `Ne každý si zaslouží místo.` | `Cool down, pak jednej.` |
| Social | `Algoritmus tě provokuje.` | `Polož telefon. Teď.` | `Online drama ≠ realita.` |
| Identity | `Vztek je kompas.` | `Seš naštvanej na sebe?` | `Transformace začíná vztekem.` |
| Lonely | `Vztek na svět je normální.` | `Nikdo nerozumí? Fajn.` | `Osamělost ≠ slabost.` |
| Other | `Přeměň vztek v palivo.` | `90 sekund pravidlo.` | `Válečník, ne oběť.` |

### Sadness

| Reason | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| School | `Známky neměří tvou hodnotu.` | `Tma je nejtemnější před svítáním.` | `Jeden krok. Jen jeden.` |
| Siblings | `Sourozenci = celoživotní tým.` | `Vlny přijdou a odejdou.` | `Cítit bolest = cítit lásku.` |
| Parents | `Oni taky bojují.` | `Nerozumí ≠ nemilují.` | `Zapiš, co cítíš.` |
| Friends | `Tma je nejtemnější před svítáním.` | `Cítit je síla.` | `Lidi přicházejí a odcházejí.` |
| Social | `Scrolluješ, ale necítíš se líp.` | `Srovnávání je zloděj radosti.` | `Digital detox = reset.` |
| Identity | `Tvoje bolest tě přetváří.` | `Motýl taky prochází tmou.` | `Nemusíš vědět, kdo jsi.` |
| Lonely | `Velcí lidé jsou budovaní v tichu.` | `Jsi v tom sám? Ne.` | `Tvůj kmen existuje.` |
| Other | `Tohle přejde.` | `Plakat je OK.` | `Opice je tu s tebou.` |

### Anxiety

| Reason | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| School | `Strach je lhář.` | `Zkrať horizont.` | `Rozděl to na kusy.` |
| Siblings | `Dech je tvoje kotva.` | `Ty nejsi zodpovědný za ně.` | `Co přesně tě trápí?` |
| Parents | `Jejich očekávání ≠ tvůj osud.` | `Fight-flight-freeze.` | `Zapiš si scénáře.` |
| Friends | `Nikdo se na tebe tak nedívá.` | `Nemusíš hrát roli.` | `Co si myslí? Nevíš.` |
| Social | `Doomscrolling = anxiety fuel.` | `Notifikace = stres triggers.` | `FOMO je iluze.` |
| Identity | `Ty nejsi své myšlenky.` | `Nemusíš mít jasno.` | `Grounding: 5-4-3-2-1.` |
| Lonely | `Klid v chaosu.` | `Osamělost je dočasná.` | `Úzkost ze samoty lže.` |
| Other | `4-7-8 dýchání.` | `Worry time: 15 minut.` | `Opice skáče. Ty ne.` |

### Generic fallback

| Level | Speech |
| --- | --- |
| 1 | `Opice není ty.` |
| 2 | `Puberta je superpower.` |
| 3 | `Tvůj mozek se mění.` |

## Priority upgrade list

These are the best candidates for first premium-quality audio/video polish:

### High-impact school / anxiety
- `Strach je lhář.`
- `Zkrať horizont.`
- `Rozděl to na kusy.`

### High-impact anger / conflict
- `Vztek na systém? Použij ho.`
- `Vztek = hranice.`
- `Válečník, ne oběť.`

### High-impact sadness / loneliness
- `Jsi v tom sám? Ne.`
- `Tvůj kmen existuje.`
- `Tohle přejde.`

### High-impact activation
- `Puberta je superpower.`
- `Důkaz, že to umíš.`
- `Autentický = neporazitelný.`

## Pochop To content direction

The old roadmap was right that educational content needs stronger structure, but the naming and linking should match the current app.

Recommended module set for the current product:
- `Škola a tlak`
- `Rodiče a konflikty`
- `Kamarádi, vztahy a zrada`
- `Telefon, scroll a hlava`
- `Kdo jsem a kam jdu`

Each module should link back into speeches with:
- one validating speech
- one reframing speech
- one activating speech

## Short-form video rule

Monkey shorts should not feel like mini-podcasts.

They should feel like:
- one emotional hit
- one idea
- one command
- one visual rhythm

Target structure:
- 12 to 25 seconds
- 4 to 6 caption beats
- strong first line in first second
- visible emotional arc by scene 3
- last line must land like a quote, not an explanation

## Future content production rule

Before adding more features, improve the ratio of:
- stronger speech writing
- stronger delivery
- stronger visual pacing

The next best content unlock is not "more random speeches."
It is:
- better level 3 speeches
- stronger premium short variants
- deeper school / rage / loneliness packs

## Decision rule

If a content piece should calm, guide, or activate the teen in under 90 seconds, it belongs in the speech system.

If it should explain, teach, or build long-term self-understanding, it belongs in `Pochop to`.

If it should feel intense, memorable, and shareable, it belongs in `Monkey short`.
