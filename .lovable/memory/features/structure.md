---
name: App structure
description: 4-tab layout with auth, cloud data persistence, CÍTÍM, OPIČÁK AI chat, VÝZVY quests/skins, PROFIL + floating SOS button
type: feature
---
App with auth + 4 tabs + SOS:
- AUTH: Email/password login & signup at /auth route. Email verification required.
- CÍTÍM: Mood → Why → Tailored results (speeches, breathing, grounding, metal — all merged)
- OPIČÁK: AI monkey chat buddy via Lovable AI (monkey-chat edge function, streaming)
- VÝZVY: Daily challenges/quests with XP system + unlockable monkey skins
- PROFIL: Stats, mood insights dashboard, diary, SOS contacts, mood calendar, sign-out
- SOS: Center floating red button (overlay)

Cloud data (Lovable Cloud):
- profiles: display_name, avatar_url, equipped_skin (auto-created on signup)
- mood_logs: mood_id, reason_id, created_at
- diary_entries: content, mood_tag
- user_progress: xp, streak_count, completed_quests, last_checkin_date (auto-created on signup)
- sos_contacts: name, phone

Key hooks:
- useAuth (src/hooks/useAuth.tsx) — auth context with signUp/signIn/signOut
- useCloudData (src/hooks/useCloudData.tsx) — loads/saves all user data from cloud

Monkey skins: OG (0 XP), Fire (50), Ninja (150), Astro (300), Diamond (500), King (1000)
Quest completion auto-triggers on: check-in, breathing, diary, speech play, grounding, streaks.