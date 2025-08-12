import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Home, Search } from 'lucide-react';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params?: { locale?: string } }) {
  const locale = params?.locale || routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: `${t('pageNotFound')} | Vasha Studio`,
    description: t('pageNotFoundDescription'),
  };
}

export default async function NotFound({ params }: { params?: { locale?: string } }) {
  // Default to the default locale if params are undefined
  const locale = params?.locale || routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      
      <h2 className="text-3xl font-bold mb-2">
        {t('pageNotFound')}
      </h2>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        {t('pageNotFoundDescription')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/search">
            <Search className="w-4 h-4" />
            {t('search')}
          </Link>
        </Button>
        
        <Button asChild className="flex items-center gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
} 