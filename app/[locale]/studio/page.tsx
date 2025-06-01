"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Camera, Lightbulb, Monitor, Headphones, Wifi, Coffee, Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const features = [
  {
    icon: Camera,
    title: "Professional Equipment",
    description: "High-end cameras, lenses, and photography equipment available for rent."
  },
  {
    icon: Lightbulb,
    title: "Studio Lighting", 
    description: "Professional lighting setup with softboxes, reflectors, and colored gels."
  },
  {
    icon: Monitor,
    title: "Editing Stations",
    description: "High-resolution monitors with Adobe Creative Suite installed."
  },
  {
    icon: Headphones,
    title: "Audio Equipment",
    description: "Professional microphones and audio recording equipment."
  },
  {
    icon: Wifi,
    title: "High-Speed Internet",
    description: "Fiber internet connection for seamless file uploads and streaming."
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description: "Complimentary coffee, tea, and light snacks during your session."
  }
];

const packages = [
  {
    name: "Hourly Rate",
    price: "$75",
    duration: "per hour",
    features: [
      "Full studio access",
      "Basic lighting setup", 
      "Equipment rental available",
      "Free Wi-Fi"
    ]
  },
  {
    name: "Half Day",
    price: "$300",
    duration: "4 hours",
    features: [
      "Everything in hourly rate",
      "Extended equipment access",
      "Refreshments included",
      "Flexible scheduling"
    ],
    popular: true
  },
  {
    name: "Full Day", 
    price: "$500",
    duration: "8 hours",
    features: [
      "Everything in half day",
      "Premium equipment access",
      "Dedicated support",
      "Lunch included"
    ]
  }
];

export default function StudioPage() {
  const t = useTranslations('studio');
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
              <Camera className="w-4 h-4 mr-2" />
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
                  Book Studio Time
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

      {/* Features Section */}
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
              Studio Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for professional photography and content creation
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
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
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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
              Studio Packages
            </h2>
            <p className="text-lg text-muted-foreground">
              Flexible pricing options for every project
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className={`group hover:shadow-xl transition-all h-full relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">{pkg.price}</span>
                        <span className="text-muted-foreground ml-2">{pkg.duration}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/book" className="block">
                      <Button 
                        className={`w-full ${pkg.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={pkg.popular ? 'default' : 'outline'}
                      >
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 