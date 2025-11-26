export async function POST(req) {
  const form = await req.formData();
  const file = form.get("xray");

  return new Response(
    JSON.stringify({
      cobb_angle: 21.3,
      explanation: "Demo inference — replace with your real backend."
    }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
