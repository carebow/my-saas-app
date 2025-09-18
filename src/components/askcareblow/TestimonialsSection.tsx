import React from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Quote, Heart } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Maria L.',
      location: 'Los Angeles, CA',
      avatar: 'ML',
      rating: 5,
      quote: 'The voice feature in Spanish made it so easy for my grandmother to use. She got relief from her joint pain with turmeric milk.',
      role: '👩‍💼 Working Professional',
      condition: 'Joint Pain Relief'
    },
    {
      name: 'Jennifer K.',
      location: 'Denver, CO',
      avatar: 'JK',
      rating: 5,
      quote: 'Finally, an AI that understands natural remedies! The ginger tea recipe worked wonders for my morning sickness.',
      role: '👨‍💻 Expecting Mother',
      condition: 'Morning Sickness'
    },
    {
      name: 'David M.',
      location: 'Chicago, IL',
      avatar: 'DM',
      rating: 5,
      quote: 'The recovery tracking feature helped me stick to the remedy routine. My digestive issues are completely gone!',
      role: '👨‍⚕️ Healthcare Worker',
      condition: 'Digestive Health'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real stories from people who found relief with CareBow's AI-powered natural health guidance
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <Quote className="w-8 h-8 text-primary/60" />
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Heart key={i} className="w-4 h-4 fill-red-400 text-red-400" />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-foreground mb-6 text-base leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                        <div className="text-xs text-primary mt-1">{testimonial.condition}</div>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Success Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-2">72h</div>
              <div className="text-sm text-muted-foreground">Average Relief Time</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-2">7</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Availability</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;