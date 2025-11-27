// app/api/infer/route.js
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY is missing");
    return null;
  }
  return new OpenAI({ apiKey });
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

    // ⭐ USE A GOOD MODEL — gpt-4o (stable, best for images)
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Return STRICT JSON ONLY:

{
  "can_measure": true|false,
  "cobb_angle": <number|null>,
  "severity": "<none|mild/moderate/severe|null>",
  "explanation": "<short text>"
}`
            },
            { type: "input_image", image_url: dataUrl }
          ]
        }
      ],
      max_tokens: 300
    });

    const raw = response?.choices?.[0]?.message?.content;
    if (!raw) {
      return Response.json(
        { error: "OpenAI returned empty response" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Model output not JSON");
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
