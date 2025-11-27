// lib/vision.js
import OpenAI from "openai";

/**
 * analyzeImageWithVision(buffer, mimeType)
 * - buffer: Buffer of image bytes
 * - mimeType: string e.g. "image/jpeg"
 *
 * Returns a JSON object: { cobb_angle, severity, explanation, can_measure, overlay_url }
 */
export async function analyzeImageWithVision(buffer, mimeType = "image/jpeg") {
  // instantiate the client at runtime (safe for Vercel builds)
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // convert to data URL (safe, small images ok)
  const base64 = Buffer.from(buffer).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  // TOLERANT prompt — ask for JSON only but be tolerant when image is low quality
  const prompt = `You are a spine radiology assistant. Return STRICT JSON ONLY (no surrounding text).
Analyze the provided AP/PA spine X-ray image and:
- If you can compute a Cobb angle, set "can_measure": true and return numeric "cobb_angle" (degrees).
- If image quality prevents measurement, set "can_measure": false and include a short "explanation".

Return keys:
{
  "cobb_angle": <number or null>,
  "severity": "<none|mild|moderate|severe|null>",
  "explanation": "<short text>",
  "can_measure": true|false
}

If uncertain, prefer a best-effort measurement but set explanation describing uncertainty.
`;

  // call the Vision-capable chat completion with image
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: dataUrl }
        ]
      }
    ],
    max_tokens: 400
  });

  const raw = response?.choices?.[0]?.message?.content;
  if (!raw) {
    return { can_measure: false, explanation: "Empty model response", overlay_url: dataUrl };
  }

  // robust JSON extraction (tries to parse raw or extract first {...})
  let json = null;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        json = JSON.parse(m[0]);
      } catch (e2) {
        return { can_measure: false, explanation: "Model returned non-JSON output", overlay_url: dataUrl, raw_output: raw };
      }
    } else {
      return { can_measure: false, explanation: "Model returned non-JSON output", overlay_url: dataUrl, raw_output: raw };
    }
  }

  // normalise fields
  json.can_measure = !!json.can_measure;
  if (json.cobb_angle !== undefined && json.cobb_angle !== null) {
    json.cobb_angle = Number(json.cobb_angle);
  } else {
    json.cobb_angle = null;
  }

  json.overlay_url = dataUrl;
  return json;
}
