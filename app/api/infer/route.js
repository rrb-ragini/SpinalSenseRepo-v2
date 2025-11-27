// app/api/infer/route.js
import { analyzeImageWithVision } from "../../../lib/vision.js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();

    // accept both keys from frontend to be resilient
    let file = form.get("file") || form.get("xray");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided. Use 'file' form key." }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return new Response(JSON.stringify({ error: `Unsupported MIME type: ${file.type}` }), { status: 400, headers: { "content-type": "application/json" } });
    }

    // buffer the file
    const buffer = Buffer.from(await file.arrayBuffer());

    // call helper (which calls OpenAI)
    let result;
    try {
      result = await analyzeImageWithVision(buffer, file.type);
    } catch (err) {
      console.error("analyzeImageWithVision error:", err);
      return new Response(JSON.stringify({ error: "Analysis failed", detail: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
    }

    if (!result || result.can_measure === false) {
      return new Response(JSON.stringify({
        error: "Could not interpret this X-ray.",
        explanation: result?.explanation ?? "Image quality/orientation issue",
        raw_output: result?.raw_output ?? null
      }), { status: 400, headers: { "content-type": "application/json" } });
    }

    // final success
    return new Response(JSON.stringify({
      cobb_angle: result.cobb_angle,
      severity: result.severity ?? null,
      explanation: result.explanation ?? null,
      overlay_url: result.overlay_url ?? null
    }), { status: 200, headers: { "content-type": "application/json" } });

  } catch (err) {
    console.error("infer route general error:", err);
    return new Response(JSON.stringify({ error: "Server crashed", detail: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
