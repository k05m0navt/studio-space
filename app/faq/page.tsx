"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HelpCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// Static FAQs for demo (replace with database fetch later)
const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What equipment is included with studio rental?',
    answer: 'Our studio includes professional lighting equipment, cameras (available for rent), backdrops, reflectors, and basic props. We also provide editing stations with Adobe Creative Suite.',
    category: 'studio',
    order: 1
  },
  {
    id: '2',
    question: 'Can I bring my own equipment?',
    answer: 'Absolutely! You are welcome to bring your own photography equipment. Our studio has ample power outlets and space for your gear.',
    category: 'studio',
    order: 2
  },
  {
    id: '3',
    question: 'How much does studio rental cost?',
    answer: 'Studio rental starts at $75 per hour. We offer package deals for longer sessions and discounts for regular customers.',
    category: 'studio',
    order: 3
  },
  {
    id: '4',
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 1-2 weeks in advance, especially for weekends. However, we often have same-day availability for weekdays.',
    category: 'general',
    order: 1
  },
  {
    id: '5',
    question: 'What is your cancellation policy?',
    answer: 'You can cancel up to 24 hours before your booking for a full refund. Cancellations within 24 hours are subject to a 50% charge.',
    category: 'general',
    order: 2
  },
  {
    id: '6',
    question: 'Is there parking available?',
    answer: 'Yes, we provide free parking for all members and studio renters. There are dedicated spots in front of the building.',
    category: 'general',
    order: 3
  },
  {
    id: '7',
    question: 'What are the coworking space hours?',
    answer: 'Our coworking space is open 24/7 for monthly and annual members. Day pass users have access from 6 AM to 10 PM.',
    category: 'coworking',
    order: 1
  },
  {
    id: '8',
    question: 'Do you have meeting rooms?',
    answer: 'Yes, we have 5 meeting rooms that can be booked by coworking members. Day pass users get limited access, while monthly members get priority booking.',
    category: 'coworking',
    order: 2
  },
  {
    id: '9',
    question: 'Is there a kitchen or coffee available?',
    answer: 'We have a fully equipped kitchen with free coffee, tea, and light snacks. There is also a refrigerator and microwave for member use.',
    category: 'coworking',
    order: 3
  },
  {
    id: '10',
    question: 'What coworking memberships are available?',
    answer: 'We offer day passes ($25), monthly memberships ($200), and annual memberships ($1,800). Each tier includes different perks and access levels.',
    category: 'coworking',
    order: 4
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'studio', label: 'Photo Studio', icon: HelpCircle },
  { id: 'coworking', label: 'Coworking', icon: HelpCircle }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered FAQs for better performance
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => a.order - b.order);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              Find answers to common questions about our studio and coworking space.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.05), ease: "easeOut" }}
                >
                  <Button
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative overflow-hidden transition-all duration-200 ${
                      activeCategory === category.id 
                        ? "shadow-md" 
                        : "hover:shadow-sm"
                    }`}
                  >
                    {activeCategory === category.id && (
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        layoutId="category-active"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      <category.icon className="h-3 w-3" />
                      {category.label}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.03,
                          ease: "easeOut"
                        }}
                      >
                        <AccordionItem 
                          value={faq.id}
                          className="border rounded-lg px-1 bg-background hover:bg-accent/50 transition-colors duration-200"
                        >
                          <AccordionTrigger className="text-left px-4 py-4 hover:no-underline">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground px-4 pb-4">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {faq.answer}
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center py-12">
                      <CardContent>
                        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search or selecting a different category.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/20 border-0 shadow-lg">
              <CardContent className="text-center p-8">
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Still have questions?
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-6 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Our team is here to help! Reach out to us directly and we'll get back to you as soon as possible.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.a 
                    href="mailto:hello@studiospace.com"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Button size="lg" className="shadow-md">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </Button>
                  </motion.a>
                  <motion.a 
                    href="tel:+1234567890"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Button size="lg" variant="outline">
                      <Phone className="h-4 h-4 mr-2" />
                      Call Us
                    </Button>
                  </motion.a>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 