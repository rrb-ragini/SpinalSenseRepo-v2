import OpenAI from "openai";
import { buildSystemPrompt } from "../../lib/prompts";

// Server-side memory (ephemeral)
if (!globalThis.__SPINAL_MEMORY) {
  globalThis.__SPINAL_MEMORY = new Map();
}

export async function POST(req) {
  try {
    const { messages, conversationId, saveHistory = true } = await req.json();

    const memory = globalThis.__SPINAL_MEMORY;
    let previous = [];

    if (conversationId && memory.has(conversationId)) {
      previous = memory.get(conversationId).slice(-8); // last 8 turns
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...previous,
        ...messages
      ],
    });

    const output = completion.choices[0].message.content;

    // Update memory
    if (conversationId && saveHistory) {
      const updated = [...previous, ...messages, { role: "assistant", content: output }];
      memory.set(conversationId, updated.slice(-16)); // keep memory small
    }

    return Response.json({ message: output });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
