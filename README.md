# Teen Guide CZ

Teen mental health app in Czech with a streetwear monkey vibe. The app includes mood check-ins, tailored motivational speeches, breathing tools, SOS flows, AI chat, quests/XP, and a profile dashboard backed by Supabase.

## Stack

- Vite + React + TypeScript
- Supabase auth, database, and edge functions
- Recharts for mood insights
- Capacitor config for mobile packaging

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

3. Start the app:

```bash
npm run dev
```

## Verification

```bash
npm run lint
npm test
npm run build
```

## Supabase requirements

Apply the SQL migration in [`supabase/migrations/20260403213703_419a6b6f-9c42-44cf-9284-d08ec2d31b57.sql`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/migrations/20260403213703_419a6b6f-9c42-44cf-9284-d08ec2d31b57.sql) to create:

- `profiles`
- `mood_logs`
- `diary_entries`
- `user_progress`
- `sos_contacts`
- `subscriptions`

Deploy these edge functions:

- [`supabase/functions/elevenlabs-tts/index.ts`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/functions/elevenlabs-tts/index.ts)
- [`supabase/functions/elevenlabs-music/index.ts`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/functions/elevenlabs-music/index.ts)
- [`supabase/functions/monkey-chat/index.ts`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/functions/monkey-chat/index.ts)
- [`supabase/functions/create-checkout-session/index.ts`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/functions/create-checkout-session/index.ts)
- [`supabase/functions/stripe-webhook/index.ts`](/Users/mathieuescande/Documents/teen-guide-cz/supabase/functions/stripe-webhook/index.ts)

Required Supabase secrets:

- `ELEVENLABS_API_KEY`
- `LOVABLE_API_KEY`

Payment gateway secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_ANNUAL`
- `SITE_URL`

## Notes

- Speech playback prefers ElevenLabs and falls back to the browser TTS engine when the function is unavailable.
- SOS music generation falls back to Web Audio if the music function fails.
- Stripe Checkout drives `subscriptions` and the webhook mirrors entitlement back to `profiles.subscription_tier`.
