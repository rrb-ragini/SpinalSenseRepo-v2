import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// The Pinecone index name must match your myAI3 index
const index = pc.index(process.env.PINECONE_INDEX);

export async function embedText(text) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return embedding.data[0].embedding;
}

export async function saveMemory(conversationId, role, content) {
  const vector = await embedText(content);

  await index.upsert([
    {
      id: `${conversationId}-${Date.now()}`,
      values: vector,
      metadata: { role, content, conversationId }
    }
  ]);
}

export async function fetchMemories(conversationId, query) {
  const queryVector = await embedText(query);

  const results = await index.query({
    topK: 6,
    vector: queryVector,
    includeMetadata: true,
    filter: { conversationId }
  });

  return results.matches.map(m => m.metadata.content);
}
