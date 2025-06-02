"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Car, Train, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export function LocationMap() {
  const t = useTranslations('location');

  return (
    <section className="py-16 lg:py-20 bg-muted/20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 max-w-8xl">
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 text-foreground">
            {t('title')}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Enhanced Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <Card className="overflow-hidden shadow-lg border border-border h-full group bg-card">
              <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden rounded-lg">
                {/* Enhanced Map Iframe */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.3159753092283!2d-74.00601668459418!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729807!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Studio Space Location"
                  className="transition-all duration-300 group-hover:scale-[1.02] rounded-lg"
                />
                
                {/* Floating Location Badge */}
                <motion.div 
                  className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('studioName')}</p>
                      <p className="text-xs text-muted-foreground">{t('district')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Zoom Control Hint */}
                <motion.div 
                  className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground border border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {t('clickToExplore')}
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-4 lg:space-y-6 order-1 lg:order-2"
          >
            {/* Address Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-md border border-border hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg">{t('address.title')}</p>
                      <p className="text-sm text-muted-foreground font-normal">{t('address.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('address.street')}<br />
                    {t('address.district')}<br />
                    {t('address.city')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => window.open('https://maps.google.com/?q=123+Creative+Avenue+New+York+NY', '_blank')}
                  >
                    <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {t('address.getDirections')}
                    <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-md border border-border hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg">{t('hours.title')}</p>
                      <p className="text-sm text-muted-foreground font-normal">{t('hours.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                      <span className="text-muted-foreground">{t('hours.weekdays')}</span>
                      <span className="font-medium">{t('hours.weekdaysTime')}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md">
                      <span className="text-muted-foreground">{t('hours.saturday')}</span>
                      <span className="font-medium">{t('hours.saturdayTime')}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                      <span className="text-muted-foreground">{t('hours.sunday')}</span>
                      <span className="font-medium">{t('hours.sundayTime')}</span>
                    </div>
                    <div className="pt-2 border-t bg-primary/5 p-2 rounded-md mt-2">
                      <span className="text-xs text-primary font-medium">
                        ✨ {t('hours.memberAccess')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-md border border-border hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg">{t('contact.title')}</p>
                      <p className="text-sm text-muted-foreground font-normal">{t('contact.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('contact.phone')}</p>
                      <p className="text-xs text-muted-foreground">{t('contact.phoneSubtitle')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('contact.email')}</p>
                      <p className="text-xs text-muted-foreground">{t('contact.emailSubtitle')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Transportation */}
            <motion.div
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-md border border-border hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg">{t('transport.title')}</p>
                      <p className="text-sm text-muted-foreground font-normal">{t('transport.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                      <div className="w-6 h-6 bg-green-500/10 rounded-md flex items-center justify-center">
                        <Car className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('transport.parking')}</p>
                        <p className="text-xs text-muted-foreground">{t('transport.parkingDetails')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                      <div className="w-6 h-6 bg-blue-500/10 rounded-md flex items-center justify-center">
                        <Train className="w-3 h-3 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('transport.metro')}</p>
                        <p className="text-xs text-muted-foreground">{t('transport.metroDetails')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 