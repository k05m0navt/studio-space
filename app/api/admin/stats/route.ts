import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

let _statsCache: { data: any; expiresAt: number } | null = null;

export const GET = requireRole(['ADMIN'])(async () => {
  try {
    const now = Date.now();
    if (_statsCache && _statsCache.expiresAt > now) {
      return new Response(JSON.stringify(_statsCache.data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const t0 = Date.now();

    // Run all counts/aggregates in parallel for optimal performance
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      todayBookings,
      activeUsers,
      lastWeekBookings,
      twoWeeksAgoBookings,
      // counts used as fallback
      studioMonthlyCount,
      coworkingMonthlyCount,
      studioBookings,
      // aggregate sum for monthly revenue (may be null if amount not set)
      monthlyAmountAggregate
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      prisma.user.count(),
      prisma.booking.count({ where: { createdAt: { gte: sevenDaysAgo, lte: today } } }),
      prisma.booking.count({ where: { createdAt: { gte: fourteenDaysAgo, lte: sevenDaysAgo } } }),
      // Monthly counts (fallback for revenue calculation)
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth }, status: 'confirmed', type: 'studio' } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth }, status: 'confirmed', type: 'coworking' } }),
      prisma.booking.count({ where: { type: 'studio', status: 'confirmed' } }),
      // Use DB aggregate SUM(amount) when available for accurate revenue
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfMonth }, status: 'confirmed' }
      })
    ]);

    const weeklyGrowth = twoWeeksAgoBookings > 0
      ? ((lastWeekBookings - twoWeeksAgoBookings) / twoWeeksAgoBookings) * 100
      : 0;

    // Compute revenue preferring SUM(amount) aggregate if available, otherwise fall back to per-type pricing
    let monthlyRevenue = 0;
    const sumAmount = monthlyAmountAggregate?._sum?.amount;
    if (sumAmount !== null && sumAmount !== undefined) {
      // Prisma Decimal -> string/number
      monthlyRevenue = Number(String(sumAmount));
    } else {
      monthlyRevenue = studioMonthlyCount * 150 + coworkingMonthlyCount * 50;
    }

    const queryTime = Date.now() - t0;
    console.info(`Admin stats: queries completed in ${queryTime}ms`);

    const result = {
      totalBookings,
      monthlyRevenue,
      activeMembers: activeUsers,
      studioUtilization: totalBookings > 0 ? (studioBookings / totalBookings) * 100 : 0,
      pendingBookings,
      confirmedBookings,
      todayBookings,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10
    };
    _statsCache = { data: result, expiresAt: Date.now() + 30 * 1000 };
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 