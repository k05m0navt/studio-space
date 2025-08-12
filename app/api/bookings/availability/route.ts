import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');

    if (!date || !type) {
      return NextResponse.json(
        { error: 'Date and type parameters are required' },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all confirmed bookings for the date and type
    const existingBookings = await prisma.booking.findMany({
      where: {
        type,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['pending', 'confirmed'],
        },
      },
      select: {
        start_time: true,
        end_time: true,
      },
    });

    // Create list of unavailable time slots
    const unavailableSlots: string[] = [];
    
    existingBookings.forEach(booking => {
      if (booking.start_time && booking.end_time) {
        // Mark all time slots between start and end as unavailable
        const startHour = parseInt(booking.start_time.split(':')[0]);
        const endHour = parseInt(booking.end_time.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
          unavailableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      }
    });

    return NextResponse.json({
      date: bookingDate,
      type,
      unavailableSlots: [...new Set(unavailableSlots)], // Remove duplicates
      availableSlots: getAvailableSlots(unavailableSlots),
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getAvailableSlots(unavailableSlots: string[]): string[] {
  const allSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  return allSlots.filter(slot => !unavailableSlots.includes(slot));
} 