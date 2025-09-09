"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, HelpCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from '@/i18n/routing';

const faqData = [
  { id: 1, category: 'studio', questionKey: 'q1.question', answerKey: 'q1.answer' },
  { id: 2, category: 'studio', questionKey: 'q2.question', answerKey: 'q2.answer' },
  { id: 3, category: 'coworking', questionKey: 'q3.question', answerKey: 'q3.answer' },
  { id: 4, category: 'coworking', questionKey: 'q4.question', answerKey: 'q4.answer' },
  { id: 5, category: 'booking', questionKey: 'q5.question', answerKey: 'q5.answer' },
  { id: 6, category: 'booking', questionKey: 'q6.question', answerKey: 'q6.answer' },
  { id: 7, category: 'general', questionKey: 'q7.question', answerKey: 'q7.answer' },
  { id: 8, category: 'general', questionKey: 'q8.question', answerKey: 'q8.answer' }
];

export default function FAQPage() {
  const t = useTranslations('faq');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categoryKeys = ['all', 'studio', 'coworking', 'booking', 'general'];
  const categories = categoryKeys.map((k) => ({ key: k, label: t(`categories.${k}`) }));

  const contactInfo = [
    { icon: Phone, title: t('contact.phone'), details: "+1 (555) 123-4567", action: t('contact.call') },
    { icon: Mail, title: t('contact.email'), details: "hello@vashastudio.com", action: t('contact.emailAction') },
    { icon: MapPin, title: t('contact.address'), details: t('contact.addressShort'), action: t('contact.getDirections') },
    { icon: Clock, title: t('contact.hours'), details: t('contact.hoursShort'), action: t('contact.viewSchedule') },
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('helpBadge')}
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
              {t('subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="flex flex-wrap justify-center gap-2 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button
                  variant={activeCategory === category.key ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.key)}
                  className="rounded-full px-6 py-2"
                >
                  {category.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div 
            className="space-y-4"
            layout
          >
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <motion.button
                      className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => toggleItem(faq.id)}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {t(`categories.${faq.category}`)}
                          </Badge>
                          <h3 className="text-lg font-semibold">{t(faq.questionKey)}</h3>
                        </div>
                        <motion.div
                          animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="px-6 pb-6 pt-0">
                            <p className="text-muted-foreground leading-relaxed">
                              {t(faq.answerKey)}
                            </p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredFAQs.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground">
                No FAQs found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
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
              {t('help.stillHaveQuestions.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('help.stillHaveQuestions.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full text-center">
                  <CardContent className="p-8 flex flex-col h-full">
                    <motion.div 
                      className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <contact.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{contact.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{contact.details}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full border dark:border-primary/70 bg-background dark:bg-transparent text-primary dark:text-primary hover:bg-accent/5 dark:hover:bg-primary/10"
                    >
                      {contact.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link href="/book">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                {t('help.contactCta')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 