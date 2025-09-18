
'use client'

import Navbar from "../components/UnifiedNavigation";

export const dynamic = 'force-dynamic';
import Footer from "../components/UnifiedFooter";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const HipaaCompliance = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              HIPAA Compliance
            </h1>
            <p className="text-xl text-slate-600">
              Your health information is protected with the highest standards of security and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Data</h3>
              <p className="text-slate-600">End-to-end encryption for all health information</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Controls</h3>
              <p className="text-slate-600">Strict access controls and audit trails</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance</h3>
              <p className="text-slate-600">Full HIPAA compliance certification</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Our HIPAA Commitment</h2>
              <p className="text-slate-600 mb-6">
                CareBow is committed to protecting your Protected Health Information (PHI) in compliance 
                with the Health Insurance Portability and Accountability Act (HIPAA). We implement 
                comprehensive safeguards to ensure your health information remains secure and private.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Administrative Safeguards</h2>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>HIPAA Compliance Officer:</strong> Designated officer responsible for HIPAA compliance</li>
                <li><strong>Staff Training:</strong> Regular HIPAA training for all personnel</li>
                <li><strong>Access Management:</strong> Role-based access controls for PHI</li>
                <li><strong>Business Associate Agreements:</strong> Contracts with all third-party vendors</li>
                <li><strong>Incident Response:</strong> Comprehensive breach response procedures</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Physical Safeguards</h2>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>Secure Facilities:</strong> Controlled access to facilities containing PHI</li>
                <li><strong>Workstation Security:</strong> Secure workstation configurations</li>
                <li><strong>Device Controls:</strong> Proper disposal and reuse of electronic media</li>
                <li><strong>Environmental Controls:</strong> Protection against environmental hazards</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Technical Safeguards</h2>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>Encryption:</strong> AES-256 encryption for data at rest and in transit</li>
                <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access</li>
                <li><strong>Audit Logs:</strong> Comprehensive logging of all PHI access</li>
                <li><strong>Transmission Security:</strong> Secure protocols for data transmission</li>
                <li><strong>System Security:</strong> Regular security assessments and updates</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Your HIPAA Rights</h2>
              <p className="text-slate-600 mb-4">Under HIPAA, you have the right to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>Access:</strong> Review and obtain copies of your health records</li>
                <li><strong>Amendment:</strong> Request corrections to your health information</li>
                <li><strong>Disclosure Accounting:</strong> Receive a list of disclosures of your PHI</li>
                <li><strong>Restrictions:</strong> Request restrictions on use and disclosure of your PHI</li>
                <li><strong>Confidential Communications:</strong> Request communications in a specific manner</li>
                <li><strong>Complaints:</strong> File complaints about privacy practices</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Data Minimization</h2>
              <p className="text-slate-600 mb-6">
                We follow the principle of minimum necessary, using and disclosing only the minimum 
                amount of PHI required for the intended purpose. Our systems are designed to limit 
                access to PHI based on job responsibilities and need-to-know basis.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Breach Notification</h2>
              <p className="text-slate-600 mb-6">
                In the unlikely event of a breach of unsecured PHI, we will notify affected individuals 
                within 60 days of discovery, as required by HIPAA. We maintain comprehensive incident 
                response procedures to minimize the impact of any security incidents.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Third-Party Vendors</h2>
              <p className="text-slate-600 mb-6">
                All third-party vendors who may have access to PHI are required to sign Business 
                Associate Agreements (BAAs) and maintain HIPAA compliance. We regularly audit our 
                vendors to ensure ongoing compliance.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Contact Our Privacy Officer</h2>
              <p className="text-slate-600 mb-4">
                For HIPAA-related questions or to exercise your rights, contact our Privacy Officer:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>HIPAA Privacy Officer</strong><br/>
                  <strong>Email:</strong> privacy@carebow.com<br/>
                  <strong>Phone:</strong> +91 (HIPAA hotline)<br/>
                  <strong>Address:</strong> CareBow Privacy Office<br/>
                  <strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM IST
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Filing a Complaint</h3>
                <p className="text-blue-800">
                  You may also file a complaint with the U.S. Department of Health and Human Services 
                  Office for Civil Rights if you believe your privacy rights have been violated.
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

export default HipaaCompliance;
