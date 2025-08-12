"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Wifi, Coffee, Monitor, Printer, Phone, Calendar, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CoworkingPage() {
  const t = useTranslations('coworking');
  const tCommon = useTranslations('common');

  const amenities = [
    {
      icon: Wifi,
      title: t('amenities.internet.title'),
      description: t('amenities.internet.description')
    },
    {
      icon: Coffee,
      title: t('amenities.coffee.title'), 
      description: t('amenities.coffee.description')
    },
    {
      icon: Monitor,
      title: t('amenities.workstations.title'),
      description: t('amenities.workstations.description')
    },
    {
      icon: Printer,
      title: t('amenities.equipment.title'),
      description: t('amenities.equipment.description')
    },
    {
      icon: Phone,
      title: t('amenities.meetings.title'),
      description: t('amenities.meetings.description')
    },
    {
      icon: Calendar,
      title: t('amenities.events.title'),
      description: t('amenities.events.description')
    }
  ];

  const plans = [
    {
      name: t('plans.dayPass.name'),
      price: t('plans.dayPass.price'),
      duration: t('plans.dayPass.duration'),
      features: [
        t('plans.dayPass.feature1'),
        t('plans.dayPass.feature2'),
        t('plans.dayPass.feature3'),
        t('plans.dayPass.feature4')
      ]
    },
    {
      name: t('plans.monthly.name'),
      price: t('plans.monthly.price'),
      duration: t('plans.monthly.duration'),
      features: [
        t('plans.monthly.feature1'),
        t('plans.monthly.feature2'),
        t('plans.monthly.feature3'),
        t('plans.monthly.feature4'),
        t('plans.monthly.feature5')
      ],
      popular: true
    },
    {
      name: t('plans.privateOffice.name'), 
      price: t('plans.privateOffice.price'),
      duration: t('plans.privateOffice.duration'),
      features: [
        t('plans.privateOffice.feature1'),
        t('plans.privateOffice.feature2'),
        t('plans.privateOffice.feature3'),
        t('plans.privateOffice.feature4'),
        t('plans.privateOffice.feature5')
      ]
    }
  ];

  const testimonials = [
    {
      name: t('testimonials.sarah.name'),
      role: t('testimonials.sarah.role'),
      content: t('testimonials.sarah.content'),
      rating: 5
    },
    {
      name: t('testimonials.mike.name'),
      role: t('testimonials.mike.role'),
      content: t('testimonials.mike.content'),
      rating: 5
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
                  {t('bookSpace')}
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  {t('viewWorkspace')}
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
              {t('amenitiesTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('amenitiesDescription')}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <amenity.icon className="h-8 w-8 text-primary" />
                    </div>
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
              {t('pricingTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('pricingDescription')}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`relative h-full ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/book" className="block mt-8">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
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
              {t('testimonialsTitle')}
            </h2>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
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