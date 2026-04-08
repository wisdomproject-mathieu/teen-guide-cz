import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tone-aware voice settings per emotion
const VOICE_SETTINGS: Record<string, { stability: number; style: number; speed: number }> = {
  anger:   { stability: 0.3, style: 0.7, speed: 1.1 },
  sadness: { stability: 0.6, style: 0.4, speed: 0.9 },
  anxiety: { stability: 0.7, style: 0.3, speed: 0.85 },
  fear:    { stability: 0.5, style: 0.5, speed: 0.95 },
  lonely:  { stability: 0.6, style: 0.4, speed: 0.9 },
  overwhelm: { stability: 0.6, style: 0.3, speed: 0.9 },
  all:     { stability: 0.5, style: 0.5, speed: 1.0 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion, intensity } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Daniel voice - good for Czech/multilingual content
    const voiceId = "onwK4e9ZLuTAKqWW03F9";
    const baseSettings = VOICE_SETTINGS[emotion] || VOICE_SETTINGS.all;
    // Intensity modulation (1-5 scale): higher intensity = less stability, more style, faster
    const intensityFactor = typeof intensity === "number" ? Math.max(1, Math.min(5, intensity)) : 3;
    const settings = {
      stability: Math.max(0.1, baseSettings.stability - (intensityFactor - 3) * 0.1),
      style: Math.min(1, baseSettings.style + (intensityFactor - 3) * 0.08),
      speed: Math.min(1.3, baseSettings.speed + (intensityFactor - 3) * 0.05),
    };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: settings.stability,
            similarity_boost: 0.75,
            style: settings.style,
            use_speaker_boost: true,
            speed: settings.speed,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs error:", response.status, errText);
      // For auth/billing errors (401/402), signal client to use browser fallback
      const isRecoverable = response.status === 401 || response.status === 402 || response.status >= 500;
      return new Response(JSON.stringify({ 
        error: isRecoverable ? "SERVICE_UNAVAILABLE" : "TTS generation failed", 
        fallback: isRecoverable,
        details: errText 
      }), {
        status: 200, // Return 200 so client can read the JSON body
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
