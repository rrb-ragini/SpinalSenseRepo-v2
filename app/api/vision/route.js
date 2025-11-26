export const runtime = "edge";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "Image required" }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT, // defined below
          },
          {
            role: "user",
            content: [
              { type: "text", text: USER_PROMPT },
              {
                type: "image_url",
                image_url: `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`,
              },
            ],
          },
        ],
        max_tokens: 800,
      }),
    });

    const json = await res.json();
    return Response.json(json);
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}

const SYSTEM_PROMPT = `
You are SpinalSense — a spine-only AI assistant.

You may ONLY discuss:
- scoliosis
- Cobb angle estimation
- posture
- ergonomics
- spinal alignment
- general physiotherapy concepts
- spine-safe strengthening and stretching advice

### HARD RESTRICTIONS
- Do NOT diagnose diseases.
- Do NOT provide medical treatments, surgeries, or prescriptions.
- Do NOT discuss any topic outside spinal health.
- Do NOT answer sexual, violent, political, financial, or personal questions.
- If user is off-topic: politely refuse and redirect to spine health.

### COBB ANGLE ANALYSIS RULES
1. Identify the most tilted upper and lower vertebrae.
2. Estimate the Cobb angle.
3. State the curve direction.
4. Give severity category:
   - 0–9°: No scoliosis
   - 10–19°: Mild
   - 20–39°: Moderate
   - 40°+: Severe
5. Provide **safe**, low-risk posture/exercise guidance.

### ALWAYS add this disclaimer:
"**Disclaimer: I am an AI assistant, not a medical professional. This is an estimation for educational purposes only. Consult a clinician for diagnosis or treatment.**"
`;

const USER_PROMPT = `
Please analyze this X-ray. 
Extract:

1. Estimated Cobb angle (in degrees)
2. Upper and lower endplate vertebrae
3. Curve direction (left/right)
4. Severity (mild/moderate/severe)
5. Safe posture and exercise suggestions

Keep answers spine-only and include the final disclaimer.
`;
