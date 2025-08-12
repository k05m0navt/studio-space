"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Camera, Lightbulb, Monitor, Headphones, Wifi, Coffee, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function StudioPage() {
  const t = useTranslations('studio');
  const tCommon = useTranslations('common');

  const features = [
    {
      icon: Camera,
      title: t('equipment.professional.title'),
      description: t('equipment.professional.description')
    },
    {
      icon: Lightbulb,
      title: t('equipment.lighting.title'), 
      description: t('equipment.lighting.description')
    },
    {
      icon: Monitor,
      title: t('equipment.editing.title'),
      description: t('equipment.editing.description')
    },
    {
      icon: Headphones,
      title: t('equipment.audio.title'),
      description: t('equipment.audio.description')
    },
    {
      icon: Wifi,
      title: t('equipment.internet.title'),
      description: t('equipment.internet.description')
    },
    {
      icon: Coffee,
      title: t('equipment.refreshments.title'),
      description: t('equipment.refreshments.description')
    }
  ];

  const packages = [
    {
      name: t('packages.hourly.name'),
      price: t('packages.hourly.price'),
      duration: t('packages.hourly.duration'),
      features: [
        t('packages.hourly.feature1'),
        t('packages.hourly.feature2'),
        t('packages.hourly.feature3'),
        t('packages.hourly.feature4')
      ]
    },
    {
      name: t('packages.halfDay.name'),
      price: t('packages.halfDay.price'),
      duration: t('packages.halfDay.duration'),
      features: [
        t('packages.halfDay.feature1'),
        t('packages.halfDay.feature2'),
        t('packages.halfDay.feature3'),
        t('packages.halfDay.feature4')
      ],
      popular: true
    },
    {
      name: t('packages.fullDay.name'), 
      price: t('packages.fullDay.price'),
      duration: t('packages.fullDay.duration'),
      features: [
        t('packages.fullDay.feature1'),
        t('packages.fullDay.feature2'),
        t('packages.fullDay.feature3'),
        t('packages.fullDay.feature4')
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary/5 overflow-hidden">
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
                  {t('bookStudio')}
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  {t('viewGallery')}
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
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('featuresDescription')}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
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
              {t('pricingTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('pricingDescription')}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`relative h-full ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{pkg.price}</span>
                      <span className="text-muted-foreground ml-2">{pkg.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/book" className="block mt-8">
                      <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                        {tCommon('submit')}
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