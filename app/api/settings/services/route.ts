import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Service configuration schema
const ServiceConfigSchema = z.object({
  studio: z.object({
    enabled: z.boolean(),
  }),
  coworking: z.object({
    enabled: z.boolean(),
  }),
});

// Default service configuration
const DEFAULT_SERVICE_CONFIG = {
  studio: { enabled: true },
  coworking: { enabled: true },
};

/**
 * GET /api/settings/services
 * Retrieve current service configuration
 */
export async function GET() {
  try {
    // Get service settings from database
    const studioSetting = await prisma.settings.findUnique({
      where: { key: 'services.studio.enabled' }
    });
    
    const coworkingSetting = await prisma.settings.findUnique({
      where: { key: 'services.coworking.enabled' }
    });

    // Build configuration object with defaults
    const config = {
      studio: {
        enabled: studioSetting ? studioSetting.value === 'true' : DEFAULT_SERVICE_CONFIG.studio.enabled
      },
      coworking: {
        enabled: coworkingSetting ? coworkingSetting.value === 'true' : DEFAULT_SERVICE_CONFIG.coworking.enabled
      }
    };

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error fetching service settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/services
 * Update service configuration (Admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin role
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = ServiceConfigSchema.parse(body);

    // Update service settings in database
    const updatePromises = [
      prisma.settings.upsert({
        where: { key: 'services.studio.enabled' },
        update: {
          value: validatedData.studio.enabled.toString(),
          type: 'boolean',
          group: 'services',
          updatedAt: new Date(),
        },
        create: {
          key: 'services.studio.enabled',
          value: validatedData.studio.enabled.toString(),
          type: 'boolean',
          group: 'services',
          isPublic: false,
        },
      }),
      prisma.settings.upsert({
        where: { key: 'services.coworking.enabled' },
        update: {
          value: validatedData.coworking.enabled.toString(),
          type: 'boolean',
          group: 'services',
          updatedAt: new Date(),
        },
        create: {
          key: 'services.coworking.enabled',
          value: validatedData.coworking.enabled.toString(),
          type: 'boolean',
          group: 'services',
          isPublic: false,
        },
      }),
    ];

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Service settings updated successfully',
      data: validatedData,
    });
  } catch (error) {
    console.error('Error updating service settings:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service configuration',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update service settings' },
      { status: 500 }
    );
  }
}
