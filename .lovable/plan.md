

# Replace Browser TTS with ElevenLabs Czech Voice

## Current State
The `SpeechPlayer` component uses `window.speechSynthesis` (browser TTS) — this produces the robotic Czech voice. The app has motivational speeches with different emotional tones (anger, sadness, anxiety, fear).

## Plan

### 1. Set up Supabase + ElevenLabs backend
- Connect Supabase to the project (needed for secure API key storage)
- Store `ELEVENLABS_API_KEY` as a Supabase secret
- Create a Supabase Edge Function `elevenlabs-tts` that proxies TTS requests

### 2. Build the Index page with the full Monkey Mind app
- Port the pasted code into `src/pages/Index.tsx` as a proper React component
- All UI, state, and logic preserved as-is

### 3. Replace SpeechPlayer with ElevenLabs TTS
- Replace `window.speechSynthesis` calls with fetch to the edge function
- Use `eleven_multilingual_v2` model (best Czech support)
- Choose a Czech-friendly voice from ElevenLabs Voice Library

### 4. Add tone-aware voice settings per speech type
Map each speech emotion to different voice settings:

| Emotion | Stability | Style | Speed | Effect |
|---------|-----------|-------|-------|--------|
| anger (Goggins, Jocko) | 0.3 | 0.7 | 1.1 | Intense, motivational |
| sadness (Les Brown, Jung) | 0.6 | 0.4 | 0.9 | Warm, empathetic |
| anxiety (CBT, calming) | 0.7 | 0.3 | 0.85 | Calm, steady |
| fear (Stoics, Brené Brown) | 0.5 | 0.5 | 0.95 | Confident, grounded |
| all (general monkey mind) | 0.5