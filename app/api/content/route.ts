import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient, ContentType } from '@/app/generated/prisma';
import { requireRole } from '@/lib/auth';

const prisma = new PrismaClient();

const contentSchema = z.object({
  type: z.nativeEnum(ContentType),
  key: z.string().min(1, 'Key is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().min(1, 'Description is required'),
  locale: z.string().default('en'),
  isActive: z.boolean().default(true),
  metadata: z.any().optional(),
  order: z.number().optional(),
});

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all content
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by content type
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Filter by locale
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of content items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   key:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   description:
 *                     type: string
 *                   locale:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   metadata:
 *                     type: object
 *                   order:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [PAGE, BLOG_POST, ANNOUNCEMENT, HERO_SECTION, FEATURE, TESTIMONIAL, SERVICE]
 *               key:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               locale:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// Public GET endpoint for content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const where: {
      type?: ContentType;
      published?: boolean;
      isActive?: boolean;
      title?: {
        contains: string;
        mode: 'insensitive';
      };
    } = {};
    
    if (type && Object.values(ContentType).includes(type as ContentType)) {
      where.type = type as ContentType;
    }
    
    if (active !== null) {
      where.isActive = active === 'true';
    }

    const content = await prisma.content.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Protected POST endpoint for creating content
export const POST = requireRole(['ADMIN', 'MODERATOR'])(async ({ user, request }) => {
  try {
    const body = await request.json();
    const validatedData = contentSchema.parse(body);

    const content = await prisma.content.create({
      data: {
        ...validatedData,
        createdBy: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify(content),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.error('Create content error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}); 