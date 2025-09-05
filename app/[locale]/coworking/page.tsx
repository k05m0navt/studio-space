import { prisma } from '@/lib/prisma';

export default async function CoworkingPage({ params }: { params: { locale: string } }) {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'services.coworking.enabled' } });
    const enabled = setting ? setting.value === 'true' : true;
    if (!enabled) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold mb-4">Service unavailable</h1>
            <p className="text-muted-foreground">This section is currently disabled by the administrator.</p>
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