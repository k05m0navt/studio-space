"use client";

import { motion } from "framer-motion";
import { Check, Calendar, Mail, Phone, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function BookingSuccessPage() {
  const t = useTranslations('bookingSuccess');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200, 
                damping: 10 
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t('description')}
              </p>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">{t('whatNext')}</h2>
              <div className="space-y-4 text-left">
                {[
                  {
                    icon: Mail,
                    title: t('steps.email.title'),
                    description: t('steps.email.description')
                  },
                  {
                    icon: Phone,
                    title: t('steps.phone.title'),
                    description: t('steps.phone.description')
                  },
                  {
                    icon: Calendar,
                    title: t('steps.calendar.title'),
                    description: t('steps.calendar.description')
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link href="/">
                  <Home className="w-4 h-4" />
                  {t('buttons.home')}
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2">
                <Link href="/book">
                  {t('buttons.anotherBooking')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 pt-6 border-t border-muted"
            >
              <p className="text-sm text-muted-foreground">
                {t('contact.questions')}{" "}
                <a 
                  href={`mailto:${t('contact.email')}`}
                  className="text-primary hover:underline"
                >
                  {t('contact.email')}
                </a>{" "}
                or{" "}
                <a 
                  href={`tel:${t('contact.phone')}`}
                  className="text-primary hover:underline"
                >
                  {t('contact.phone')}
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 