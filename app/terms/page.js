export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: November 28, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-blue max-w-none">

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to SpinalSense ("we," "our," or "us"). By accessing or using our AI-powered spinal analysis platform,
              you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </p>
          </section>

          {/* Medical Disclaimer */}
          <section className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">2. Medical Disclaimer</h2>
            <p className="text-amber-800 leading-relaxed mb-3">
              <strong>IMPORTANT:</strong> SpinalSense is an educational tool and is NOT a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-2 ml-4">
              <li>Our AI analysis is for informational and educational purposes only</li>
              <li>Always seek the advice of your physician or qualified healthcare provider</li>
              <li>Never disregard professional medical advice or delay seeking it because of information from SpinalSense</li>
              <li>In case of a medical emergency, call your doctor or emergency services immediately</li>
            </ul>
          </section>

          {/* Use of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Use of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By using SpinalSense, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete information when using our services</li>
              <li>Use the service only for lawful purposes and in accordance with these Terms</li>
              <li>Not use the service to upload malicious content or attempt to harm our systems</li>
              <li>Understand that AI analysis may contain errors or inaccuracies</li>
              <li>Consult with a licensed healthcare professional before making any medical decisions</li>
            </ul>
          </section>

          {/* Privacy & Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Privacy & Data Protection</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We take your privacy seriously:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>X-ray images are processed temporarily and not permanently stored on our servers</li>
              <li>Chat conversations are stored in-memory only and cleared when you close the session</li>
              <li>We do not sell or share your personal health information with third parties</li>
              <li>All data transmission is encrypted using industry-standard protocols</li>
            </ul>
          </section>

          {/* Accuracy & Limitations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Accuracy & Limitations</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              While we strive for accuracy, please understand:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>AI analysis is based on machine learning models that may have limitations</li>
              <li>Results may vary based on image quality and positioning</li>
              <li>Our system is designed to assist, not replace, professional medical evaluation</li>
              <li>We make no guarantees about the accuracy or completeness of analysis results</li>
            </ul>
          </section>

          {/* Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>SpinalSense and its creators are not liable for any medical decisions made based on our analysis</li>
              <li>We are not responsible for any damages arising from the use or inability to use our service</li>
              <li>You use this service at your own risk</li>
              <li>We do not warrant that the service will be uninterrupted or error-free</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content, features, and functionality of SpinalSense, including but not limited to text, graphics, logos,
              and software, are owned by SpinalSense Team and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by
              updating the "Last updated" date at the top of this page. Your continued use of the service after such
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> support@spinalsense.com<br />
                <strong>Website:</strong> www.spinalsense.com
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By using SpinalSense, you acknowledge that you have read, understood, and agree
              to be bound by these Terms & Conditions.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
