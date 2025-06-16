"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Calendar, Filter } from "lucide-react";

const categories = [
  { id: 'all', labelKey: 'all' },
  { id: 'studio', labelKey: 'studio' },
  { id: 'coworking', labelKey: 'coworking' },
  { id: 'events', labelKey: 'events' }
];

// Gallery data using local images
const galleryItems = [
  {
    id: 1,
    title: "Portrait Session",
    category: "studio",
    image: "/images/gallery/portrait-session.webp",
    description: "Professional portrait photography session"
  },
  {
    id: 2,
    title: "Team Collaboration",
    category: "coworking",
    image: "/images/gallery/team-collaboration.webp",
    description: "Creative team working together"
  },
  {
    id: 3,
    title: "Product Photography",
    category: "studio",
    image: "/images/gallery/product-photography.webp",
    description: "Professional product shots"
  },
  {
    id: 4,
    title: "Workshop Event",
    category: "events",
    image: "/images/gallery/workshop-event.webp",
    description: "Photography workshop in progress"
  },
  {
    id: 5,
    title: "Fashion Shoot",
    category: "studio",
    image: "/images/gallery/fashion-shoot.webp",
    description: "Fashion photography session"
  },
  {
    id: 6,
    title: "Networking Event",
    category: "events",
    image: "/images/gallery/networking-event.webp",
    description: "Community networking evening"
  },
  {
    id: 7,
    title: "Workspace Lifestyle",
    category: "coworking",
    image: "/images/gallery/workspace-lifestyle.webp",
    description: "Modern coworking environment"
  },
  {
    id: 8,
    title: "Brand Photography",
    category: "studio",
    image: "/images/gallery/brand-photography.webp",
    description: "Corporate brand photography"
  },
  {
    id: 9,
    title: "Creative Meeting",
    category: "coworking",
    image: "/images/gallery/creative-meeting.webp",
    description: "Brainstorming session"
  }
];

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

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
              Our Work & Community
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

      {/* Filter Section */}
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
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full px-6 py-2"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t(`categories.${category.labelKey}`)}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div 
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Badge variant="secondary" className="backdrop-blur-sm">
                        {item.category === 'studio' && <Camera className="w-3 h-3 mr-1" />}
                        {item.category === 'coworking' && <Users className="w-3 h-3 mr-1" />}
                        {item.category === 'events' && <Calendar className="w-3 h-3 mr-1" />}
                        {t(`categories.${item.category}`)}
                      </Badge>
                    </motion.div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground">
                No items found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary">500+</div>
              <div className="text-lg text-muted-foreground">Projects Completed</div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary">50+</div>
              <div className="text-lg text-muted-foreground">Happy Clients</div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary">100+</div>
              <div className="text-lg text-muted-foreground">Community Events</div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 