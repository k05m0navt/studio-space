import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';



const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  type: z.enum(['studio', 'coworking']),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  message: z.string().optional(),
});

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter by booking status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [studio, coworking]
 *         description: Filter by booking type
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by booking date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limit number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [studio, coworking]
 *             required:
 *               - name
 *               - email
 *               - date
 *               - type
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Time slot already booked
 */

// Public POST endpoint for creating bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Disallow coworking bookings if the service is disabled in settings
    if (validatedData.type === 'coworking') {
      const setting = await prisma.settings.findUnique({ where: { key: 'services.coworking.enabled' } });
      const coworkingEnabled = setting?.value !== undefined ? setting.value === 'true' : true;
      if (!coworkingEnabled) {
        return NextResponse.json({ error: 'api.errors.coworkingDisabled' }, { status: 400 });
      }
    }

    // Check for conflicting bookings (same type, date, and overlapping time)
    const bookingDate = new Date(validatedData.date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        type: validatedData.type,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['pending', 'confirmed'],
        },
        start_time: validatedData.start_time || undefined,
        end_time: validatedData.end_time || undefined,
      },
    });

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { 
          error: 'api.errors.timeSlotBooked',
          message: 'api.messages.timeSlotUnavailable',
        },
        { status: 409 }
      );
    }

    // Compute amount based on service rate and duration
    // Parse start/end times like '09:00'
    let amount: string | undefined = undefined;
    let currency: string | undefined = undefined;
    try {
      const rateSetting = await prisma.settings.findUnique({ where: { key: `services.${validatedData.type}.price` } });
      const currencySetting = await prisma.settings.findUnique({ where: { key: `services.${validatedData.type}.currency` } });
      const rate = rateSetting?.value ? Number(rateSetting.value) : 0;
      currency = currencySetting?.value ?? 'RUB';

      if (validatedData.start_time && validatedData.end_time) {
        const [sh, sm] = validatedData.start_time.split(':').map(Number);
        const [eh, em] = validatedData.end_time.split(':').map(Number);
        const start = new Date();
        start.setHours(sh, sm, 0, 0);
        const end = new Date();
        end.setHours(eh, em, 0, 0);
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.max(0, diffMs / (1000 * 60 * 60));
        const computed = Number((rate * hours).toFixed(2));
        amount = String(computed);
      }
    } catch (err) {
      console.error('Failed to compute amount from settings:', err);
    }

    // Create booking without writing amount/currency to avoid DB schema drift issues
    let booking;
    try {
      booking = await prisma.booking.create({
        data: {
          ...validatedData,
          date: new Date(validatedData.date),
          amount: amount ?? undefined,
          currency: currency ?? 'RUB',
        },
      });
    } catch (dbErr) {
      console.error('Prisma create booking error:', dbErr);
      return NextResponse.json(
        { error: 'api.errors.internalServerError', message: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Optionally include payment link information in the response (not persisted to DB)
    const paymentBase = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://payments.example.com';
    let paymentUrl: string | undefined = undefined;
    if (paymentBase) {
      const params = new URLSearchParams({ bookingId: String(booking.id) });
      if (amount) params.set('amount', String(amount));
      if (currency) params.set('currency', currency);
      paymentUrl = `${paymentBase.replace(/\/$/, '')}/pay?${params.toString()}`;
    }

    const responseBody = {
      ...booking,
      paymentUrl,
      amount: amount ?? null,
      currency: currency ?? null,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
      { error: 'api.errors.validation', details: error.errors },
      { status: 400 }
    );
    }

    console.error('Create booking error:', error);
    const message = (error && (error as any).message) ? (error as any).message : 'Internal server error';
    return NextResponse.json(
      { error: 'api.errors.internalServerError', message },
      { status: 500 }
    );
  }
}

// Protected GET endpoint for listing bookings
export const GET = requireRole(['ADMIN', 'MODERATOR'])(async ({ request }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: {
      status?: string;
      type?: string;
      date?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (date) {
      const bookingDate = new Date(date);
      const startOfDay = new Date(bookingDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(limit, 100),
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return new Response(
      JSON.stringify({
        bookings,
        total,
        page: currentPage,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get bookings error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}); 