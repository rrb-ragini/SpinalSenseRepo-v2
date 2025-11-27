// app/api/infer/route.js
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // important for Vercel runtime

// Create client ONLY at runtime (not at build)
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
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;

    const client = getClient();
    if (!client) {
      return Response.json({ error: "Server missing API key." }, { status: 500 });
    }

    const prompt = `
You are a professional radiology assistant.
Analyze the spine X-ray and return STRICT JSON ONLY:

{
  "can_measure": true/false,
  "cobb_angle": number or null,
  "severity": "none/mild/moderate/severe" or null,
  "explanation": "short text"
}

If the image is unclear, return:
{
  "can_measure": false,
  "cobb_angle": null,
  "severity": null,
  "explanation": "reason"
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "input_image", image_url: dataUrl }
          ]
        }
      ]
    });

    const raw = response?.choices?.[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from model");
    }

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("Model did not return JSON: " + raw);
      }
    }

    return Response.json(json);

  } catch (err) {
    console.error("❌ Infer API ERROR:", err);
    return Response.json(
      { error: "Analysis failed", details: String(err) },
      { status: 500 }
    );
  }
}
