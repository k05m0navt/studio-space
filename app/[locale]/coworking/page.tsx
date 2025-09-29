import { prisma } from '@/lib/prisma';
import { getMessages } from 'next-intl/server';
import React from 'react';

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function CoworkingPage(props: PageProps) {
  const params = await props.params;
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'services.coworking.enabled' } });
    const enabled = setting ? setting.value === 'true' : true;
    if (!enabled) {
      const messages = await getMessages({ locale: params.locale });
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold mb-4">{messages['coworking.serviceUnavailable.title']}</h1>
            <p className="text-muted-foreground">{messages['coworking.serviceUnavailable.description']}</p>
          </div>
        </div>
      );
    }
  } catch (err) {
    console.error('Error checking coworking setting:', err);
  }

  const { default: CoworkingClient } = await import('./CoworkingClient');
  return <CoworkingClient />;
} 