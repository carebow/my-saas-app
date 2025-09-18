import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Leaf, 
  Sun, 
  Moon, 
  Droplets, 
  Wind, 
  Flame,
  Heart,
  Clock,
  Flower,
  TreePine,
  Apple,
  Coffee,
  Utensils,
  Activity,
  Sparkles
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface DoshaType {
  name: 'Vata' | 'Pitta' | 'Kapha';
  element: string;
  characteristics: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const doshaTypes: DoshaType[] = [
  {
    name: 'Vata',
    element: 'Air & Space',
    characteristics: ['Creative', 'Energetic', 'Quick thinking', 'Light sleeper'],
    icon: Wind,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Pitta',
    element: 'Fire & Water',
    characteristics: ['Focused', 'Ambitious', 'Strong digestion', 'Natural leader'],
    icon: Flame,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    name: 'Kapha',
    element: 'Earth & Water',
    characteristics: ['Calm', 'Stable', 'Strong immunity', 'Loyal nature'],
    icon: Droplets,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

const ayurvedicRemedies = [
  {
    category: 'Digestive Health',
    icon: Apple,
    remedies: [
      'Ginger tea before meals for better digestion',
      'Turmeric milk for inflammation',
      'Fennel seeds after meals for bloating',
      'Warm water with lemon in the morning'
    ]
  },
  {
    category: 'Stress & Anxiety',
    icon: Flower,
    remedies: [
      'Ashwagandha for stress management',
      'Brahmi for mental clarity',
      'Jatamansi for anxiety relief',
      'Meditation and pranayama daily'
    ]
  },
  {
    category: 'Sleep & Rest',
    icon: Moon,
    remedies: [
      'Warm almond milk with nutmeg before bed',
      'Lavender oil massage on temples',
      'Valerian root tea for insomnia',
      'Early dinner and no screens before bed'
    ]
  },
  {
    category: 'Immunity',
    icon: TreePine,
    remedies: [
      'Chyawanprash daily for overall immunity',
      'Tulsi tea for respiratory health',
      'Golden milk with turmeric and black pepper',
      'Seasonal fruits and vegetables'
    ]
  }
];

const seasonalGuidance = [
  {
    season: 'Spring (Vasant)',
    dosha: 'Kapha',
    foods: ['Light, warm foods', 'Bitter and astringent tastes', 'Honey instead of sugar'],
    practices: ['Dry brushing', 'Vigorous exercise', 'Early rising'],
    avoid: ['Heavy, oily foods', 'Dairy products', 'Oversleeping']
  },
  {
    season: 'Summer (Grishma)',
    dosha: 'Pitta',
    foods: ['Cool, sweet foods', 'Coconut water', 'Fresh fruits and vegetables'],
    practices: ['Swimming', 'Moon salutations', 'Cooling pranayama'],
    avoid: ['Spicy foods', 'Excessive sun exposure', 'Hot beverages']
  },
  {
    season: 'Monsoon (Varsha)',
    dosha: 'Vata',
    foods: ['Warm, cooked foods', 'Ginger and garlic', 'Herbal teas'],
    practices: ['Indoor exercises', 'Oil massage', 'Regular routine'],
    avoid: ['Raw foods', 'Excessive travel', 'Irregular meals']
  },
  {
    season: 'Autumn (Sharad)',
    dosha: 'Pitta',
    foods: ['Sweet, bitter tastes', 'Ghee in moderation', 'Seasonal fruits'],
    practices: ['Gentle exercise', 'Regular sleep schedule', 'Stress management'],
    avoid: ['Fermented foods', 'Excessive heat', 'Irregular routines']
  }
];

export const AyurvedicDashboard: React.FC = () => {
  const [selectedDosha, setSelectedDosha] = useState<DoshaType | null>(null);
  const [currentSeason, setCurrentSeason] = useState('Spring (Vasant)');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Ayurvedic Wisdom
            </h1>
            <p className="text-muted-foreground">5000+ Years of Traditional Health Knowledge</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="constitution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="constitution">Doshas</TabsTrigger>
          <TabsTrigger value="remedies">Natural Remedies</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Care</TabsTrigger>
          <TabsTrigger value="lifestyle">Daily Routine</TabsTrigger>
        </TabsList>

        <TabsContent value="constitution" className="space-y-6">
          {/* Dosha Assessment */}
          <Alert className="border-green-200 bg-green-50">
            <Sparkles className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Know Your Constitution:</strong> Understanding your dominant dosha helps personalize your health approach. 
              Each person has a unique combination of Vata, Pitta, and Kapha.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doshaTypes.map((dosha) => {
              const Icon = dosha.icon;
              return (
                <motion.div
                  key={dosha.name}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedDosha(dosha)}
                >
                  <Card className={`border-2 transition-all ${
                    selectedDosha?.name === dosha.name 
                      ? 'border-primary shadow-lg' 
                      : 'hover:border-muted-foreground/50'
                  } ${dosha.bgColor}`}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className={`p-4 rounded-full ${dosha.bgColor} border`}>
                          <Icon className={`h-8 w-8 ${dosha.color}`} />
                        </div>
                      </div>
                      <CardTitle className={`text-xl ${dosha.color}`}>
                        {dosha.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{dosha.element}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Key Characteristics:</p>
                        <ul className="space-y-1">
                          {dosha.characteristics.map((char, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${dosha.color.replace('text-', 'bg-')}`} />
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {selectedDosha && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedDosha.icon className={`h-5 w-5 ${selectedDosha.color}`} />
                    {selectedDosha.name} Dosha Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Balancing Foods:</h4>
                    <ul className="space-y-2 text-sm">
                      {selectedDosha.name === 'Vata' && (
                        <>
                          <li>• Warm, cooked, moist foods</li>
                          <li>• Sweet, sour, and salty tastes</li>
                          <li>• Regular meal times</li>
                          <li>• Ghee and healthy oils</li>
                        </>
                      )}
                      {selectedDosha.name === 'Pitta' && (
                        <>
                          <li>• Cool, fresh foods</li>
                          <li>• Sweet, bitter, and astringent tastes</li>
                          <li>• Avoid spicy and acidic foods</li>
                          <li>• Coconut water and herbal teas</li>
                        </>
                      )}
                      {selectedDosha.name === 'Kapha' && (
                        <>
                          <li>• Light, warm, dry foods</li>
                          <li>• Pungent, bitter, and astringent tastes</li>
                          <li>• Smaller portions, less frequency</li>
                          <li>• Spices like ginger and black pepper</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-600">Lifestyle Practices:</h4>
                    <ul className="space-y-2 text-sm">
                      {selectedDosha.name === 'Vata' && (
                        <>
                          <li>• Regular daily routine</li>
                          <li>• Oil massage (Abhyanga)</li>
                          <li>• Gentle, grounding exercises</li>
                          <li>• Early bedtime and adequate sleep</li>
                        </>
                      )}
                      {selectedDosha.name === 'Pitta' && (
                        <>
                          <li>• Moderate exercise, avoid overheating</li>
                          <li>• Cool environment</li>
                          <li>• Stress management techniques</li>
                          <li>• Avoid excessive competition</li>
                        </>
                      )}
                      {selectedDosha.name === 'Kapha' && (
                        <>
                          <li>• Vigorous, energizing exercise</li>
                          <li>• Dry brushing</li>
                          <li>• Wake up early</li>
                          <li>• Stimulating activities</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="remedies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ayurvedicRemedies.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-green-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.remedies.map((remedy, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span>{remedy}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <TreePine className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              <strong>Important:</strong> These are traditional remedies for general wellness. 
              Consult an Ayurvedic practitioner for personalized treatment plans, especially if you have medical conditions.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seasonalGuidance.map((season, index) => (
              <motion.div
                key={season.season}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${currentSeason === season.season ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{season.season}</span>
                      <Badge variant="outline">{season.dosha} Season</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Recommended Foods:</h4>
                      <ul className="text-sm space-y-1">
                        {season.foods.map((food, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Apple className="h-3 w-3 text-green-500" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Lifestyle Practices:</h4>
                      <ul className="text-sm space-y-1">
                        {season.practices.map((practice, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-blue-500" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-red-600">What to Avoid:</h4>
                      <ul className="text-sm space-y-1">
                        {season.avoid.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-red-600">
                            <div className="w-3 h-3 rounded-full border border-red-500 flex items-center justify-center">
                              <div className="w-1 h-1 bg-red-500 rounded-full" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  Ideal Daily Routine (Dinacharya)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">5:00-6:00 AM</p>
                      <p className="text-xs text-muted-foreground">Wake up, drink warm water</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">6:00-8:00 AM</p>
                      <p className="text-xs text-muted-foreground">Exercise, yoga, meditation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Utensils className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm">8:00-9:00 AM</p>
                      <p className="text-xs text-muted-foreground">Breakfast - largest meal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Coffee className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">12:00-1:00 PM</p>
                      <p className="text-xs text-muted-foreground">Lunch - moderate portion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Moon className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">6:00-7:00 PM</p>
                      <p className="text-xs text-muted-foreground">Light dinner</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <Heart className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-medium text-sm">9:00-10:00 PM</p>
                      <p className="text-xs text-muted-foreground">Wind down, prepare for sleep</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Ayurvedic Self-Care Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Oil Pulling (Gandusha)</h4>
                    <p className="text-xs text-muted-foreground">
                      Swish sesame or coconut oil for 5-10 minutes, then spit out. 
                      Promotes oral health and detoxification.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Tongue Scraping</h4>
                    <p className="text-xs text-muted-foreground">
                      Use a copper tongue scraper to remove toxins and improve taste sensitivity.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Abhyanga (Oil Massage)</h4>
                    <p className="text-xs text-muted-foreground">
                      Self-massage with warm oil before bathing. Nourishes skin and calms the nervous system.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Pranayama (Breathing)</h4>
                    <p className="text-xs text-muted-foreground">
                      Practice deep breathing exercises. Try 4-7-8 breathing or alternate nostril breathing.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Meditation</h4>
                    <p className="text-xs text-muted-foreground">
                      Even 5-10 minutes daily helps balance mind and body. Best done during sunrise or sunset.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};