import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { invalidateStatsCache } from '@/lib/statsCache';

interface BookingData {
  id: string;
  name: string;
  email: string;
  type: string;
  date: Date;
  start_time: string | null;
  end_time: string | null;
  status: string;
}

// Protected endpoint for confirming bookings
export const POST = requireRole(['ADMIN', 'MODERATOR'])(async ({ user, request }) => {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    console.info('Bookings.confirm called by user:', { userId: user?.id, bookingId, status });

    if (!bookingId || !status) {
      return new Response(
        JSON.stringify({ error: 'Booking ID and status are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch existing booking to validate times/type before confirming
    const existing = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // If confirming, ensure no overlapping bookings exist for the same date/type
    if (status === 'confirmed') {
      const bookingDate = new Date(existing.date);
      const startOfDay = new Date(bookingDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Only perform overlap check if times are present
      if (existing.start_time && existing.end_time) {
        const conflicting = await prisma.booking.findMany({
          where: {
            id: { not: bookingId },
            type: existing.type,
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              in: ['pending', 'confirmed'],
            },
            AND: [
              { start_time: { lt: existing.end_time } },
              { end_time: { gt: existing.start_time } },
            ],
          },
        });

        if (conflicting.length > 0) {
          return new Response(
            JSON.stringify({ error: 'Booking time conflicts with an existing booking' }),
            { status: 409, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.info('Booking status updated:', { bookingId, status, updatedBookingId: updatedBooking?.id });

    // Invalidate stats cache so stats endpoint recomputes on next request
    try { invalidateStatsCache(); } catch (e) { console.warn('Failed to invalidate stats cache', e); }

    // Here you would integrate with an email service like Nodemailer, SendGrid, etc.
    // For now, we'll just simulate sending an email
    const emailContent = generateConfirmationEmail(updatedBooking, status);
    
    // TODO: Replace with actual email service integration
    console.log('Email would be sent:', emailContent);

    return new Response(
      JSON.stringify({ 
        message: 'Booking updated and notification sent',
        booking: updatedBooking 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Booking confirmation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

function generateConfirmationEmail(booking: BookingData, status: string) {
  const subject = status === 'confirmed' 
    ? `Booking Confirmed - ${booking.type} on ${new Date(booking.date).toLocaleDateString()}`
    : `Booking ${status} - ${booking.type} on ${new Date(booking.date).toLocaleDateString()}`;

  const body = `
    Dear ${booking.name},

    Your booking has been ${status}.

    Booking Details:
    - Service: ${booking.type}
    - Date: ${new Date(booking.date).toLocaleDateString()}
    - Time: ${booking.start_time} - ${booking.end_time}
    
    ${status === 'confirmed' 
      ? 'We look forward to seeing you at Vasha Studio!'
      : status === 'cancelled'
      ? 'If you have any questions, please contact us.'
      : ''
    }

    Best regards,
    Vasha Studio Team
  `;

  return {
    to: booking.email,
    subject,
    body,
  };
} 