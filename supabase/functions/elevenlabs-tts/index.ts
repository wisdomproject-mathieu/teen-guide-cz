import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tone-aware voice settings per emotion
const VOICE_SETTINGS: Record<string, { stability: number; style: number; speed: number }> = {
  anger:   { stability: 0.28, style: 0.82, speed: 1.14 },
  sadness: { stability: 0.44, style: 0.62, speed: 1.0 },
  anxiety: { stability: 0.48, style: 0.58, speed: 1.02 },
  fear:    { stability: 0.4, style: 0.68, speed: 1.04 },
  lonely:  { stability: 0.42, style: 0.64, speed: 1.0 },
  overwhelm: { stability: 0.4, style: 0.66, speed: 1.03 },
  all:     { stability: 0.36, style: 0.74, speed: 1.08 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion } = await req.json();

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
    const settings = VOICE_SETTINGS[emotion] || VOICE_SETTINGS.all;

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
            similarity_boost: 0.82,
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
      return new Response(JSON.stringify({
        error: upstreamMessage.toLowerCase().includes("invalid api key") ? "Neplatný ELEVENLABS_API_KEY" : "TTS generation failed",
        details: upstreamMessage || errText,
      }), {
        status: response.status,
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
