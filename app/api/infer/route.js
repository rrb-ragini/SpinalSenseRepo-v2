// app/api/infer/route.js
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("❌ OPENAI_API_KEY missing");
    return null;
  }
  return new OpenAI({ apiKey: key });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/png";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    const client = getClient();
    if (!client) {
      return Response.json(
        { error: "Server missing API key" },
        { status: 500 }
      );
    }

    const prompt = `
You are a professional radiology assistant.
Return STRICT JSON only with this shape:

{
  "can_measure": true|false,
  "cobb_angle": number|null,
  "severity": "none"|"mild"|"moderate"|"severe"|null,
  "explanation": "short text"
}
`;

    // ✅ Use ONLY gpt-4.1 (no iteration!)
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: {url: dataUrl}}
          ]
        }
      ],
      max_tokens: 500
    });

    // Extract content from the model safely
let content = response?.choices?.[0]?.message?.content;

// Handle array-based content (gpt-4o format)
if (Array.isArray(content)) {
  const textItem = content.find(c => c.type === "output_text" || c.type === "text");
  content = textItem?.text ?? null;
}

// Validate content
if (!content || typeof content !== "string") {
  console.error("❌ Model returned no string content:", content);
  return Response.json(
    { error: "Model returned no usable output", raw: content },
    { status: 502 }
  );
}

// Try parsing JSON
let parsed;
try {
  parsed = JSON.parse(content);
} catch {
  const m = content.match(/\{[\s\S]*\}/);
  if (m) parsed = JSON.parse(m[0]);
  else {
    return Response.json(
      { error: "Model output was not JSON", raw: content },
      { status: 500 }
    );
  }
}
    
    parsed.overlay_url = dataUrl;

    return Response.json(parsed, { status: 200 });

  } catch (err) {
    console.error("❌ Infer route error:", err);
    return Response.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
