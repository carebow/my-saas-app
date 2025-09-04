import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, CheckCircle, Star, Stethoscope, UserCheck, Heart, Activity } from "lucide-react";
import medicalBoardImage from "@/assets/medical-advisory-board.jpg";

const TrustSignalsSection = () => {
  const credentials = [
    {
      icon: Shield,
      title: "HIPAA Compliance in Development",
      description: "Enterprise-grade security framework being implemented for your family's health data"
    },
    {
      icon: Award,
      title: "Recruiting Licensed Professionals",
      description: "Building network of background-checked, licensed, and insured caregivers"
    },
    {
      icon: Stethoscope,
      title: "24/7 Medical Support",
      description: "Licensed medical team being assembled for round-the-clock support"
    },
    {
      icon: UserCheck,
      title: "Family Care Coordination",
      description: "Dedicated care coordinators for every family"
    }
  ];

  const stats = [
    { number: "3,000+", label: "Families on Waitlist", subtext: "Growing daily" },
    { number: "92%", label: "Want In-Home Care", subtext: "Market research" },
    { number: "Coming Soon", label: "Licensed Caregivers", subtext: "Recruitment active" },
    { number: "24/7", label: "Support Planning", subtext: "In development" }
  ];

  const recruitmentAreas = [
    { role: "Chief Medical Officer", specialty: "Geriatric Medicine", status: "Actively recruiting" },
    { role: "Medical Advisor", specialty: "Emergency Medicine", status: "Interviews in progress" },
    { role: "Clinical Director", specialty: "Family Medicine", status: "Position open" },
    { role: "Director of Nursing", specialty: "Home Healthcare", status: "Accepting applications" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-carebow-neutral/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
              Trusted by Families{" "}
              <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
                Nationwide
              </span>
            </h2>
            <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
              Healthcare-grade security and medical expertise you can count on
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {credentials.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-xl border border-carebow-blue/20 text-center hover:shadow-2xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <credential.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carebow-text-dark mb-2">
                  {credential.title}
                </h3>
                <p className="text-sm text-carebow-text-medium">
                  {credential.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-2xl p-8 text-white">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm opacity-90">
                    {stat.subtext}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Medical Advisory Board */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-3xl font-bold text-carebow-text-dark">
                Building Our Medical Advisory Board
              </h3>
              <span className="px-3 py-1 bg-carebow-secondary/20 text-carebow-secondary text-sm font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-lg text-carebow-text-medium mb-8 leading-relaxed">
              We're actively recruiting board-certified physicians, registered nurses, and healthcare 
              administrators to join our advisory team and ensure the highest standards of care for your family.
            </p>
            
            <div className="space-y-4">
              {recruitmentAreas.map((area, index) => (
                <motion.div
                  key={area.role}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-carebow-blue/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-carebow-primary/20 to-carebow-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-carebow-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-carebow-text-dark">{area.role}</div>
                    <div className="text-sm text-carebow-primary font-medium">{area.specialty}</div>
                    <div className="text-sm text-carebow-text-light">{area.status}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-carebow-mint/20 rounded-xl border border-carebow-mint/40">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-carebow-secondary" />
                <span className="font-bold text-carebow-text-dark">Future Medical Oversight</span>
              </div>
              <p className="text-sm text-carebow-text-medium">
                Once assembled, our medical advisory board will review and approve all care plans to ensure safety and effectiveness.
              </p>
            </div>
          </div>

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

        {/* Insurance & Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-carebow-blue/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-carebow-text-dark mb-4">
                Insurance & Partnership Information
              </h3>
              <p className="text-carebow-text-medium">
                Working with major insurers and healthcare systems to make care accessible
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <Clock className="w-8 h-8 text-carebow-primary mx-auto mb-2" />
                <div className="font-medium text-carebow-text-dark">Medicare Advantage</div>
                <div className="text-sm text-carebow-text-light">Partnerships in discussion</div>
              </div>
              <div className="p-4">
                <Clock className="w-8 h-8 text-carebow-primary mx-auto mb-2" />
                <div className="font-medium text-carebow-text-dark">Private Insurance</div>
                <div className="text-sm text-carebow-text-light">Reimbursement being explored</div>
              </div>
              <div className="p-4">
                <Clock className="w-8 h-8 text-carebow-primary mx-auto mb-2" />
                <div className="font-medium text-carebow-text-dark">HSA/FSA Eligible</div>
                <div className="text-sm text-carebow-text-light">Planning implementation</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;