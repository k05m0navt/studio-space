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
  {
    id: 1,
    category: "Studio",
    question: "What equipment is included with studio rental?",
    answer: "Our studio comes fully equipped with professional lighting setups, backdrops, reflectors, and basic photography equipment. We also have high-end cameras and lenses available for rent at an additional cost."
  },
  {
    id: 2,
    category: "Studio",
    question: "Can I bring my own equipment?",
    answer: "Absolutely! You're welcome to bring your own cameras, lenses, and any specialized equipment. Our studio is designed to accommodate various setups and equipment configurations."
  },
  {
    id: 3,
    category: "Coworking",
    question: "What are the coworking space hours?",
    answer: "Our coworking space is open 24/7 for monthly members. Day pass users have access from 8 AM to 8 PM on weekdays and 9 AM to 6 PM on weekends."
  },
  {
    id: 4,
    category: "Coworking",
    question: "Is there parking available?",
    answer: "Yes, we provide free parking for all members and visitors. We have both covered and open parking spaces available on a first-come, first-served basis."
  },
  {
    id: 5,
    category: "Booking",
    question: "How far in advance can I book?",
    answer: "You can book studio time up to 3 months in advance. For coworking spaces, monthly memberships can be purchased at any time, and day passes can be booked up to 1 month ahead."
  },
  {
    id: 6,
    category: "Booking",
    question: "What is your cancellation policy?",
    answer: "Studio bookings can be cancelled up to 24 hours before your session for a full refund. Coworking day passes can be cancelled up to 2 hours before your scheduled time."
  },
  {
    id: 7,
    category: "General",
    question: "Do you offer photography services?",
    answer: "While we primarily rent studio space, we can connect you with professional photographers from our network. We also host workshops and training sessions regularly."
  },
  {
    id: 8,
    category: "General",
    question: "Is food and drink allowed in the space?",
    answer: "Light snacks and beverages are allowed in the coworking areas. In the studio, we ask that you keep food and drinks in designated areas to protect the equipment."
  }
];

const categories = ["All", "Studio", "Coworking", "Booking", "General"];

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "+1 (555) 123-4567",
    action: "Call us"
  },
  {
    icon: Mail,
    title: "Email",
    details: "hello@vashastudio.com",
    action: "Send email"
  },
  {
    icon: MapPin,
    title: "Address",
    details: "123 Creative Street, Art District",
    action: "Get directions"
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM",
    action: "View schedule"
  }
];

export default function FAQPage() {
  const t = useTranslations('faq');
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = activeCategory === "All" 
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
              Help & Support
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
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full px-6 py-2"
                >
                  {category}
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
                            {faq.category}
                          </Badge>
                          <h3 className="text-lg font-semibold">{faq.question}</h3>
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
                              {faq.answer}
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
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              Can't find what you're looking for? Get in touch with our team
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
                  <CardContent className="p-8">
                    <motion.div 
                      className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <contact.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{contact.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{contact.details}</p>
                    <Button variant="outline" size="sm" className="w-full">
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
                Book a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 