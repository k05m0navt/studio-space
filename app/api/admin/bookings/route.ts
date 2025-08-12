
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const GET = requireRole(['ADMIN'])(async () => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" }
    });

    return new Response(JSON.stringify({ bookings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch bookings" }),
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
      JSON.stringify({ error: "Failed to create booking" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 