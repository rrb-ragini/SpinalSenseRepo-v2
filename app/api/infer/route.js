export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");  // <-- FIXED

  if (!file) {
    return Response.json(
      { error: "No file received in form-data. Expected key: 'file'." },
      { status: 400 }
    );
  }

  return Response.json(
    {
      cobb_angle: 21.3,
      explanation: "Demo inference — replace with your real backend."
    },
    { status: 200 }
  );
}
