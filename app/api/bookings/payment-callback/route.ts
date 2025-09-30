import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Payment callback/webhook endpoint
 * 
 * This endpoint is called by the payment provider when payment is completed.
 * It updates the booking status from 'pending' to 'confirmed'.
 * 
 * Expected payload:
 * {
 *   bookingId: string;
 *   status: 'success' | 'failed';
 *   transactionId?: string;
 *   paymentMethod?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { bookingId, status, transactionId, paymentMethod } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking status based on payment result
    if (status === 'success') {
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'confirmed',
          // Optionally store payment details in the message field or create a separate Payment model
          message: booking.message 
            ? `${booking.message}\n\nPayment confirmed: ${transactionId || 'N/A'}`
            : `Payment confirmed: ${transactionId || 'N/A'}`,
        },
      });

      return NextResponse.json({
        success: true,
        booking: updatedBooking,
        message: 'Booking confirmed successfully',
      });
    } else {
      // Payment failed - optionally mark as cancelled or keep pending
      return NextResponse.json({
        success: false,
        booking,
        message: 'Payment failed',
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing/verification
 * Allows manual status check of payment callback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return NextResponse.json(
      { error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error('Payment callback GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
