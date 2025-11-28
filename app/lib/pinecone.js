import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔥 Pinecone client
let pc, index;

const initPinecone = () => {
  try {
    if (!process.env.PINECONE_API_KEY) {
      console.error("❌ MISSING PINECONE_API_KEY");
      return;
    }
    if (!process.env.PINECONE_INDEX) {
      console.error("❌ MISSING PINECONE_INDEX");
      return;
    }
    if (!process.env.PINECONE_HOST) {
      console.error("❌ MISSING PINECONE_HOST");
      return;
    }

    pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // 🔥 Serverless index (must pass HOST parameter)
    index = pc.index(
      process.env.PINECONE_INDEX,
      process.env.PINECONE_HOST
    );
    console.log("✅ Pinecone initialized for index:", process.env.PINECONE_INDEX);
  } catch (error) {
    console.error("PINECONE INIT ERROR:", error);
  }
};

initPinecone();

// -------------------------------
// EMBED FUNCTION (1024 dims to match Pinecone index)
// -------------------------------
export async function embed(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 1024, // Match Pinecone index dimension
    });
    return response.data[0].embedding;
  } catch (err) {
    console.error("EMBED ERROR:", err);
    throw err;
  }
}

// -------------------------------
// SAVE MEMORY (safe) - NOT USED FOR CHAT HISTORY
// -------------------------------
export async function saveMemory(conversationId, role, content) {
  if (!index) {
    console.warn("⚠️ Pinecone index not initialized. Skipping saveMemory.");
    return;
  }
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
// FETCH MEMORY - RAG KNOWLEDGE BASE SEARCH
// -------------------------------
export async function fetchMemories(conversationId, query) {
  if (!index) {
    console.warn("⚠️ Pinecone index not initialized. Skipping fetchMemories.");
    return [];
  }
  try {
    const queryVector = await embed(query);

    const results = await index.query({
      topK: 6,
      vector: queryVector,
      includeMetadata: true,
      // No filter - search all documents in knowledge base
    });

    return results.matches.map((m) => m.metadata.content);
  } catch (err) {
    console.error("🔴 Pinecone fetchMemories failed:", err.message);
    return [];
  }
}
