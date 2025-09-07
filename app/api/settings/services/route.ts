import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const BUCKET = 'service-images';

// Schema
const ServiceSchema = z.object({
  enabled: z.boolean().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  unit: z.string().optional(),
  address: z.string().optional(),
  images: z.array(z.string()).optional(),
});
const ServiceConfigSchema = z.object({
  studio: ServiceSchema.optional(),
  coworking: ServiceSchema.optional(),
});

// Defaults
const DEFAULT = {
  studio: { enabled: true, price: 0, currency: 'USD', unit: 'hour', address: '', images: [] as string[] },
  coworking: { enabled: true, price: 0, currency: 'USD', unit: 'hour', address: '', images: [] as string[] },
};

const ALLOWED_CURRENCIES = ['USD','EUR','GBP','UAH'];
const ALLOWED_UNITS = ['hour','half-day','day'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

async function getSettingValue(key: string) {
  return prisma.settings.findUnique({ where: { key } });
}

function publicUrlForPath(supabase: ReturnType<typeof createSupabaseClient>, path: string) {
  try {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl ?? null;
  } catch (err) {
    return null;
  }
}

/**
 * GET - return config, convert stored image paths to public URLs
 */
export async function GET() {
  try {
    const supabase = createSupabaseClient();

    const keys = [
      'services.studio.enabled',
      'services.studio.price',
      'services.studio.currency',
      'services.studio.unit',
      'services.studio.address',
      'services.studio.images',
      'services.coworking.enabled',
      'services.coworking.price',
      'services.coworking.currency',
      'services.coworking.unit',
      'services.coworking.address',
      'services.coworking.images',
    ];

    const results = await Promise.all(keys.map(k => getSettingValue(k)));

    const read = (serviceKey: 'studio' | 'coworking', offsets: { enabled: number; price: number; currency: number; unit: number; address: number; images: number }, startIndex: number) => {
      const idxBase = startIndex;
      const enabledRaw = results[idxBase + offsets.enabled]?.value;
      const enabled = enabledRaw !== undefined ? enabledRaw === 'true' : DEFAULT[serviceKey].enabled;
      const priceRaw = results[idxBase + offsets.price]?.value;
      const price = priceRaw ? Number(priceRaw) : DEFAULT[serviceKey].price;
      const currency = results[idxBase + offsets.currency]?.value ?? DEFAULT[serviceKey].currency;
      const unit = results[idxBase + offsets.unit]?.value ?? DEFAULT[serviceKey].unit;
      const address = results[idxBase + offsets.address]?.value ?? DEFAULT[serviceKey].address;
      const imagesRaw = results[idxBase + offsets.images]?.value;
      let imagesPaths: string[] = [];
      try { imagesPaths = imagesRaw ? JSON.parse(imagesRaw) : []; } catch { imagesPaths = []; }

      const imagesPublic = imagesPaths.map(p => publicUrlForPath(supabase, p)).filter(Boolean) as string[];

      return { enabled, price, currency, unit, address, images: imagesPublic };
    };

    const studio = read('studio', { enabled: 0, price: 1, currency: 2, unit: 3, address: 4, images: 5 }, 0);
    const coworking = read('coworking', { enabled: 6, price: 7, currency: 8, unit: 9, address: 10, images: 11 }, 0);

    return NextResponse.json({ success: true, data: { studio, coworking } });
  } catch (error) {
    console.error('Error fetching service settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch service settings' }, { status: 500 });
  }
}

/**
 * PUT - update service configuration (admin only)
 * Accepts partial values; will upsert keys for enabled/price/currency/unit/address/images
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const validated = ServiceConfigSchema.partial().parse(body);

    // validate currencies/units if present
    if (validated.studio) {
      if (validated.studio.currency && !ALLOWED_CURRENCIES.includes(validated.studio.currency)) {
        return NextResponse.json({ success: false, error: 'Invalid currency for studio' }, { status: 400 });
      }
      if (validated.studio.unit && !ALLOWED_UNITS.includes(validated.studio.unit)) {
        return NextResponse.json({ success: false, error: 'Invalid unit for studio' }, { status: 400 });
      }
    }
    if (validated.coworking) {
      if (validated.coworking.currency && !ALLOWED_CURRENCIES.includes(validated.coworking.currency)) {
        return NextResponse.json({ success: false, error: 'Invalid currency for coworking' }, { status: 400 });
      }
      if (validated.coworking.unit && !ALLOWED_UNITS.includes(validated.coworking.unit)) {
        return NextResponse.json({ success: false, error: 'Invalid unit for coworking' }, { status: 400 });
      }
    }

    const upserts: Promise<any>[] = [];
    const upsertKey = (key: string, value: string, type = 'string') => {
      upserts.push(prisma.settings.upsert({
        where: { key },
        update: { value, type, group: 'services', updatedAt: new Date() },
        create: { key, value, type, group: 'services', isPublic: false },
      }));
    };

    if (validated.studio) {
      if (validated.studio.enabled !== undefined) upsertKey('services.studio.enabled', String(validated.studio.enabled), 'boolean');
      if (validated.studio.price !== undefined) upsertKey('services.studio.price', String(validated.studio.price), 'number');
      if (validated.studio.currency !== undefined) upsertKey('services.studio.currency', String(validated.studio.currency ?? ''), 'string');
      if (validated.studio.unit !== undefined) upsertKey('services.studio.unit', String(validated.studio.unit ?? ''), 'string');
      if (validated.studio.address !== undefined) upsertKey('services.studio.address', validated.studio.address ?? '', 'string');
      if (validated.studio.images !== undefined) upsertKey('services.studio.images', JSON.stringify(validated.studio.images ?? []), 'json');
    }

    if (validated.coworking) {
      if (validated.coworking.enabled !== undefined) upsertKey('services.coworking.enabled', String(validated.coworking.enabled), 'boolean');
      if (validated.coworking.price !== undefined) upsertKey('services.coworking.price', String(validated.coworking.price), 'number');
      if (validated.coworking.currency !== undefined) upsertKey('services.coworking.currency', String(validated.coworking.currency ?? ''), 'string');
      if (validated.coworking.unit !== undefined) upsertKey('services.coworking.unit', String(validated.coworking.unit ?? ''), 'string');
      if (validated.coworking.address !== undefined) upsertKey('services.coworking.address', validated.coworking.address ?? '', 'string');
      if (validated.coworking.images !== undefined) upsertKey('services.coworking.images', JSON.stringify(validated.coworking.images ?? []), 'json');
    }

    await Promise.all(upserts);

    // Broadcast settings update to subscribed clients (Supabase Realtime)
    try {
      const supabase = createServerSupabaseClient();
      // send partial validated payload; clients should merge
      await supabase.channel('settings').send({ type: 'broadcast', event: 'service-config.updated', payload: { data: validated } });
    } catch (err) {
      console.error('Failed to broadcast service settings update:', err);
    }

    return NextResponse.json({ success: true, message: 'Service settings updated', data: validated });
  } catch (error) {
    console.error('Error updating service settings:', error);
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: 'Invalid service configuration', details: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Failed to update service settings' }, { status: 500 });
  }
}

/**
 * POST - upload image for a service (multipart/form-data)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) return NextResponse.json({ success: false, error: 'Expected multipart/form-data' }, { status: 400 });

    const form = await request.formData();
    const service = form.get('service') as string;
    const file = form.get('file') as unknown as File;

    if (!service || !['studio', 'coworking'].includes(service)) return NextResponse.json({ success: false, error: 'Invalid service' }, { status: 400 });
    if (!file || typeof (file as any).arrayBuffer !== 'function') return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });

    // Validate file type and size
    const mime = (file as any).type || '';
    const size = (file as any).size || 0;
    if (!mime.startsWith('image/')) return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    if (size > MAX_UPLOAD_BYTES) return NextResponse.json({ success: false, error: 'File too large' }, { status: 400 });

    const supabase = createSupabaseClient();
    const arrayBuffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${(file as any).name || 'upload'}`;
    const path = `${service}/${filename}`;
    const uploadRes = await supabase.storage.from(BUCKET).upload(path, new Uint8Array(arrayBuffer), { contentType: (file as any).type || undefined });

    if (uploadRes.error) {
      console.error('Supabase upload error', uploadRes.error);
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }

    const settingKey = `services.${service}.images`;
    const existingSetting = await prisma.settings.findUnique({ where: { key: settingKey } });
    let imagesPaths: string[] = [];
    try { imagesPaths = existingSetting?.value ? JSON.parse(existingSetting.value) : []; } catch { imagesPaths = []; }
    imagesPaths.push(path);

    await prisma.settings.upsert({ where: { key: settingKey }, update: { value: JSON.stringify(imagesPaths), type: 'json', group: 'services', updatedAt: new Date() }, create: { key: settingKey, value: JSON.stringify(imagesPaths), type: 'json', group: 'services', isPublic: false } });

    const publicUrls = imagesPaths.map(p => publicUrlForPath(supabase, p)).filter(Boolean) as string[];

    return NextResponse.json({ success: true, data: { images: publicUrls, paths: imagesPaths } });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}

/**
 * DELETE - remove an image by public URL (body: { service, url })
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { service, url } = body as { service?: string; url?: string };

    if (!service || !['studio', 'coworking'].includes(service) || !url) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });

    const supabase = createSupabaseClient();
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return NextResponse.json({ success: false, error: 'Cannot resolve storage path from url' }, { status: 400 });
    const path = url.substring(idx + marker.length);

    const del = await supabase.storage.from(BUCKET).remove([path]);
    if (del.error) console.error('Supabase delete error', del.error);

    const settingKey = `services.${service}.images`;
    const existingSetting = await prisma.settings.findUnique({ where: { key: settingKey } });
    let imagesPaths: string[] = [];
    try { imagesPaths = existingSetting?.value ? JSON.parse(existingSetting.value) : []; } catch { imagesPaths = []; }
    const updated = imagesPaths.filter(p => p !== path);
    await prisma.settings.upsert({ where: { key: settingKey }, update: { value: JSON.stringify(updated), type: 'json', group: 'services', updatedAt: new Date() }, create: { key: settingKey, value: JSON.stringify(updated), type: 'json', group: 'services', isPublic: false } });

    const publicUrls = updated.map(p => publicUrlForPath(supabase, p)).filter(Boolean) as string[];

    return NextResponse.json({ success: true, data: { images: publicUrls, paths: updated } });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
