import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Custom validation schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .transform(email => email.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .transform(phone => phone.replace(/\s+/g, ''));

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name too long')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters')
  .transform(name => name.trim().replace(/\s+/g, ' '));

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

// Rate limiting for different operations
export const rateLimits = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  booking: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 bookings per hour
  contact: { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 contacts per hour
};

// Booking validation schema
export const bookingValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  type: z.enum(['studio', 'coworking']),
  date: z.string().datetime(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  message: z.string().max(500, 'Message too long').optional()
    .transform(msg => msg ? sanitizeInput(msg) : undefined),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.start_time}`);
  const end = new Date(`2000-01-01T${data.end_time}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["end_time"],
}).refine((data) => {
  const bookingDate = new Date(data.date);
  const now = new Date();
  return bookingDate >= now;
}, {
  message: "Booking date cannot be in the past",
  path: ["date"],
});

// Admin creation schema
export const adminCreationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'MODERATOR']).default('MODERATOR'),
});

// Content validation schema
export const contentValidationSchema = z.object({
  title: z.string().min(1).max(200).transform(sanitizeInput),
  content: z.string().min(1).max(10000).transform(sanitizeHtml),
  description: z.string().min(1).max(500).transform(sanitizeInput),
  type: z.enum(['PAGE', 'BLOG_POST', 'ANNOUNCEMENT', 'HERO_SECTION', 'FEATURE', 'TESTIMONIAL', 'SERVICE']),
  locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale format').default('en'),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
  order: z.number().int().min(0).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain'
  ]),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
});

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1).max(100).transform(sanitizeInput),
  type: z.enum(['bookings', 'users', 'content']).optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// UUID validation
export const uuidSchema = z.string().uuid('Invalid ID format');

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
} 