---
name: App structure
description: 3-tab layout with CÍTÍM, VÝZVY (quests + skins), PROFIL + floating SOS button
type: feature
---
App restructured to 3 tabs + SOS:
- CÍTÍM: Mood → Why → Tailored results (speeches, breathing, grounding, metal — all merged)
- VÝZVY: Daily challenges/quests with XP system + unlockable monkey skins (replaced AI chat)
- PROFIL: Stats, diary, SOS contacts, mood calendar
- SOS: Center floating red button (overlay)

Monkey skins: OG (0 XP), Fire (50), Ninja (150), Astro (300), Diamond (500), King (1000)
Quest completion auto-triggers on: check-in, breathing, diary, speech play, grounding, streaks.
XP and quest data stored in localStorage.
