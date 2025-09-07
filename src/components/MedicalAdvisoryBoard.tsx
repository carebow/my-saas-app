import { motion } from "framer-motion";
import { Users, CheckCircle } from "lucide-react";
import medicalBoardImage from "@/assets/medical-advisory-board.jpg";

const MedicalAdvisoryBoard = () => {
  const teamMembers = [
    { name: "Dr. Jane Doe", title: "Geriatrician" },
    { name: "Dr. Michael Smith", title: "Internal Medicine" },
    { name: "Dr. Sarah Johnson", title: "Family Medicine" },
    { name: "Dr. Robert Brown", title: "Emergency Medicine" },
    { name: "Dr. Lisa Davis", title: "Cardiology" },
    { name: "Dr. James Wilson", title: "Neurology" }
  ];

  return (
    <section className="py-20 bg-carebow-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left side - Team list */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
              Building Our Medical Advisory Board
            </h2>
            <p className="text-xl text-carebow-text-medium mb-8 leading-relaxed">
              We're assembling a team of board-certified physicians and healthcare professionals 
              to ensure the highest standards of care for your family.
            </p>
            
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-carebow-primary-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-carebow-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-carebow-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-carebow-text-dark">{member.name}</div>
                    <div className="text-sm text-carebow-primary font-medium">{member.title}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-carebow-green ml-auto" />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-carebow-primary-50 rounded-xl border border-carebow-primary-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-carebow-primary" />
                <span className="font-bold text-carebow-text-dark">Medical Oversight</span>
              </div>
              <p className="text-carebow-text-medium">
                Our medical advisory board reviews and approves all care plans to ensure safety, 
                effectiveness, and alignment with best practices in geriatric care.
              </p>
            </div>
          </div>

          {/* Right side - Team photo */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={medicalBoardImage}
                alt="CareBow Medical Advisory Board - Healthcare professionals"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MedicalAdvisoryBoard;
