"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Coffee, Monitor, Printer, Phone, Calendar, Clock, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const amenities = [
  {
    icon: Wifi,
    title: "High-Speed Internet",
    description: "Fiber internet with 1GB/s speed for seamless work and video calls."
  },
  {
    icon: Coffee,
    title: "Coffee & Refreshments", 
    description: "Unlimited coffee, tea, and healthy snacks throughout the day."
  },
  {
    icon: Monitor,
    title: "Modern Workstations",
    description: "Ergonomic desks with dual monitor setups and adjustable chairs."
  },
  {
    icon: Printer,
    title: "Office Equipment",
    description: "High-quality printers, scanners, and office supplies available."
  },
  {
    icon: Phone,
    title: "Meeting Rooms",
    description: "Private meeting rooms with video conferencing equipment."
  },
  {
    icon: Calendar,
    title: "Event Space",
    description: "Flexible event space for workshops, presentations, and networking."
  }
];

const plans = [
  {
    name: "Day Pass",
    price: "$25",
    duration: "per day",
    features: [
      "8 hours access",
      "Desk space",
      "Wi-Fi & coffee",
      "Basic amenities"
    ]
  },
  {
    name: "Monthly",
    price: "$200",
    duration: "per month",
    features: [
      "24/7 access",
      "Dedicated desk",
      "Meeting room credits",
      "All amenities",
      "Mail handling"
    ],
    popular: true
  },
  {
    name: "Private Office", 
    price: "$500",
    duration: "per month",
    features: [
      "Private office space",
      "24/7 access",
      "Meeting rooms included",
      "Premium amenities",
      "Dedicated phone line"
    ]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Designer",
    content: "The perfect environment for creativity and productivity. Love the community here!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Startup Founder",
    content: "Great networking opportunities and excellent facilities. Highly recommended!",
    rating: 5
  }
];

export default function CoworkingPage() {
  const t = useTranslations('coworking');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
        <div className="container mx-auto relative z-10 px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-4 py-2 text-sm border mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Users className="w-4 h-4 mr-2" />
              {t('subtitle')}
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('title')}
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('description')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/book">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  Book Your Space
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  View Workspace
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              World-Class Amenities
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to work productively and comfortably
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-8">
                    <motion.div 
                      className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <amenity.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{amenity.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{amenity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Flexible Pricing Plans
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that works best for your needs
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                    <motion.div 
                      className="pt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/book">
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join a community of successful professionals and entrepreneurs
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of productivity, creativity, and community. 
              Book your workspace today and see why professionals choose Vasha Studio.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/book">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  Book a Tour
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 