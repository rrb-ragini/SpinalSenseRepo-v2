export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  const apiKey = process.env.OPENAI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2
    })
  });

  const json = await res.json();
  return Response.json({ assistant: json.choices[0].message });
}
