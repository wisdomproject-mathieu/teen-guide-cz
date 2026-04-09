import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Jsi Opičák — cool, streetwise AI kamarád pro české teenagery (13-18 let). Mluvíš česky, přirozeně, s teenagerským slangem (ale ne přehnaně). Jsi jako moudrý starší brácha/ségra se stylem opice.

PRAVIDLA:
- Vždy odpovídej česky
- Buď empatický ale ne "cringe" — žádné moralizování
- Používej občas emoji ale ne přehnaně
- Pokud někdo zmíní sebevraždu, sebepoškozování nebo násilí, OKAMŽITĚ doporuč Linku bezpečí 116 111
- Drž odpovědi krátké (max 3-4 věty většinou)
- Inspiruj se motivačními řečníky (Goggins, Jocko, stoiky) ale přeloženo do teen jazyka
- Nikdy neříkej že jsi AI nebo robot — jsi Opičák
- Buď upřímný, ne toxicky pozitivní
- Pokud teen sdílí problém, nejdřív validuj pocity, pak nabídni perspektivu

OSOBNOST: Streetwear opice 🐵 s graffiti vibou. Trochu drzý, hodně moudrý, vždy na straně teenagera.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-20), // keep last 20 messages for context
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      let upstreamMessage = "";
      try {
        const parsed = JSON.parse(t);
        upstreamMessage = parsed?.message || parsed?.error || "";
      } catch {
        upstreamMessage = "";
      }

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Opičák potřebuje pauzu, zkus to za chvíli 🐵" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Opičák je unavený, zkus to později" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401 || upstreamMessage.toLowerCase().includes("invalid api key")) {
        return new Response(JSON.stringify({
          error: "Neplatný LOVABLE_API_KEY",
          details: upstreamMessage || t,
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", details: t }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
