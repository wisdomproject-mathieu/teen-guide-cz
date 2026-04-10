import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, duration } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try Music API first
    let audioBuffer: ArrayBuffer | null = null;

    try {
      const musicResponse = await fetch("https://api.elevenlabs.io/v1/music", {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          duration_seconds: duration || 30,
        }),
      });

      if (musicResponse.ok) {
        audioBuffer = await musicResponse.arrayBuffer();
      } else {
        const errText = await musicResponse.text();
        console.log("Music API unavailable, falling back to SFX:", musicResponse.status, errText);
      }
    } catch (e) {
      console.log("Music API error, falling back to SFX:", e.message);
    }

    // Fallback: Sound Effects API (available on free plans)
    if (!audioBuffer) {
      console.log("Using Sound Effects API fallback with prompt:", prompt);
      const sfxResponse = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
          duration_seconds: Math.min(duration || 22, 22), // SFX max is 22 seconds
          prompt_influence: 0.3,
        }),
      });

      if (!sfxResponse.ok) {
        const errText = await sfxResponse.text();
        console.error("SFX API also failed:", sfxResponse.status, errText);
        return new Response(JSON.stringify({ 
          error: "SERVICE_UNAVAILABLE", 
          fallback: true,
          details: errText 
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      audioBuffer = await sfxResponse.arrayBuffer();
    }

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
