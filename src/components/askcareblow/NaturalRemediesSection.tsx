import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Brain, 
  Sparkles, 
  Clock, 
  ChefHat,
  Search,
  CheckCircle,
  XCircle,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NaturalRemediesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Remedies', icon: '🌿' },
    { id: 'digestive', name: 'Digestive', icon: '🌿' },
    { id: 'stress', name: 'Stress Relief', icon: '🧘' },
    { id: 'skincare', name: 'Skin Care', icon: '✨' },
    { id: 'pain', name: 'Pain Relief', icon: '💊' }
  ];

  const remedies = [
    {
      id: 1,
      title: "Ginger Tea",
      category: "digestive",
      difficulty: "Easy",
      icon: "🫖",
      description: "Perfect for nausea, indigestion, and cold symptoms",
      ingredients: [
        "1 inch fresh ginger root",
        "1 cup water", 
        "1 tsp honey",
        "Pinch of black pepper"
      ],
      instructions: [
        "Slice fresh ginger and boil in water for 5 minutes",
        "Strain the liquid",
        "Add honey and black pepper", 
        "Drink while warm"
      ],
      dosage: "1 cup, 2-3 times daily",
      timing: "Before meals"
    },
    {
      id: 2,
      title: "Golden Milk (Turmeric Latte)",
      category: "pain",
      difficulty: "Easy", 
      icon: "🥛",
      description: "Anti-inflammatory powerhouse for immunity and sleep",
      ingredients: [
        "1 cup warm milk (dairy or plant-based)",
        "1/2 tsp turmeric powder",
        "1 tsp coconut oil",
        "Pinch of black pepper",
        "Honey to taste"
      ],
      instructions: [
        "Heat milk in a pan",
        "Add turmeric powder and stir well",
        "Add coconut oil and black pepper",
        "Sweeten with honey after cooling slightly"
      ],
      dosage: "1 cup before bedtime",
      timing: "30 minutes before sleep"
    },
    {
      id: 3,
      title: "Chamomile Tea",
      category: "stress",
      difficulty: "Easy",
      icon: "🌼", 
      description: "Natural remedy for anxiety, insomnia, and stress relief",
      ingredients: [
        "1 chamomile tea bag or 1 tsp dried flowers",
        "1 cup hot water",
        "1 tsp honey (optional)"
      ],
      instructions: [
        "Steep chamomile in hot water for 5-7 minutes",
        "Remove tea bag or strain flowers",
        "Add honey if desired",
        "Drink while warm"
      ],
      dosage: "1 cup, 2 times daily",
      timing: "Morning and evening"
    },
    {
      id: 4,
      title: "Lemon Water with Sea Salt",
      category: "digestive",
      difficulty: "Easy",
      icon: "🍋",
      description: "Gentle remedy for bloating, detox, and hydration",
      ingredients: [
        "1 fresh lemon",
        "1 cup warm water",
        "Pinch of sea salt"
      ],
      instructions: [
        "Squeeze fresh lemon juice into warm water",
        "Add a pinch of sea salt",
        "Stir well",
        "Drink on empty stomach"
      ],
      dosage: "1 cup in the morning",
      timing: "Empty stomach, first thing in morning"
    },
    {
      id: 5,
      title: "Raw Honey Face Mask",
      category: "skincare",
      difficulty: "Easy",
      icon: "🍯",
      description: "Natural antiseptic for acne, dry skin, and inflammation",
      ingredients: [
        "2 tbsp raw honey",
        "1 tsp oatmeal (optional)",
        "1 tsp aloe vera gel (optional)"
      ],
      instructions: [
        "Mix raw honey with oatmeal if using",
        "Add aloe vera gel for extra soothing",
        "Apply to clean face for 15-20 minutes",
        "Rinse with warm water"
      ],
      dosage: "Apply 2-3 times per week",
      timing: "Evening before bed"
    },
    {
      id: 6,
      title: "Epsom Salt Bath",
      category: "pain",
      difficulty: "Easy",
      icon: "🛁",
      description: "Soothing bath for muscle pain, stress, and inflammation",
      ingredients: [
        "1-2 cups Epsom salt",
        "Warm bath water",
        "Essential oils (optional)"
      ],
      instructions: [
        "Fill bathtub with warm water",
        "Add Epsom salt while water is running",
        "Add 5-10 drops essential oil if desired",
        "Soak for 15-20 minutes"
      ],
      dosage: "2-3 times per week",
      timing: "Evening before bed"
    }
  ];

  const safetyDos = [
    "Start with small quantities to test tolerance",
    "Use fresh, organic ingredients when possible",
    "Follow dosage instructions carefully",
    "Consult healthcare providers for chronic conditions",
    "Stop if you experience adverse reactions",
    "Store remedies properly and use fresh preparations"
  ];

  const safetyDonts = [
    "Don't exceed recommended dosages",
    "Avoid if you have known allergies to ingredients", 
    "Don't use as substitute for emergency medical care",
    "Avoid during pregnancy without doctor consultation",
    "Don't mix with medications without medical advice",
    "Don't ignore worsening symptoms"
  ];

  const filteredRemedies = selectedCategory === 'all' 
    ? remedies 
    : remedies.filter(remedy => remedy.category === selectedCategory);

  return (
    <section id="remedies" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
              🌿 Natural Home Remedies
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Discover time-tested natural remedies using ingredients{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                commonly found in American households
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              These traditional solutions have been used for generations to promote wellness and healing.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </motion.div>

          {/* Remedies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredRemedies.map((remedy, index) => (
              <motion.div
                key={remedy.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{remedy.icon}</div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.id === remedy.category)?.icon} {categories.find(c => c.id === remedy.category)?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {remedy.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{remedy.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{remedy.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Ingredients */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        Ingredients:
                      </h4>
                      <ul className="space-y-1">
                        {remedy.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions Preview */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        How to make:
                      </h4>
                      <ol className="space-y-1">
                        {remedy.instructions.slice(0, 2).map((instruction, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary font-medium">{idx + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                        {remedy.instructions.length > 2 && (
                          <li className="text-sm text-muted-foreground">
                            <span className="text-primary">+ {remedy.instructions.length - 2} more steps</span>
                          </li>
                        )}
                      </ol>
                    </div>

                    {/* Dosage & Timing */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">Dosage:</span>
                        <span className="text-muted-foreground">{remedy.dosage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-medium">Best time:</span>
                        <span className="text-muted-foreground">{remedy.timing}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Safety Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Safety Guidelines</h3>
              <p className="text-muted-foreground">Important considerations when using natural remedies</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Do's */}
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="w-5 h-5" />
                    Do's
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {safetyDos.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Don'ts */}
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <XCircle className="w-5 h-5" />
                    Don'ts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {safetyDonts.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Personalized CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Search className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Get Personalized Remedy Recommendations</h3>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let CareBow analyze your specific symptoms and recommend the most suitable natural remedies for your condition.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 py-3 text-lg font-semibold"
                  asChild
                >
                  <Link to="/auth?redirect=/ask-carebow/app">
                    <Search className="w-5 h-5 mr-2" />
                    Get My Personalized Remedies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NaturalRemediesSection;