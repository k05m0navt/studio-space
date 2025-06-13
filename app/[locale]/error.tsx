'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{t('error')}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        {t('somethingWentWrong')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline"
          onClick={reset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('tryAgain')}
        </Button>
        
        <Button asChild className="flex items-center gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted rounded-md text-left max-w-2xl w-full overflow-auto">
          <h2 className="text-sm font-semibold mb-2">Error details:</h2>
          <pre className="text-xs whitespace-pre-wrap">
            {error.message}
            {error.stack && (
              <>
                <br />
                <br />
                {error.stack}
              </>
            )}
          </pre>
        </div>
      )}
    </div>
  );
} 