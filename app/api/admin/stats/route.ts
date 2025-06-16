import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get current date
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    
    // Get the date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get the date for 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    // Get the date for the start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // For weekly growth calculation (difference between last week and the week before)
    const [totalBookings, pendingBookings, confirmedBookings, todayBookings, activeUsers, 
           lastWeekBookings, twoWeeksAgoBookings] = await Promise.all([
      // Total bookings
      prisma.booking.count(),
      
      // Pending bookings
      prisma.booking.count({ where: { status: 'pending' } }),
      
      // Confirmed bookings
      prisma.booking.count({ where: { status: 'confirmed' } }),
      
      // Today's bookings
      prisma.booking.count({ 
        where: { 
          createdAt: { 
            gte: startOfToday, 
            lte: endOfToday 
          } 
        } 
      }),
      
      // Active users
      prisma.user.count({ where: { isActive: true } }),
      
      // Last week bookings
      prisma.booking.count({ 
        where: { 
          createdAt: { 
            gte: sevenDaysAgo, 
            lte: today 
          } 
        } 
      }),
      
      // Two weeks ago bookings
      prisma.booking.count({ 
        where: { 
          createdAt: { 
            gte: fourteenDaysAgo, 
            lte: sevenDaysAgo 
          } 
        } 
      }),
    ]);
    
    // Calculate weekly growth percentage
    const weeklyGrowth = twoWeeksAgoBookings > 0 
      ? ((lastWeekBookings - twoWeeksAgoBookings) / twoWeeksAgoBookings) * 100
      : 0;
    
    // Get monthly revenue - assuming there's a price field or estimating based on booking type
    const monthlyBookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: 'confirmed'
      }
    });
    
    // Calculate studio utilization - simplified version
    const studioBookings = await prisma.booking.count({
      where: { 
        type: 'studio',
        status: 'confirmed'
      }
    });
    
    const studioUtilization = totalBookings > 0 
      ? (studioBookings / totalBookings) * 100 
      : 0;
      
    // Calculate monthly revenue (simplified - assuming average prices)
    const monthlyRevenue = monthlyBookings.reduce((total, booking) => {
      // Simplified price calculation
      const price = booking.type === 'studio' ? 150 : 50;
      return total + price;
    }, 0);
    
    return NextResponse.json({
      totalBookings,
      monthlyRevenue,
      activeMembers: activeUsers,
      studioUtilization: Math.round(studioUtilization),
      pendingBookings,
      confirmedBookings,
      todayBookings,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
} 