import OpenAI from "openai";
import { buildSystemPrompt } from "../../lib/prompts";
import { fetchMemories } from "../../lib/pinecone";

// Short-term memory fallback
if (!globalThis.__SPINAL_MEMORY) {
  globalThis.__SPINAL_MEMORY = new Map();
}

export async function POST(req) {
  try {
    const { messages, conversationId, saveHistory = true } = await req.json();

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // -------------------------------
    // 1. SEARCH PINECONE RAG KNOWLEDGE BASE
    // -------------------------------
    let ragContext = [];
    if (messages?.length > 0) {
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      // Search Pinecone for relevant knowledge (not conversation history)
      ragContext = await fetchMemories(null, lastUserMessage);
    }

    const contextPrompt = ragContext.length
      ? `Relevant knowledge from database:\n${ragContext.map((m) => "- " + m).join("\n")}`
      : "";

    // -------------------------------
    // 2. CALL OPENAI WITH RAG CONTEXT
    // -------------------------------
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...(contextPrompt ? [{ role: "system", content: contextPrompt }] : []),
        ...messages,
      ],
    });

    const output = completion.choices[0].message.content;

    // -------------------------------
    // 3. UPDATE SHORT-TERM MEMORY (in-memory only, NOT Pinecone)
    // -------------------------------
    const mem = globalThis.__SPINAL_MEMORY;
    if (conversationId && saveHistory) {
      const prev = mem.get(conversationId) || [];
      const updated = [...prev, ...messages, { role: "assistant", content: output }];
      mem.set(conversationId, updated.slice(-16)); // keep small
    }

    return Response.json({ message: output });
  } catch (err) {
    console.error("CHAT ERROR DETAILS:", err);
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
