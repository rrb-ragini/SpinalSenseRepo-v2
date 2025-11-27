import OpenAI from "openai";
import { buildSystemPrompt } from "../../lib/prompts";
import { saveMemory, fetchMemories } from "../../lib/pinecone";

// Short-term memory fallback
if (!globalThis.__SPINAL_MEMORY) {
  globalThis.__SPINAL_MEMORY = new Map();
}

export async function POST(req) {
  try {
    const { messages, conversationId, saveHistory = true } = await req.json();

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // -------------------------------
    // 1. FETCH RAG MEMORY
    // -------------------------------
    let ragMemory = [];
    if (conversationId && messages?.length > 0) {
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      ragMemory = await fetchMemories(conversationId, lastUserMessage);
    }

    const memoryPrompt = ragMemory.length
      ? `Relevant past context:\n${ragMemory.map((m) => "- " + m).join("\n")}`
      : "No relevant past memory.";

    // -------------------------------
    // 2. CALL OPENAI
    // -------------------------------
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "system", content: memoryPrompt },
        ...messages,
      ],
    });

    const output = completion.choices[0].message.content;

    // -------------------------------
    // 3. STORE MEMORY (safe)
    // -------------------------------
    if (conversationId) {
      try {
        const lastUser = messages[messages.length - 1]?.content;
        if (lastUser) await saveMemory(conversationId, "user", lastUser);

        await saveMemory(conversationId, "assistant", output);
      } catch (err) {
        console.error("Memory saving failed:", err);
      }
    }

    // -------------------------------
    // 4. UPDATE SHORT-TERM MEMORY
    // -------------------------------
    const mem = globalThis.__SPINAL_MEMORY;
    if (conversationId && saveHistory) {
      const prev = mem.get(conversationId) || [];
      const updated = [...prev, ...messages, { role: "assistant", content: output }];
      mem.set(conversationId, updated.slice(-16)); // keep small
    }

    return Response.json({ message: output });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
