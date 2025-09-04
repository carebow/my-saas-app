import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Medical triage protocols and emergency keywords
const EMERGENCY_KEYWORDS = [
  'chest pain', 'difficulty breathing', 'can\'t breathe', 'shortness of breath',
  'severe pain', 'unconscious', 'stroke', 'heart attack', 'severe bleeding',
  'overdose', 'suicide', 'severe allergic reaction', 'anaphylaxis'
];

const URGENT_KEYWORDS = [
  'severe headache', 'high fever', 'persistent vomiting', 'severe abdominal pain',
  'difficulty swallowing', 'severe dizziness', 'fainting', 'severe injury'
];

// Ayurvedic remedies database
const AYURVEDIC_REMEDIES = {
  'headache': [
    'Apply peppermint oil to temples',
    'Drink ginger tea with honey',
    'Practice pranayama breathing',
    'Use cold compress on forehead'
  ],
  'nausea': [
    'Sip ginger tea slowly',
    'Chew on fresh mint leaves',
    'Try fennel seed water',
    'Practice deep breathing'
  ],
  'stress': [
    'Practice meditation for 10 minutes',
    'Drink chamomile tea',
    'Try ashwagandha supplement',
    'Practice yoga stretches'
  ],
  'indigestion': [
    'Drink warm water with lemon',
    'Chew fennel seeds after meals',
    'Try cumin and coriander tea',
    'Avoid heavy, oily foods'
  ]
};

// Medical knowledge base for common conditions
const MEDICAL_CONDITIONS = {
  'tension_headache': {
    symptoms: ['headache', 'stress', 'tight feeling'],
    probability: 70,
    description: 'Common type of headache often caused by stress or muscle tension',
    recommendations: ['Rest in quiet room', 'Apply cold/warm compress', 'Stay hydrated']
  },
  'common_cold': {
    symptoms: ['runny nose', 'cough', 'sore throat', 'fatigue'],
    probability: 80,
    description: 'Viral infection of upper respiratory tract',
    recommendations: ['Rest', 'Increase fluid intake', 'Use humidifier']
  },
  'indigestion': {
    symptoms: ['stomach pain', 'nausea', 'bloating', 'heartburn'],
    probability: 75,
    description: 'Difficulty digesting food, often related to diet or stress',
    recommendations: ['Eat smaller meals', 'Avoid spicy foods', 'Stay upright after eating']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, systemPrompt, conversationHistory, userProfile, personality } = await req.json()

    // Analyze message for urgency
    const urgencyLevel = analyzeUrgency(message, conversationHistory)
    
    // Generate AI response based on medical protocols
    const response = await generateMedicalResponse({
      message,
      systemPrompt,
      conversationHistory,
      userProfile,
      personality,
      urgencyLevel
    })

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in enhanced-health-chat:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        response: JSON.stringify({
          response: "I apologize, but I'm having trouble processing your request right now. For urgent medical concerns, please contact your healthcare provider or call 911 if it's an emergency.",
          urgencyLevel: 'medium',
          stage: 'error',
          suggestedActions: ['Contact healthcare provider', 'Call 911 if emergency'],
          followUpQuestions: [],
          riskFactors: [],
          nextSteps: 'Seek professional medical advice'
        })
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function analyzeUrgency(message: string, conversationHistory: string): string {
  const lowerMessage = message.toLowerCase()
  const lowerHistory = conversationHistory.toLowerCase()
  
  // Check for emergency keywords
  if (EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword) || lowerHistory.includes(keyword))) {
    return 'emergency'
  }
  
  // Check for urgent keywords
  if (URGENT_KEYWORDS.some(keyword => lowerMessage.includes(keyword) || lowerHistory.includes(keyword))) {
    return 'high'
  }
  
  // Check for severity indicators
  if (lowerMessage.includes('severe') || lowerMessage.includes('unbearable') || 
      lowerMessage.includes('10/10') || lowerMessage.includes('worst pain')) {
    return 'high'
  }
  
  if (lowerMessage.includes('moderate') || lowerMessage.includes('getting worse') ||
      lowerMessage.includes('7/10') || lowerMessage.includes('8/10')) {
    return 'medium'
  }
  
  return 'low'
}

async function generateMedicalResponse(params: any): Promise<string> {
  const { message, userProfile, personality, urgencyLevel } = params
  
  // Handle emergency cases immediately
  if (urgencyLevel === 'emergency') {
    return JSON.stringify({
      response: "Based on what you've described, this could be a medical emergency. Please call 911 immediately or go to your nearest emergency room. Don't wait - your symptoms require immediate professional medical attention.",
      urgencyLevel: 'emergency',
      stage: 'recommendations',
      suggestedActions: [
        'Call 911 immediately',
        'Go to nearest emergency room',
        'Do not drive yourself',
        'Have someone stay with you'
      ],
      followUpQuestions: [],
      riskFactors: ['Emergency symptoms present'],
      nextSteps: 'Seek immediate emergency medical care'
    })
  }
  
  // Analyze symptoms and provide appropriate response
  const symptoms = extractSymptoms(message)
  const possibleConditions = matchConditions(symptoms)
  const ayurvedicRemedies = getAyurvedicRemedies(symptoms)
  
  // Generate conversational response based on personality
  let conversationalResponse = ""
  
  switch (personality) {
    case 'caring_nurse':
      conversationalResponse = generateNurseResponse(symptoms, urgencyLevel, possibleConditions)
      break
    case 'family_doctor':
      conversationalResponse = generateDoctorResponse(symptoms, urgencyLevel, possibleConditions)
      break
    case 'ayurvedic_practitioner':
      conversationalResponse = generateAyurvedicResponse(symptoms, urgencyLevel, ayurvedicRemedies)
      break
    default:
      conversationalResponse = generateNurseResponse(symptoms, urgencyLevel, possibleConditions)
  }
  
  // Determine conversation stage
  const stage = determineConversationStage(message, symptoms)
  
  // Generate follow-up questions
  const followUpQuestions = generateFollowUpQuestions(symptoms, stage)
  
  // Generate suggested actions
  const suggestedActions = generateSuggestedActions(urgencyLevel, symptoms)
  
  return JSON.stringify({
    response: conversationalResponse,
    urgencyLevel,
    stage,
    suggestedActions,
    followUpQuestions,
    riskFactors: identifyRiskFactors(symptoms, userProfile),
    nextSteps: getNextSteps(urgencyLevel, stage)
  })
}

function extractSymptoms(message: string): string[] {
  const symptoms: string[] = []
  const lowerMessage = message.toLowerCase()
  
  // Common symptom patterns
  const symptomPatterns = [
    'headache', 'pain', 'ache', 'hurt', 'sore', 'fever', 'nausea', 'vomit',
    'cough', 'tired', 'fatigue', 'dizzy', 'weak', 'stress', 'anxiety',
    'stomach', 'chest', 'back', 'joint', 'muscle', 'throat', 'nose'
  ]
  
  symptomPatterns.forEach(pattern => {
    if (lowerMessage.includes(pattern)) {
      symptoms.push(pattern)
    }
  })
  
  return symptoms
}

function matchConditions(symptoms: string[]): any[] {
  const matches: any[] = []
  
  Object.entries(MEDICAL_CONDITIONS).forEach(([condition, data]) => {
    const matchCount = symptoms.filter(symptom => 
      data.symptoms.some(conditionSymptom => 
        symptom.includes(conditionSymptom) || conditionSymptom.includes(symptom)
      )
    ).length
    
    if (matchCount > 0) {
      matches.push({
        condition: condition.replace('_', ' '),
        probability: Math.min(data.probability + (matchCount * 10), 95),
        description: data.description,
        recommendations: data.recommendations
      })
    }
  })
  
  return matches.sort((a, b) => b.probability - a.probability)
}

function getAyurvedicRemedies(symptoms: string[]): string[] {
  const remedies: string[] = []
  
  symptoms.forEach(symptom => {
    Object.entries(AYURVEDIC_REMEDIES).forEach(([condition, conditionRemedies]) => {
      if (symptom.includes(condition) || condition.includes(symptom)) {
        remedies.push(...conditionRemedies)
      }
    })
  })
  
  return [...new Set(remedies)] // Remove duplicates
}

function generateNurseResponse(symptoms: string[], urgencyLevel: string, conditions: any[]): string {
  if (urgencyLevel === 'high') {
    return `I'm concerned about what you're experiencing. Based on your symptoms, I strongly recommend seeking medical care within the next 24 hours. While I can provide some guidance, these symptoms may need professional evaluation. Let me ask you a few more questions to better understand your situation.`
  }
  
  if (conditions.length > 0) {
    const topCondition = conditions[0]
    return `Thank you for sharing that with me. Based on what you've described, this sounds like it could be related to ${topCondition.condition}. ${topCondition.description} I'd like to ask you a few more questions to better understand your symptoms and provide you with the most helpful guidance.`
  }
  
  return `I hear you, and I want to help you feel better. Let me ask you some questions to better understand what you're experiencing so I can provide you with the most appropriate guidance and care recommendations.`
}

function generateDoctorResponse(symptoms: string[], urgencyLevel: string, conditions: any[]): string {
  if (urgencyLevel === 'high') {
    return `Based on your presentation, I recommend prompt medical evaluation. These symptoms warrant professional assessment within 24 hours. I'll help guide you through some questions to better characterize your condition.`
  }
  
  if (conditions.length > 0) {
    const topCondition = conditions[0]
    return `Your symptoms are consistent with ${topCondition.condition}. ${topCondition.description} Let me gather some additional clinical information to provide you with appropriate recommendations.`
  }
  
  return `I'd like to conduct a systematic review of your symptoms. This will help me provide you with evidence-based recommendations and determine the most appropriate level of care.`
}

function generateAyurvedicResponse(symptoms: string[], urgencyLevel: string, remedies: string[]): string {
  if (urgencyLevel === 'high') {
    return `While I can offer natural healing guidance, your symptoms suggest you should seek conventional medical care promptly. Once you've addressed any urgent medical needs, we can explore complementary Ayurvedic approaches to support your healing.`
  }
  
  if (remedies.length > 0) {
    return `From an Ayurvedic perspective, your symptoms suggest an imbalance that can be addressed naturally. I have several time-tested remedies that may help, including ${remedies[0]}. Let me understand your constitution and current state better to provide personalized guidance.`
  }
  
  return `In Ayurveda, we believe in treating the root cause, not just the symptoms. Let me understand your unique constitution and current imbalances to provide you with personalized natural healing recommendations.`
}

function determineConversationStage(message: string, symptoms: string[]): string {
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi') || symptoms.length === 0) {
    return 'greeting'
  }
  
  if (symptoms.length > 0 && symptoms.length < 3) {
    return 'symptom_gathering'
  }
  
  if (symptoms.length >= 3) {
    return 'triage'
  }
  
  return 'symptom_gathering'
}

function generateFollowUpQuestions(symptoms: string[], stage: string): string[] {
  if (stage === 'greeting') {
    return [
      'What symptoms are you experiencing?',
      'How are you feeling today?',
      'What brings you here?'
    ]
  }
  
  if (symptoms.includes('pain') || symptoms.includes('ache')) {
    return [
      'On a scale of 1-10, how severe is the pain?',
      'When did the pain start?',
      'What makes it better or worse?'
    ]
  }
  
  if (symptoms.includes('fever')) {
    return [
      'Have you taken your temperature?',
      'Are you experiencing chills?',
      'Any other symptoms like body aches?'
    ]
  }
  
  return [
    'When did these symptoms start?',
    'Have you tried anything for relief?',
    'Are there any other symptoms?'
  ]
}

function generateSuggestedActions(urgencyLevel: string, symptoms: string[]): string[] {
  if (urgencyLevel === 'emergency') {
    return ['Call 911 immediately', 'Go to emergency room', 'Do not drive yourself']
  }
  
  if (urgencyLevel === 'high') {
    return ['Seek medical care within 24 hours', 'Contact your doctor', 'Monitor symptoms closely']
  }
  
  if (urgencyLevel === 'medium') {
    return ['Consider teleconsult', 'Rest and monitor symptoms', 'Stay hydrated']
  }
  
  return ['Self-care measures', 'Monitor for changes', 'Rest and hydration']
}

function identifyRiskFactors(symptoms: string[], userProfile: any): string[] {
  const riskFactors: string[] = []
  
  if (userProfile?.age > 65) {
    riskFactors.push('Age over 65')
  }
  
  if (userProfile?.medicalHistory?.includes('diabetes')) {
    riskFactors.push('History of diabetes')
  }
  
  if (userProfile?.medicalHistory?.includes('heart disease')) {
    riskFactors.push('History of heart disease')
  }
  
  if (symptoms.includes('chest') && symptoms.includes('pain')) {
    riskFactors.push('Chest pain symptoms')
  }
  
  return riskFactors
}

function getNextSteps(urgencyLevel: string, stage: string): string {
  if (urgencyLevel === 'emergency') {
    return 'Seek immediate emergency medical care'
  }
  
  if (urgencyLevel === 'high') {
    return 'Schedule urgent medical evaluation'
  }
  
  if (stage === 'recommendations') {
    return 'Follow provided recommendations and monitor symptoms'
  }
  
  return 'Continue health assessment'
}