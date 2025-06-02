import { prisma } from "@/lib/prisma";

// Types
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: Date;
  start_time?: string;
  end_time?: string;
  message?: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  tags: string[];
  isActive: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Booking API functions
export async function getBookings(params?: {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<Booking>> {
  try {
    const { status, type, page = 1, limit = 10, search } = params || {};
    
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);
    
    return {
      success: true,
      data: bookings as Booking[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      success: false,
      error: 'Failed to fetch bookings'
    };
  }
}

export async function createBooking(data: {
  name: string;
  email: string;
  phone?: string;
  date: Date;
  start_time?: string;
  end_time?: string;
  message?: string;
  type: string;
}): Promise<ApiResponse<Booking>> {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...data,
        status: 'pending'
      }
    });
    
    return {
      success: true,
      data: booking as Booking,
      message: 'Booking created successfully'
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: 'Failed to create booking'
    };
  }
}

export async function updateBookingStatus(
  id: string, 
  status: string
): Promise<ApiResponse<Booking>> {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    
    return {
      success: true,
      data: booking as Booking,
      message: `Booking ${status} successfully`
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      success: false,
      error: 'Failed to update booking'
    };
  }
}

export async function deleteBooking(id: string): Promise<ApiResponse<null>> {
  try {
    await prisma.booking.delete({
      where: { id }
    });
    
    return {
      success: true,
      message: 'Booking deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return {
      success: false,
      error: 'Failed to delete booking'
    };
  }
}

// Gallery API functions
export async function getGalleryItems(params?: {
  category?: string;
  isActive?: boolean;
  limit?: number;
}): Promise<ApiResponse<GalleryItem[]>> {
  try {
    const { category, isActive = true, limit } = params || {};
    
    const where: any = { isActive };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    const items = await prisma.gallery.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
    
    return {
      success: true,
      data: items as GalleryItem[]
    };
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return {
      success: false,
      error: 'Failed to fetch gallery items',
      data: []
    };
  }
}

// FAQ API functions
export async function getFAQs(params?: {
  category?: string;
  locale?: string;
  isActive?: boolean;
}): Promise<ApiResponse<FAQ[]>> {
  try {
    const { category, locale = 'en', isActive = true } = params || {};
    
    const where: any = { isActive, locale };
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    
    return {
      success: true,
      data: faqs as FAQ[]
    };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return {
      success: false,
      error: 'Failed to fetch FAQs',
      data: []
    };
  }
}

// User API functions
export async function getUsers(params?: {
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<User>> {
  try {
    const { role, page = 1, limit = 10, search } = params || {};
    
    const where: any = {};
    
    if (role && role !== 'all') {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      success: true,
      data: users as User[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: 'Failed to fetch users'
    };
  }
}

// Dashboard stats
export async function getDashboardStats(): Promise<ApiResponse<{
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
  thisMonthBookings: number;
  activeUsers: number;
  totalUsers: number;
  studioBookings: number;
  coworkingBookings: number;
}>> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      todayBookings,
      thisMonthBookings,
      totalUsers,
      studioBookings,
      coworkingBookings
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.count({ 
        where: { 
          date: { gte: startOfDay } 
        } 
      }),
      prisma.booking.count({ 
        where: { 
          createdAt: { gte: startOfMonth } 
        } 
      }),
      prisma.user.count(),
      prisma.booking.count({ where: { type: 'studio' } }),
      prisma.booking.count({ where: { type: 'coworking' } })
    ]);
    
    return {
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        todayBookings,
        thisMonthBookings,
        activeUsers: totalUsers, // Simplified for now
        totalUsers,
        studioBookings,
        coworkingBookings
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard stats'
    };
  }
}

// Check booking availability
export async function checkAvailability(
  date: Date,
  startTime: string,
  endTime: string,
  type: string
): Promise<ApiResponse<{ available: boolean; conflictingBookings?: Booking[] }>> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        type,
        status: { not: 'cancelled' },
        OR: [
          {
            AND: [
              { start_time: { lte: startTime } },
              { end_time: { gt: startTime } }
            ]
          },
          {
            AND: [
              { start_time: { lt: endTime } },
              { end_time: { gte: endTime } }
            ]
          },
          {
            AND: [
              { start_time: { gte: startTime } },
              { end_time: { lte: endTime } }
            ]
          }
        ]
      }
    });
    
    return {
      success: true,
      data: {
        available: conflictingBookings.length === 0,
        conflictingBookings: conflictingBookings as Booking[]
      }
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return {
      success: false,
      error: 'Failed to check availability'
    };
  }
} 