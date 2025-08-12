"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Car, Train, ExternalLink, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ymaps?: any;
  }
}

// Yandex Maps component
function YandexMap({ className }: { className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadYandexMap = async () => {
      // Load Yandex Maps API
      if (typeof window !== 'undefined' && !window.ymaps) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=en_US';
        script.type = 'text/javascript';
        document.head.appendChild(script);
        
        script.onload = () => {
          if (window.ymaps) {
            window.ymaps.ready(() => {
              initMap();
            });
          }
        };
      } else if (window.ymaps) {
        window.ymaps.ready(() => {
          initMap();
        });
      }
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current || !window.ymaps) return;

      // Studio coordinates (example: Moscow)
      const studioCoordinates = [55.7558, 37.6176];
      
      mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
        center: studioCoordinates,
        zoom: 15,
        controls: ['zoomControl', 'fullscreenControl']
      }, {
        suppressMapOpenBlock: true
      });

      // Add studio marker
      const placemark = new window.ymaps.Placemark(studioCoordinates, {
        balloonContent: `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Vasha Studio</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Professional Photography Studio & Creative Coworking</p>
            <p style="margin: 0; font-size: 14px;"><strong>Address:</strong> 123 Creative Avenue, Moscow</p>
          </div>
        `,
        hintContent: 'Vasha Studio - Creative Space'
      }, {
        preset: 'islands#yellow-dot',
        iconColor: '#FFD700'
      });

      mapInstanceRef.current.geoObjects.add(placemark);

      // Custom map controls styling
      mapInstanceRef.current.controls.get('zoomControl').options.set({
        size: 'small',
        position: { right: 10, top: 10 }
      });

      mapInstanceRef.current.controls.get('fullscreenControl').options.set({
        position: { right: 10, top: 50 }
      });
    };

    loadYandexMap();

    return () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={className}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl overflow-hidden elevation-2"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}

export function LocationMap() {
  const t = useTranslations('location');

  return (
    <section className="py-16 lg:py-24 bg-surface-container-low/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 max-w-7xl">
        <motion.div 
          className="text-center mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-foreground">
            {t('title')}
          </h2>
          <p className="text-lg lg:text-xl text-surface-variant-foreground max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Yandex Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <Card className="overflow-hidden elevation-3 border-outline-variant bg-surface-container group">
              <div className="relative h-[450px] lg:h-[520px] w-full overflow-hidden">
                <YandexMap className="w-full h-full" />
                
                {/* Floating Location Badge */}
                <motion.div 
                  className="absolute top-4 left-4 bg-surface-container-high/95 backdrop-blur-md rounded-xl p-4 elevation-2 border border-outline-variant"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-surface-foreground">{t('studioName')}</p>
                      <p className="text-xs text-surface-variant-foreground">{t('district')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Map Controls Hint */}
                <motion.div 
                  className="absolute bottom-4 right-4 bg-surface-container-high/90 backdrop-blur-md rounded-lg px-3 py-2 text-xs text-surface-variant-foreground border border-outline-variant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3 h-3" />
                    {t('clickToExplore')}
                  </div>
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
            className="space-y-6 lg:space-y-8 order-1 lg:order-2"
          >
            {/* Address Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
              className="hover-lift"
            >
              <Card className="elevation-2 border-outline-variant hover:elevation-3 transition-all duration-300 bg-surface-container">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{t('address.title')}</p>
                      <p className="text-sm text-surface-variant-foreground font-normal">{t('address.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-surface-variant-foreground leading-relaxed mb-6 text-base">
                    {t('address.street')}<br />
                    {t('address.district')}<br />
                    {t('address.city')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="state-layer group border-outline-variant hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    onClick={() => window.open('https://yandex.ru/maps/?text=123+Creative+Avenue+Moscow', '_blank')}
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
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
              className="hover-lift"
            >
              <Card className="elevation-2 border-outline-variant hover:elevation-3 transition-all duration-300 bg-surface-container">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-success-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{t('hours.title')}</p>
                      <p className="text-sm text-surface-variant-foreground font-normal">{t('hours.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-high/50">
                      <span className="text-surface-variant-foreground font-medium">{t('hours.weekdays')}</span>
                      <span className="font-semibold text-surface-foreground">{t('hours.weekdaysTime')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg">
                      <span className="text-surface-variant-foreground font-medium">{t('hours.saturday')}</span>
                      <span className="font-semibold text-surface-foreground">{t('hours.saturdayTime')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-high/50">
                      <span className="text-surface-variant-foreground font-medium">{t('hours.sunday')}</span>
                      <span className="font-semibold text-surface-foreground">{t('hours.sundayTime')}</span>
                    </div>
                    <div className="pt-2 border-t border-outline-variant bg-primary-container/20 p-3 rounded-lg mt-4">
                      <span className="text-sm text-primary font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t('hours.memberAccess')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
              className="hover-lift"
            >
              <Card className="elevation-2 border-outline-variant hover:elevation-3 transition-all duration-300 bg-surface-container">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-tertiary rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-tertiary-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{t('contact.title')}</p>
                      <p className="text-sm text-surface-variant-foreground font-normal">{t('contact.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors state-layer">
                    <div className="w-10 h-10 bg-tertiary-container rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-tertiary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-surface-foreground">{t('contact.phone')}</p>
                      <p className="text-xs text-surface-variant-foreground">{t('contact.phoneSubtitle')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-high/50 transition-colors state-layer">
                    <div className="w-10 h-10 bg-success-container rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-surface-foreground">{t('contact.email')}</p>
                      <p className="text-xs text-surface-variant-foreground">{t('contact.emailSubtitle')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transportation Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
              className="hover-lift"
            >
              <Card className="elevation-2 border-outline-variant hover:elevation-3 transition-all duration-300 bg-surface-container">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{t('transport.title')}</p>
                      <p className="text-sm text-surface-variant-foreground font-normal">{t('transport.subtitle')}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-high/50">
                    <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-surface-foreground">{t('transport.parking')}</p>
                      <p className="text-sm text-surface-variant-foreground">{t('transport.parkingDetails')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                      <Train className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-surface-foreground">{t('transport.metro')}</p>
                      <p className="text-sm text-surface-variant-foreground">{t('transport.metroDetails')}</p>
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