
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal Information</h3>
              <p className="text-slate-600 mb-6">
                We collect information you provide directly to us, such as when you create an account, 
                join our waitlist, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Name and contact information</li>
                <li>Healthcare preferences and needs</li>
                <li>Location information for service delivery across the USA</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mb-4">Health Information</h3>
              <p className="text-slate-600 mb-6">
                As a healthcare service provider in the United States, we may collect protected health information (PHI) 
                in accordance with HIPAA regulations. This includes:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Medical history and conditions</li>
                <li>Treatment records and care plans</li>
                <li>Healthcare provider communications</li>
                <li>Insurance and billing information</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">How We Use Your Information</h2>
              <p className="text-slate-600 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Provide healthcare services and support</li>
                <li>Match you with appropriate healthcare providers</li>
                <li>Communicate about your care and our services</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal and regulatory requirements in the USA</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Information Sharing</h2>
              <p className="text-slate-600 mb-6">
                We do not sell, rent, or share your personal information with third parties except:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>With healthcare providers involved in your care</li>
                <li>As required by law or to protect rights and safety</li>
                <li>With your explicit consent</li>
                <li>With service providers who help us operate our platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Data Security</h2>
              <p className="text-slate-600 mb-6">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Your Rights</h2>
              <p className="text-slate-600 mb-6">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of certain communications</li>
                <li>Request a copy of your data</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>Email:</strong> info@carebow.com<br/>
                  <strong>Address:</strong> CareBow Privacy Team<br/>
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

export default PrivacyPolicy;
