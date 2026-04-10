import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type VoiceSettings = {
  stability: number;
  style: number;
  speed: number;
  similarity_boost: number;
};

// More energetic baseline for direct-address motivational delivery.
const VOICE_SETTINGS: Record<string, VoiceSettings> = {
  anger:      { stability: 0.16, style: 0.96, speed: 1.18, similarity_boost: 0.86 },
  sadness:    { stability: 0.28, style: 0.82, speed: 1.04, similarity_boost: 0.84 },
  anxiety:    { stability: 0.24, style: 0.88, speed: 1.09, similarity_boost: 0.85 },
  fear:       { stability: 0.24, style: 0.9, speed: 1.08, similarity_boost: 0.85 },
  lonely:     { stability: 0.3, style: 0.8, speed: 1.03, similarity_boost: 0.84 },
  overwhelm:  { stability: 0.26, style: 0.84, speed: 1.06, similarity_boost: 0.84 },
  positive:   { stability: 0.18, style: 0.94, speed: 1.15, similarity_boost: 0.86 },
  all:        { stability: 0.2, style: 0.92, speed: 1.13, similarity_boost: 0.86 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function tuneVoiceSettings(emotion: string, text: string): VoiceSettings {
  const base = VOICE_SETTINGS[emotion] || VOICE_SETTINGS.all;
  const length = text.length;
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const shortPunch = length < 140;
  const longSupport = length > 240;

  let stability = base.stability;
  let style = base.style;
  let speed = base.speed;
  const similarity_boost = base.similarity_boost;

  if (shortPunch) {
    stability -= 0.04;
    style += 0.05;
    speed += 0.03;
  }

  if (longSupport) {
    stability += 0.05;
    style -= 0.04;
    speed -= 0.04;
  }

  if (exclamations > 0) {
    style += 0.04;
    speed += 0.02;
  }

  if (questions > 1) {
    stability += 0.02;
  }

  return {
    stability: clamp(stability, 0.12, 0.62),
    style: clamp(style, 0.55, 1),
    speed: clamp(speed, 0.96, 1.2),
    similarity_boost: clamp(similarity_boost, 0.78, 0.9),
  };
}

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
    const baseSettings = tuneVoiceSettings(emotion, text);
    // Intensity modulation (1-5 scale): higher intensity = less stability, more style, faster
    const intensityFactor = typeof intensity === "number" ? clamp(intensity, 1, 5) : 3;
    const settings = {
      stability: clamp(baseSettings.stability - (intensityFactor - 3) * 0.08, 0.1, 0.62),
      style: clamp(baseSettings.style + (intensityFactor - 3) * 0.05, 0.55, 1),
      speed: clamp(baseSettings.speed + (intensityFactor - 3) * 0.03, 0.96, 1.22),
      similarity_boost: baseSettings.similarity_boost,
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
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            use_speaker_boost: true,
            speed: settings.speed,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      let upstreamMessage = "";
      try {
        const parsed = JSON.parse(errText);
        upstreamMessage = parsed?.detail?.message || parsed?.message || "";
      } catch {
        upstreamMessage = "";
      }
      console.error("ElevenLabs error:", response.status, errText);
      const isRecoverable = response.status === 401 || response.status === 402 || response.status >= 500;
      return new Response(JSON.stringify({
        error: upstreamMessage.toLowerCase().includes("invalid api key")
          ? "Neplatný ELEVENLABS_API_KEY"
          : isRecoverable
            ? "SERVICE_UNAVAILABLE"
            : "TTS generation failed",
        fallback: isRecoverable,
        details: upstreamMessage || errText,
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
