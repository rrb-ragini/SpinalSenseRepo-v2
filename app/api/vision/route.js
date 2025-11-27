// lib/vision.js
import OpenAI from 'openai';
import sharp from 'sharp'; // add to package.json if you use this file

const clientFactory = () => {
  // instantiate at runtime
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY missing');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// Helper: basic preprocessing using sharp
async function preprocessImage(buffer, mimeType, opts = {}) {
  // opts: { maxSize: 1024, enhance: true }
  const maxSize = opts.maxSize || 1024;

  let img = sharp(buffer);

  // auto-rotate based on EXIF
  img = img.rotate();

  // convert to greyscale, remove alpha, increase contrast & sharpen
  img = img
    .resize({ width: maxSize, height: maxSize, fit: 'inside' })
    .greyscale()
    .linear(1.1, -10) // small contrast tweak
    .sharpen();

  // remove borders (common in WhatsApp screenshots) by trimming near-white edges
  // sharp doesn't have trim by color in older versions — simple approach: extend then crop center
  const out = await img.png().toBuffer();
  return out;
}

// The main analyze function
export async function analyzeImageWithVision(buffer, mimeType = 'image/png', opts = {}) {
  const client = clientFactory();

  // Preprocess (try-catch to avoid failing if sharp isn't installed)
  let processed;
  try {
    processed = await preprocessImage(buffer, mimeType, opts);
  } catch (e) {
    // fallback to original buffer
    console.warn('preprocess failed, using original buffer', e);
    processed = buffer;
  }

  // Create data URL
  const b64 = Buffer.from(processed).toString('base64');
  const dataUrl = `data:${mimeType};base64,${b64}`;

  // Tolerant prompt — instruction to always return JSON and be tolerant with low-quality images
  const prompt = `You are a spine radiology assistant. You WILL return STRICT JSON ONLY (no explanation text).
Analyze the provided X-ray image (an AP/PA spine view). If you can compute Cobb angle, set "can_measure": true and return numeric "cobb_angle" (degrees).
If you cannot measure due to quality/occlusion/orientation, set "can_measure": false and include a short "explanation" describing the issue.
Allowed keys:
{
  "cobb_angle": <number or null>,
  "severity": "<none|mild|moderate|severe|null>",
  "explanation": "<short text>",
  "can_measure": true|false
}

Be tolerant: if the spine is visible but compressed or partially occluded, try to estimate the angle and set "can_measure": true but set "explanation" to note uncertainty. Accuracy is prioritized but prefer returning a best-effort measurement rather than refusing unless image is unreadable.
`;

  // Call OpenAI Vision via Chat Completions with image input
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: prompt },
          { type: 'input_image', image_url: dataUrl }
        ]
      }
    ],
    max_tokens: 400
  });

  const raw = response?.choices?.[0]?.message?.content;
  if (!raw) throw new Error('Empty model output');

  // Attempt to parse first JSON-looking substring (robust parsing)
  let json;
  try {
    // try plain parse
    json = JSON.parse(raw);
  } catch (e) {
    // try to extract JSON block with regex
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        json = JSON.parse(m[0]);
      } catch (e2) {
        throw new Error('Could not parse model JSON: ' + e2.message + ' raw: ' + raw.slice(0, 500));
      }
    } else {
      throw new Error('Model output not JSON: ' + raw.slice(0, 500));
    }
  }

  // ensure keys
  json.can_measure = !!json.can_measure;
  if (json.cobb_angle !== undefined && json.cobb_angle !== null) {
    json.cobb_angle = Number(json.cobb_angle);
  }

  // Attach overlay preview (the processed image) for quick frontend display
  json.overlay_url = dataUrl;

  return json;
}
