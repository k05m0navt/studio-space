import { prisma } from '@/lib/prisma';
import React from 'react';
import { getMessages } from 'next-intl/server';

export default async function StudioPage(props: any) {
  const { params } = props as { params: { locale: string } };
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'services.studio.enabled' } });
    const enabled = setting ? setting.value === 'true' : true;
    if (!enabled) {
      const messages = await getMessages({ locale: params.locale });
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold mb-4">{messages['studio.serviceUnavailable.title']}</h1>
            <p className="text-muted-foreground">{messages['studio.serviceUnavailable.description']}</p>
          </div>
        </div>
      );
    }
  } catch (err) {
    console.error('Error checking studio setting:', err);
  }

  const { default: StudioClient } = await import('./StudioClient');
  return <StudioClient />;
} 