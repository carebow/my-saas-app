import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Brain,
  Shield,
  ArrowRight,
  Phone,
  Stethoscope,
  Leaf,
  Zap
} from 'lucide-react';

interface SymptomData {
  name: string;
  description: string;
  commonCauses: string[];
  whenToSeekHelp: string[];
  selfCareTips: string[];
  ayurvedicRemedies: string[];
  urgencyLevel: 'low' | 'moderate' | 'high';
  relatedSymptoms: string[];
  keywords: string[];
  metaDescription: string;
}

const symptomDatabase: Record<string, SymptomData> = {
  headache: {
    name: "Headache",
    description: "Headaches are one of the most common health complaints, affecting millions of people worldwide. They can range from mild discomfort to severe pain and can be caused by various factors including stress, dehydration, tension, or underlying medical conditions.",
    commonCauses: [
      "Tension and stress",
      "Dehydration",
      "Lack of sleep",
      "Eye strain",
      "Caffeine withdrawal",
      "Sinus pressure",
      "Hormonal changes",
      "Weather changes"
    ],
    whenToSeekHelp: [
      "Sudden, severe headache (thunderclap headache)",
      "Headache with fever, stiff neck, or rash",
      "Headache after head injury",
      "Headache with vision changes or difficulty speaking",
      "Headache that worsens over time",
      "Headache with weakness or numbness"
    ],
    selfCareTips: [
      "Stay hydrated by drinking plenty of water",
      "Apply cold or warm compress to head and neck",
      "Practice relaxation techniques like deep breathing",
      "Ensure adequate sleep (7-9 hours)",
      "Limit screen time and take regular breaks",
      "Maintain regular meal times",
      "Practice gentle neck and shoulder stretches"
    ],
    ayurvedicRemedies: [
      "Apply sandalwood paste on forehead",
      "Drink ginger tea with honey",
      "Use peppermint oil for aromatherapy",
      "Practice pranayama (breathing exercises)",
      "Apply cold milk compress",
      "Consume cooling foods like cucumber and watermelon",
      "Massage temples with coconut oil"
    ],
    urgencyLevel: "moderate",
    relatedSymptoms: ["neck pain", "eye strain", "fatigue", "nausea", "sensitivity to light"],
    keywords: ["headache relief", "head pain", "migraine", "tension headache", "headache treatment"],
    metaDescription: "Get expert guidance on headache relief with CareBow's AI symptom checker. Learn about causes, treatments, and when to seek medical help for headaches."
  },
  cough: {
    name: "Cough",
    description: "A cough is a reflex action that helps clear your airways of mucus and irritants. While most coughs are temporary and resolve on their own, persistent or severe coughs may indicate an underlying condition that requires attention.",
    commonCauses: [
      "Common cold or flu",
      "Allergies",
      "Post-nasal drip",
      "Acid reflux",
      "Smoking or environmental irritants",
      "Asthma",
      "Bronchitis",
      "Pneumonia"
    ],
    whenToSeekHelp: [
      "Cough lasting more than 3 weeks",
      "Cough with blood or pink-tinged mucus",
      "Cough with difficulty breathing",
      "Cough with chest pain",
      "Cough with fever over 101°F",
      "Cough in children under 3 months",
      "Cough with unexplained weight loss"
    ],
    selfCareTips: [
      "Stay hydrated with warm liquids",
      "Use a humidifier to moisten air",
      "Gargle with warm salt water",
      "Avoid irritants like smoke and dust",
      "Elevate head while sleeping",
      "Use cough drops or lozenges",
      "Practice steam inhalation"
    ],
    ayurvedicRemedies: [
      "Drink turmeric milk with honey",
      "Consume ginger and honey tea",
      "Use tulsi (holy basil) leaves",
      "Practice steam inhalation with eucalyptus",
      "Apply warm mustard oil on chest",
      "Consume licorice root tea",
      "Use clove and cinnamon for throat relief"
    ],
    urgencyLevel: "moderate",
    relatedSymptoms: ["sore throat", "chest congestion", "runny nose", "fever", "fatigue"],
    keywords: ["cough relief", "persistent cough", "dry cough", "wet cough", "cough treatment"],
    metaDescription: "Find effective cough relief with CareBow's AI-powered symptom analysis. Learn about different types of coughs, treatments, and when to see a doctor."
  },
  fever: {
    name: "Fever",
    description: "Fever is a temporary increase in body temperature, usually due to an illness. It's often a sign that your body is fighting an infection. While most fevers are not serious, high fevers or fevers in certain age groups require medical attention.",
    commonCauses: [
      "Viral infections (cold, flu)",
      "Bacterial infections",
      "Immunizations",
      "Heat exhaustion",
      "Autoimmune disorders",
      "Certain medications",
      "Inflammatory conditions",
      "Cancer (rare)"
    ],
    whenToSeekHelp: [
      "Fever over 103°F in adults",
      "Fever over 100.4°F in infants under 3 months",
      "Fever lasting more than 3 days",
      "Fever with severe headache or neck stiffness",
      "Fever with difficulty breathing",
      "Fever with rash",
      "Fever with confusion or irritability"
    ],
    selfCareTips: [
      "Rest and get plenty of sleep",
      "Stay hydrated with water and clear fluids",
      "Dress in lightweight clothing",
      "Use a cool compress on forehead",
      "Take lukewarm baths",
      "Avoid alcohol and caffeine",
      "Eat light, easy-to-digest foods"
    ],
    ayurvedicRemedies: [
      "Drink coriander seed water",
      "Apply sandalwood paste on forehead",
      "Consume ginger and honey tea",
      "Use neem leaves for cooling effect",
      "Drink coconut water",
      "Apply cold milk compress",
      "Practice sheetali pranayama (cooling breath)"
    ],
    urgencyLevel: "high",
    relatedSymptoms: ["chills", "sweating", "headache", "body aches", "fatigue", "loss of appetite"],
    keywords: ["fever treatment", "high fever", "fever in adults", "fever symptoms", "fever relief"],
    metaDescription: "Get expert guidance on fever management with CareBow's AI symptom checker. Learn about fever causes, treatments, and when to seek emergency care."
  },
  "chest-pain": {
    name: "Chest Pain",
    description: "Chest pain can range from mild discomfort to severe pain and can have many causes. While some causes are not serious, chest pain can also be a sign of a life-threatening condition, so it's important to take it seriously.",
    commonCauses: [
      "Heartburn or acid reflux",
      "Muscle strain or injury",
      "Anxiety or panic attacks",
      "Costochondritis (chest wall inflammation)",
      "Pleurisy (lung lining inflammation)",
      "Heart attack",
      "Angina",
      "Pulmonary embolism"
    ],
    whenToSeekHelp: [
      "Sudden, severe chest pain",
      "Chest pain with shortness of breath",
      "Chest pain radiating to arm, jaw, or back",
      "Chest pain with nausea or sweating",
      "Chest pain with dizziness or fainting",
      "Chest pain in someone with heart disease",
      "Chest pain that worsens with activity"
    ],
    selfCareTips: [
      "Rest and avoid strenuous activity",
      "Apply heat or ice packs",
      "Practice deep breathing exercises",
      "Maintain good posture",
      "Avoid heavy meals before bed",
      "Manage stress through relaxation",
      "Stay hydrated"
    ],
    ayurvedicRemedies: [
      "Drink ginger tea for circulation",
      "Practice pranayama (breathing exercises)",
      "Apply warm sesame oil massage",
      "Consume garlic for heart health",
      "Use arjuna bark for cardiovascular support",
      "Practice meditation for stress relief",
      "Consume hawthorn berry tea"
    ],
    urgencyLevel: "high",
    relatedSymptoms: ["shortness of breath", "nausea", "sweating", "dizziness", "arm pain", "jaw pain"],
    keywords: ["chest pain relief", "heart attack symptoms", "chest pain causes", "chest pain treatment", "cardiac chest pain"],
    metaDescription: "Get immediate guidance on chest pain with CareBow's AI symptom checker. Learn about chest pain causes, emergency signs, and when to call 911."
  },
  dizziness: {
    name: "Dizziness",
    description: "Dizziness is a term used to describe a range of sensations, including feeling faint, woozy, weak, or unsteady. It can be caused by various factors and may indicate an underlying health condition that requires attention.",
    commonCauses: [
      "Inner ear problems (vertigo)",
      "Low blood pressure",
      "Dehydration",
      "Anxiety or stress",
      "Medication side effects",
      "Anemia",
      "Heart problems",
      "Neurological conditions"
    ],
    whenToSeekHelp: [
      "Sudden, severe dizziness",
      "Dizziness with chest pain or shortness of breath",
      "Dizziness with severe headache",
      "Dizziness with vision changes",
      "Dizziness with difficulty speaking",
      "Dizziness with weakness or numbness",
      "Dizziness after head injury"
    ],
    selfCareTips: [
      "Sit or lie down when dizzy",
      "Stay hydrated",
      "Avoid sudden movements",
      "Get up slowly from sitting or lying",
      "Avoid driving or operating machinery",
      "Practice balance exercises",
      "Manage stress and anxiety"
    ],
    ayurvedicRemedies: [
      "Drink ginger tea for circulation",
      "Practice grounding exercises",
      "Use brahmi (gotu kola) for nervous system",
      "Consume ashwagandha for stress",
      "Practice pranayama (breathing exercises)",
      "Apply warm sesame oil to feet",
      "Consume triphala for overall health"
    ],
    urgencyLevel: "moderate",
    relatedSymptoms: ["vertigo", "nausea", "sweating", "weakness", "headache", "vision changes"],
    keywords: ["dizziness relief", "vertigo treatment", "dizzy spells", "balance problems", "dizziness causes"],
    metaDescription: "Find relief from dizziness with CareBow's AI symptom analysis. Learn about dizziness causes, treatments, and when to seek medical help."
  }
};

export const SymptomPage: React.FC = () => {
  const { symptom } = useParams<{ symptom: string }>();
  const symptomData = symptom ? symptomDatabase[symptom] : null;

  if (!symptomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Symptom Not Found</h1>
          <p className="text-gray-600">The symptom you're looking for doesn't exist in our database.</p>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">{symptomData.name} - Expert Guidance</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {symptomData.description}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className={getUrgencyColor(symptomData.urgencyLevel)}>
              {getUrgencyIcon(symptomData.urgencyLevel)}
              <span className="ml-1 capitalize">{symptomData.urgencyLevel} Priority</span>
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Brain className="h-4 w-4 mr-1" />
              AI-Powered Analysis
            </Badge>
          </div>
        </motion.div>

        {/* Emergency Notice */}
        {symptomData.urgencyLevel === 'high' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-red-300 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Medical Emergency
                    </h3>
                    <p className="text-red-700">
                      If you are experiencing severe {symptomData.name.toLowerCase()}, call 911 or go to your nearest emergency room immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-6">
            {/* Common Causes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Common Causes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {symptomData.commonCauses.map((cause, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{cause}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* When to Seek Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>When to Seek Medical Help</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {symptomData.whenToSeekHelp.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Self-Care Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Self-Care Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {symptomData.selfCareTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ayurvedic Remedies */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span>Ayurvedic Remedies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {symptomData.ayurvedicRemedies.map((remedy, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-green-700">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Related Symptoms</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {symptomData.relatedSymptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold text-blue-800">
                  Get Personalized Analysis
                </h3>
                <p className="text-blue-700">
                  Use our AI-powered symptom checker for a comprehensive health assessment
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Try AI Symptom Checker
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Talk to Doctor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Medical Disclaimer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    This information is for educational purposes only and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
                    with any questions you may have regarding a medical condition. If you think you may have a medical 
                    emergency, call 911 immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
