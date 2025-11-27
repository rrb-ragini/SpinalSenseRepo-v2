import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔥 Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// 🔥 Serverless index (must pass HOST parameter)
const index = pc.index(
  process.env.PINECONE_INDEX,
  process.env.PINECONE_HOST
);

// -------------------------------
// EMBED FUNCTION (1536 dims)
// -------------------------------
export async function embed(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // ALWAYS 1536 dimension
    input: text,
  });

  return response.data[0].embedding;
}

// -------------------------------
// SAVE MEMORY (safe)
// -------------------------------
export async function saveMemory(conversationId, role, content) {
  try {
    const vector = await embed(content);

    await index.upsert([
      {
        id: `${conversationId}-${Date.now()}`,
        values: vector,
        metadata: {
          conversationId,
          role,
          content,
        },
      },
    ]);
  } catch (err) {
    console.error("🔴 Pinecone saveMemory failed:", err.message);
  }
}

// -------------------------------
// FETCH MEMORY (safe)
// -------------------------------
export async function fetchMemories(conversationId, query) {
  try {
    const queryVector = await embed(query);

    const results = await index.query({
      topK: 6,
      vector: queryVector,
      includeMetadata: true,
      filter: { conversationId },
    });

    return results.matches.map((m) => m.metadata.content);
  } catch (err) {
    console.error("🔴 Pinecone fetchMemories failed:", err.message);
    return [];
  }
}
