// app/api/infer/route.js
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("❌ OPENAI_API_KEY missing at runtime");
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
      return Response.json({ error: "Server misconfigured - Missing OPENAI_API_KEY." }, { status: 500 });
    }

    const prompt = `
You are a professional radiology assistant.
Return STRICT JSON ONLY:

{
  "can_measure": true|false,
  "cobb_angle": <number|null>,
  "severity": "<none|mild|moderate|severe|null>",
  "explanation": "<short text>"
}

If the image is unclear, return can_measure=false.
`;

    // ⭐ BEST MODEL WITH VISION SUPPORT
    const model = "gpt-4o";

    console.log("📡 Calling OpenAI with:", model);

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: dataUrl }
          ]
        }
      ],
      max_tokens: 500
    });

    const raw = response?.choices?.[0]?.message?.content;
    if (!raw) {
      return Response.json(
        { error: "OpenAI returned empty response", raw_output: response },
        { status: 502 }
      );
    }

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const block = raw.match(/\{[\s\S]*\}/);
      if (block) parsed = JSON.parse(block[0]);
    }

    if (!parsed) {
      return Response.json(
        { error: "Could not parse JSON", raw_output: raw },
        { status: 502 }
      );
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
