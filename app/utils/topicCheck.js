// Only spinal-health topics allowed

const allowedKeywords = [
  "spine",
  "spinal",
  "back pain",
  "posture",
  "ergonomics",
  "scoliosis",
  "cervical",
  "lumbar",
  "thoracic",
  "disc",
  "cobb",
  "x-ray",
  "physiotherapy",
  "exercise",
  "stretch",
  "brace",
  "vertebra",
  "spinal cord",
  "kyphosis",
  "lordosis",
  "alignment",
  "slipped disc",
];

export function isSpineRelated(text) {
  const lower = text.toLowerCase();

  return allowedKeywords.some((k) => lower.includes(k));
}
