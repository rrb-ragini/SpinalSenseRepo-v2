import { analyzeImageWithVision } from "../../../lib/vision.js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: `Unsupported file type ${file.type}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await analyzeImageWithVision(buffer, file.type);

    if (!result?.can_measure) {
      return Response.json(
        {
          error: "Could not interpret this X-ray.",
          explanation: result?.explanation ?? "Low quality image"
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        cobb_angle: result.cobb_angle,
        explanation: result.explanation,
        severity: result.severity,
        overlay_url: result.overlay_url
      },
      { status: 200 }
    );

  } catch (err) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
