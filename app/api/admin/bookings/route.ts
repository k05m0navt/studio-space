
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const GET = requireRole(['ADMIN'])(async ({ user, request }) => {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '25')));
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          date: true,
          start_time: true,
          end_time: true,
          message: true,
          createdAt: true,
          updatedAt: true,
          type: true,
          status: true,
          userId: true,
        }
      }),
      prisma.booking.count()
    ]);

    return new Response(JSON.stringify({ bookings, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(
      JSON.stringify({ error: 'api.errors.failedToFetchBookings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

export const POST = requireRole(['ADMIN'])(async ({ request }) => {
  try {
    const data = await request.json();

    const booking = await prisma.booking.create({ data });

    return new Response(JSON.stringify({ booking }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(
      JSON.stringify({ error: 'api.errors.failedToCreateBooking' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 