import { PrismaClient } from '@/app/generated/prisma';
import { requireRole } from '@/lib/auth';

const prisma = new PrismaClient();

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
export const POST = requireRole(['ADMIN', 'MODERATOR'])(async ({ request }) => {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return new Response(
        JSON.stringify({ error: 'Booking ID and status are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
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