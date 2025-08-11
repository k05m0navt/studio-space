import { Check, Calendar, Mail, Phone, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

// Add metadata export for better SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookingSuccess' });
  
  return {
    title: `${t('title')} | Vasha Studio`,
    description: t('description'),
  };
}

export default async function BookingSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookingSuccess' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl opacity-0 animate-fade-in-up"
        style={{ 
          animation: 'fadeInUp 0.5s ease-out forwards',
          animationDelay: '0.1s'
        }}
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 opacity-0 animate-scale-in"
              style={{ 
                animation: 'scaleIn 0.5s ease-out forwards',
                animationDelay: '0.3s'
              }}
            >
              <Check className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <div
              className="opacity-0 animate-fade-in-up"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.4s'
              }}
            >
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t('description')}
              </p>
            </div>

            {/* What Happens Next */}
            <div
              className="bg-muted/50 rounded-lg p-6 mb-8 opacity-0 animate-fade-in-up"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.5s'
              }}
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
                  <div
                    key={step.title}
                    className="flex items-start gap-4 opacity-0 animate-fade-in-left"
                    style={{ 
                      animation: 'fadeInLeft 0.3s ease-out forwards',
                      animationDelay: `${0.6 + index * 0.1}s`
                    }}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.7s'
              }}
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
            </div>

            {/* Contact Info */}
            <div
              className="mt-8 pt-6 border-t border-muted opacity-0 animate-fade-in"
              style={{ 
                animation: 'fadeIn 0.5s ease-out forwards',
                animationDelay: '0.8s'
              }}
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
            </div>
          </CardContent>
        </Card>
      </div>
      

    </div>
  );
} 