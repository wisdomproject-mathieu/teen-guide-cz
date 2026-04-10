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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function buildOpenAIStream(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  choices: [{ delta: { content: delta } }],
                })}\n\n`));
              }
            } catch {
              // Ignore malformed partial frames.
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}

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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAIMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages as ChatMessage[]).slice(-20).map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: openAIMessages,
        temperature: 0.9,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "OpenAI chat failed";
      try {
        const parsed = JSON.parse(errorText);
        errorMessage = parsed?.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.body) {
      throw new Error("OpenAI returned no response body");
    }

    return new Response(buildOpenAIStream(response.body), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
