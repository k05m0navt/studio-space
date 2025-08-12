import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const GET = requireRole(['ADMIN'])(async () => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalBookings, pendingBookings, confirmedBookings, todayBookings, activeUsers,
      lastWeekBookings, twoWeeksAgoBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      prisma.user.count(),
      prisma.booking.count({ where: { createdAt: { gte: sevenDaysAgo, lte: today } } }),
      prisma.booking.count({ where: { createdAt: { gte: fourteenDaysAgo, lte: sevenDaysAgo } } }),
    ]);

    const weeklyGrowth = twoWeeksAgoBookings > 0
      ? ((lastWeekBookings - twoWeeksAgoBookings) / twoWeeksAgoBookings) * 100
      : 0;

    const monthlyBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: startOfMonth }, status: 'confirmed' }
    });

    const studioBookings = await prisma.booking.count({
      where: { type: 'studio', status: 'confirmed' }
    });

    const studioUtilization = totalBookings > 0 ? (studioBookings / totalBookings) * 100 : 0;

    const monthlyRevenue = monthlyBookings.reduce((total, booking) => {
      const price = booking.type === 'studio' ? 150 : 50;
      return total + price;
    }, 0);

    return new Response(JSON.stringify({
      totalBookings,
      monthlyRevenue,
      activeMembers: activeUsers,
      studioUtilization: Math.round(studioUtilization),
      pendingBookings,
      confirmedBookings,
      todayBookings,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 