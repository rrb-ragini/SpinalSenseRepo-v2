// app/terms/page.jsx

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 prose">
      <h1>Terms & Conditions — SpinalSense</h1>

      <p>Last Updated: {new Date().toLocaleDateString()}</p>

      <h2>1. About SpinalSense</h2>
      <p>SpinalSense is an AI educational assistant that explains spine-related concepts and X-ray interpretations. It is not a medical professional.</p>

      <h2>2. No Medical Advice</h2>
      <p>SpinalSense does not diagnose or prescribe. Always consult a licensed clinician for medical concerns.</p>

      <h2>3. Copyright</h2>
      <p>
        All generated content is © SpinalSense Team unless the user uploads their own material.
      </p>

      <h2>4. Privacy</h2>
      <p>
        If you upload medical images, you confirm you have rights and consent to processing. Remove personal identifiers before uploading.
      </p>

      <h2>5. Safety Guardrails</h2>
      <p>
        The assistant refuses harmful, illegal, explicit, or medically unsafe requests.
      </p>

      <h2>6. Contact</h2>
      <p>Email: legal@spinalsense.example</p>
    </div>
  );
}
