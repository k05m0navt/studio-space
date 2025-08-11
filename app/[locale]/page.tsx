"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { ArrowRight, Camera, Users, Star, Wifi, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { LocationMap } from "@/components/location-map";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-8xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh] py-12 sm:py-16 lg:py-20">
            {/* Left Content */}
            <motion.div 
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-4 lg:space-y-6">
                <motion.div 
                  className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-accent rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t('badge')}
                </motion.div>
                
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  {t('heroTitle')}
                  <span className="block text-primary">{t('heroTitleAccent')}</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                  {t('heroDescription')}
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <Link href="/book" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg">
                      {t('bookStudio')}
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/gallery" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl">
                      {t('viewGallery')}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-6 lg:pt-8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <div className="text-2xl sm:text-3xl font-bold">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{t('stats.projects')}</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <div className="text-2xl sm:text-3xl font-bold">50+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{t('stats.members')}</div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-base sm:text-lg font-semibold">4.9</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">({t('stats.reviews')})</span>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Enhanced Studio Showcase */}
            <motion.div 
              className="relative order-first lg:order-last"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div className="grid grid-cols-12 gap-3 sm:gap-4 h-[400px] sm:h-[450px] lg:h-[500px]">
                {/* Main Studio Card */}
                <motion.div
                  className="col-span-8 row-span-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.005, y: -1 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-xl bg-card">
                    <CardContent className="h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-center">
                      <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                        whileHover={{ rotate: 2, scale: 1.01 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">{t('studio.title')}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {t('studio.description')}
                      </p>
                      <motion.div 
                        className="mt-4 sm:mt-6 px-3 py-2 sm:px-4 sm:py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-medium text-primary"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.1 }}
                      >
                        {t('studio.price')}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Community Card */}
                <motion.div
                  className="col-span-4 row-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, rotate: 0.5 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-lg bg-card">
                    <CardContent className="h-full flex flex-col justify-center items-center p-3 sm:p-4 lg:p-6 text-center">
                      <motion.div
                        whileHover={{ rotate: -2, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                      </motion.div>
                      <h4 className="font-semibold text-xs sm:text-sm mb-1">{t('community.title')}</h4>
                      <p className="text-xs text-muted-foreground">{t('community.members')}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Amenities Card */}
                <motion.div
                  className="col-span-4 row-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, rotate: -0.5 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-lg bg-card">
                    <CardContent className="h-full flex flex-col justify-center items-center p-3 sm:p-4 lg:p-6 text-center">
                      <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
                          <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
                          <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </motion.div>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm mb-1">{t('amenities.title')}</h4>
                      <p className="text-xs text-muted-foreground">{t('amenities.description')}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              {/* Floating Accent */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/30 rounded-full"
                animate={{ 
                  y: [0, 10, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <LocationMap />
    </div>
  );
} 