"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Camera, Lightbulb, Monitor, Headphones, Wifi, Coffee, Check, Star } from "lucide-react";
import { motion } from "framer-motion";

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
              Professional Photography Studio
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Professional Photo{" "}
              <span className="text-primary">
                Studio
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A fully equipped photography studio with professional lighting, 
              equipment, and editing stations. Perfect for photoshoots, product 
              photography, and creative projects.
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
              Choose the package that fits your project needs
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card 
                  className={`relative group hover:shadow-xl transition-shadow h-full ${
                    pkg.popular 
                      ? 'transform scale-105 ring-2 ring-primary/20' 
                      : ''
                  }`}
                >
                  {pkg.popular && (
                    <motion.div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="bg-primary text-primary-foreground text-sm font-medium px-6 py-2 rounded-full shadow-lg flex items-center">
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        Most Popular
                      </div>
                    </motion.div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl md:text-5xl font-bold">{pkg.price}</span>
                      <span className="text-lg text-muted-foreground ml-2">{pkg.duration}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                          viewport={{ once: true }}
                        >
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Link href="/book" className="block">
                      <Button 
                        className={`w-full h-12 text-base font-semibold ${
                          pkg.popular 
                            ? 'bg-primary text-primary-foreground'
                            : ''
                        }`}
                      >
                        Choose {pkg.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <Card className="text-center p-12 shadow-xl max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Create?
              </CardTitle>
              <CardDescription className="text-xl max-w-2xl mx-auto">
                Book your studio session today and bring your creative vision to life.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Link href="/book">
                <Button size="lg" className="h-12 px-8 text-base font-semibold">
                  Book Your Session Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 