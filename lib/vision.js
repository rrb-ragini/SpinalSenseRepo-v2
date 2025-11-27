import OpenAI from "openai";

export async function analyzeImageWithVision(buffer, mimeType = "image/jpeg") {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const base64 = Buffer.from(buffer).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const prompt = `
You are a spine radiology expert. Return STRICT JSON ONLY:

{
  "cobb_angle": <number or null>,
  "severity": "<none|mild|moderate|severe>",
  "explanation": "<short explanation>",
  "can_measure": true or false
}
`;

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
    ]
  });

  const raw = response.choices[0].message.content;

  try {
    const json = JSON.parse(raw);
    json.overlay_url = dataUrl; // optional preview
    return json;
  } catch (err) {
    return {
      can_measure: false,
      explanation: "Model returned invalid JSON."
    };
  }
}
