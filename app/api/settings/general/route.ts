import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const GeneralSettingsSchema = z.object({
  site: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  location: z
    .object({
      address: z.string().optional(),
      coords: z.array(z.number()).length(2).optional(),
    })
    .optional(),
});

async function getSetting(key: string) {
  const row = await prisma.settings.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function GET() {
  try {
    const keys = [
      'site.name',
      'site.description',
      'contact.email',
      'contact.phone',
      'location.address',
      'location.coords',
    ];

    const results = await Promise.all(keys.map(k => getSetting(k)));

    let coords: number[] | undefined;
    try {
      coords = results[5] ? JSON.parse(results[5]) : undefined;
    } catch {
      coords = undefined;
    }

    const payload = {
      site: {
        name: results[0] ?? undefined,
        description: results[1] ?? undefined,
      },
      contact: {
        email: results[2] ?? undefined,
        phone: results[3] ?? undefined,
      },
      location: {
        address: results[4] ?? undefined,
        coords,
      },
    };

    return NextResponse.json({ success: true, data: payload });
  } catch (err) {
    console.error('GET general settings error', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch general settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const validated = GeneralSettingsSchema.partial().parse(body);

    const upserts: Promise<any>[] = [];
    const upsertKey = (key: string, value: string, type = 'string') => {
      upserts.push(
        prisma.settings.upsert({
          where: { key },
          update: { value, type, group: 'general', updatedAt: new Date() },
          create: { key, value, type, group: 'general', isPublic: false },
        })
      );
    };

    if (validated.site) {
      if (validated.site.name !== undefined) upsertKey('site.name', String(validated.site.name), 'string');
      if (validated.site.description !== undefined) upsertKey('site.description', String(validated.site.description), 'string');
    }
    if (validated.contact) {
      if (validated.contact.email !== undefined) upsertKey('contact.email', String(validated.contact.email), 'string');
      if (validated.contact.phone !== undefined) upsertKey('contact.phone', String(validated.contact.phone), 'string');
    }
    if (validated.location) {
      if (validated.location.address !== undefined) upsertKey('location.address', String(validated.location.address), 'string');
      if (validated.location.coords !== undefined) upsertKey('location.coords', JSON.stringify(validated.location.coords), 'json');
    }

    await Promise.all(upserts);

    return NextResponse.json({ success: true, message: 'General settings updated', data: validated });
  } catch (err) {
    console.error('PUT general settings error', err);
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: 'Invalid payload', details: err.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Failed to update general settings' }, { status: 500 });
  }
}
