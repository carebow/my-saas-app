
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600">
              Please read these terms carefully before using our services.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Acceptance of Terms</h2>
              <p className="text-slate-600 mb-6">
                By accessing and using CareBow's services, you accept and agree to be bound by 
                these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Description of Service</h2>
              <p className="text-slate-600 mb-6">
                CareBow is a technology-enabled healthcare platform that connects users with 
                healthcare providers for in-home care services across the United States. Our services include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Healthcare provider matching and scheduling</li>
                <li>Telemedicine and virtual consultations</li>
                <li>In-home healthcare services</li>
                <li>Health monitoring and care coordination</li>
                <li>AI-powered health insights and recommendations</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">User Responsibilities</h2>
              <p className="text-slate-600 mb-4">As a user of our services, you agree to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Keep your account information secure</li>
                <li>Use our services only for lawful purposes</li>
                <li>Respect the privacy and rights of others</li>
                <li>Follow healthcare provider instructions and recommendations</li>
                <li>Pay for services as agreed</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Healthcare Services Disclaimer</h2>
              <p className="text-slate-600 mb-6">
                CareBow is a platform that facilitates connections between users and healthcare providers. 
                We do not provide medical advice, diagnosis, or treatment. All healthcare services are 
                provided by licensed healthcare professionals who are independent contractors.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Emergency Situations</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">
                  IMPORTANT: Our services are not intended for emergency situations. 
                  In case of a medical emergency, call 911 immediately.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Payment and Billing</h2>
              <p className="text-slate-600 mb-6">
                Payment terms for services will be clearly communicated before any services are rendered. 
                You agree to pay all charges incurred for services used through our platform.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Privacy and Data Protection</h2>
              <p className="text-slate-600 mb-6">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information, including protected health information (PHI).
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Limitation of Liability</h2>
              <p className="text-slate-600 mb-6">
                CareBow's liability is limited to the maximum extent permitted by law. 
                We are not liable for any indirect, incidental, or consequential damages 
                arising from your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Termination</h2>
              <p className="text-slate-600 mb-6">
                Either party may terminate these terms at any time. Upon termination, 
                your right to use our services will cease immediately.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Changes to Terms</h2>
              <p className="text-slate-600 mb-6">
                We may update these terms from time to time. We will notify you of any 
                significant changes by email or through our platform.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Contact Information</h2>
              <p className="text-slate-600 mb-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>Email:</strong> info@carebow.com<br/>
                  <strong>Address:</strong> CareBow Legal Team<br/>
                  Pittsburgh, PA, USA<br/>
                  <strong>Phone:</strong> (412) 735-1957
                </p>
              </div>

              <p className="text-sm text-slate-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
