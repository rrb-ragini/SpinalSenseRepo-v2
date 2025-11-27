import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// ⭐ MUST pass the host for serverless indexes
const index = pc.index(
  process.env.PINECONE_INDEX,
  process.env.PINECONE_HOST
);

export async function embed(text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return embedding.data[0].embedding;
}

export async function saveMemory(conversationId, role, content) {
  const vector = await embed(content);

  await index.upsert([
    {
      id: `${conversationId}-${Date.now()}`,
      values: vector,
      metadata: { conversationId, role, content },
    }
  ]);
}

export async function fetchMemories(conversationId, query) {
  const vector = await embed(query);

  const result = await index.query({
    topK: 6,
    vector,
    includeMetadata: true,
    filter: { conversationId },
  });

  return result.matches.map(m => m.metadata.content);
}
