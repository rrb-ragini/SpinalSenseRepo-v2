import OpenAI from "openai";
import { buildSystemPrompt } from "../../lib/prompts";
import { saveMemory, fetchMemories } from "../../lib/pinecone";

// Server-side memory (ephemeral fallback)
if (!globalThis.__SPINAL_MEMORY) {
  globalThis.__SPINAL_MEMORY = new Map();
}

export async function POST(req) {
  try {
    const { messages, conversationId, saveHistory = true } = await req.json();

    const memory = globalThis.__SPINAL_MEMORY;
    let previous = [];

    if (conversationId && memory.has(conversationId)) {
      previous = memory.get(conversationId).slice(-8);
    }

    // === Fetch RAG Memory from Pinecone ===
    let retrieved = [];
    if (conversationId) {
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      retrieved = await fetchMemories(conversationId, lastUserMessage);
    }

    const memoryPrompt = retrieved.length
      ? `Relevant past context:\n${retrieved.map(r => "- " + r).join("\n")}`
      : "No relevant past memory.";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // === Call GPT with both system + RAG memory ===
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "system", content: memoryPrompt },
        ...messages
      ],
    });

    const output = completion.choices[0].message.content;

    // === Save to Pinecone ===
    if (conversationId) {
      const lastUserMessage = messages[messages.length - 1]?.content;
      await saveMemory(conversationId, "user", lastUserMessage);
      await saveMemory(conversationId, "assistant", output);
    }

    // === Update short-term memory ===
    if (conversationId && saveHistory) {
      const updated = [...previous, ...messages, { role: "assistant", content: output }];
      memory.set(conversationId, updated.slice(-16));
    }

    return Response.json({ message: output });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
