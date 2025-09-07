import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle } from "lucide-react";

const EarlyAccessForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "",
    contactMethod: "",
    hearAbout: "",
    message: "",
    agreeTerms: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-20 bg-carebow-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-12 shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-carebow-green mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-carebow-text-dark mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-lg text-carebow-text-medium mb-6">
              We've received your early access request and will contact you within 24 hours to discuss your family's care needs.
            </p>
            <p className="text-sm text-carebow-text-light">
              In the meantime, feel free to explore our website or contact us with any questions.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 bg-carebow-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Secure Your Family's{" "}
            <span className="text-carebow-primary-200">
              Early Access
            </span>
          </h2>
          <p className="text-xl text-carebow-primary-100 max-w-3xl mx-auto">
            Join thousands of families who trust CareBow to keep their parents safe and independent at home
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-carebow-text-dark font-semibold">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-carebow-text-dark font-semibold">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-carebow-text-dark font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-carebow-text-dark font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary"
                />
              </div>
            </div>

            {/* Relationship */}
            <div>
              <Label className="text-carebow-text-dark font-semibold">
                Relationship to Loved One *
              </Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => handleInputChange("relationship", value)}
                required
              >
                <SelectTrigger className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult-child">Adult Child</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="other-family">Other Family Member</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <Label className="text-carebow-text-dark font-semibold">
                Preferred Contact Method *
              </Label>
              <RadioGroup
                value={formData.contactMethod}
                onValueChange={(value) => handleInputChange("contactMethod", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-contact" />
                  <Label htmlFor="email-contact" className="text-carebow-text-medium">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone-contact" />
                  <Label htmlFor="phone-contact" className="text-carebow-text-medium">Phone</Label>
                </div>
              </RadioGroup>
            </div>

            {/* How did you hear about us */}
            <div>
              <Label className="text-carebow-text-dark font-semibold">
                How did you hear about us?
              </Label>
              <Select
                value={formData.hearAbout}
                onValueChange={(value) => handleInputChange("hearAbout", value)}
              >
                <SelectTrigger className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="referral">Friend/Family Referral</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="healthcare-provider">Healthcare Provider</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-carebow-text-dark font-semibold">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us about your family's specific care needs..."
                className="mt-2 border-carebow-primary-200 focus:border-carebow-primary focus:ring-carebow-primary min-h-[100px]"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                required
                className="mt-1"
              />
              <Label htmlFor="agreeTerms" className="text-carebow-text-medium text-sm leading-relaxed">
                I agree to the{" "}
                <a href="/terms-of-service" className="text-carebow-primary hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-carebow-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-carebow-primary hover:bg-carebow-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!formData.agreeTerms}
              >
                Submit Early Access Request
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default EarlyAccessForm;
