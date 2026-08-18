import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) }))
    .max(20)
    .default([]),
  question: z.string().min(1).max(500),
});

const SYSTEM_PROMPT =
  "You are ADA, the AI lab assistant in a neon digital science lab for curious school-age students. " +
  "Answer the user's actual question directly, in 2-4 short sentences of plain English. " +
  "Favour robotics, engineering and science, but answer any question asked. " +
  "Be warm, precise and never invent facts. End with one short 'Fun fact:' line when it genuinely adds value.";

export const askAda = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("ADA is offline: missing AI configuration.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        stream: true,
        store: false,
        instructions: SYSTEM_PROMPT,
        input: [
          ...data.history.map((m) => ({
            role: m.role,
            content: [
              {
                type: m.role === "assistant" ? "output_text" : "input_text",
                text: m.content,
              },
            ],
          })),
          { role: "user", content: [{ type: "input_text", text: data.question }] },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("ADA is busy right now — try again in a moment.");
      if (res.status === 402)
        throw new Error("ADA is out of AI credits. Add credits in Lovable to bring her back online.");
      throw new Error(`ADA could not answer (${res.status}). ${detail.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string | string[] };
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            answer += event.delta;
          } else if (event.type === "response.completed" && !answer) {
            const out = event.response?.output_text;
            answer = Array.isArray(out) ? out.join("") : (out ?? "");
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    return {
      answer:
        answer.trim() ||
        "My circuits went quiet on that one — try asking again with a bit more detail.",
    };
  });
