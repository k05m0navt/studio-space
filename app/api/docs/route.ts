import { NextRequest, NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vasha Studio API',
      version: '1.0.0',
      description: 'A comprehensive API for managing Vasha Studio bookings, content, and user interactions',
      contact: {
        name: 'Vasha Studio Team',
        email: 'api@vashastudio.com',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Vasha Studio API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN', 'MODERATOR'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
          },
        },
        Content: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique content identifier',
            },
            type: {
              type: 'string',
              enum: ['PAGE', 'BLOG_POST', 'ANNOUNCEMENT', 'HERO_SECTION', 'FEATURE', 'TESTIMONIAL', 'SERVICE'],
              description: 'Content type',
            },
            key: {
              type: 'string',
              description: 'Unique content key for identification',
            },
            title: {
              type: 'string',
              description: 'Content title',
            },
            content: {
              type: 'string',
              description: 'Main content body',
            },
            description: {
              type: 'string',
              description: 'Content description or excerpt',
            },
            locale: {
              type: 'string',
              description: 'Content language locale',
              default: 'en',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether content is active/published',
            },
            metadata: {
              type: 'object',
              description: 'Additional content metadata',
            },
            order: {
              type: 'number',
              description: 'Content display order',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Content creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique booking identifier',
            },
            name: {
              type: 'string',
              description: 'Customer name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email',
            },
            phone: {
              type: 'string',
              description: 'Customer phone number',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Booking date',
            },
            start_time: {
              type: 'string',
              description: 'Booking start time',
            },
            end_time: {
              type: 'string',
              description: 'Booking end time',
            },
            message: {
              type: 'string',
              description: 'Additional booking message',
            },
            type: {
              type: 'string',
              enum: ['studio', 'coworking'],
              description: 'Booking type',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled'],
              description: 'Booking status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Booking creation date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Detailed error information',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Content',
        description: 'Content management operations',
      },
      {
        name: 'Bookings',
        description: 'Studio and coworking space bookings',
      },
    ],
    paths: {
      '/api/auth': {
        post: {
          tags: ['Authentication'],
          summary: 'User authentication',
          description: 'Authenticate user with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'User email address',
                    },
                    password: {
                      type: 'string',
                      description: 'User password',
                    },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Authentication successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        description: 'JWT authentication token',
                      },
                      user: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Authentication failed',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/content': {
        get: {
          tags: ['Content'],
          summary: 'Get content list',
          description: 'Retrieve paginated list of content with filtering options',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number for pagination',
              schema: {
                type: 'integer',
                default: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of items per page',
              schema: {
                type: 'integer',
                default: 10,
              },
            },
            {
              name: 'type',
              in: 'query',
              description: 'Filter by content type',
              schema: {
                type: 'string',
                enum: ['PAGE', 'BLOG_POST', 'ANNOUNCEMENT', 'HERO_SECTION', 'FEATURE', 'TESTIMONIAL', 'SERVICE'],
              },
            },
            {
              name: 'locale',
              in: 'query',
              description: 'Filter by locale',
              schema: {
                type: 'string',
                default: 'en',
              },
            },
          ],
          responses: {
            200: {
              description: 'Content list retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      content: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Content',
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: {
                            type: 'integer',
                          },
                          limit: {
                            type: 'integer',
                          },
                          total: {
                            type: 'integer',
                          },
                          totalPages: {
                            type: 'integer',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Content'],
          summary: 'Create new content',
          description: 'Create a new content item (requires admin privileges)',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['PAGE', 'BLOG_POST', 'ANNOUNCEMENT', 'HERO_SECTION', 'FEATURE', 'TESTIMONIAL', 'SERVICE'],
                    },
                    key: {
                      type: 'string',
                    },
                    title: {
                      type: 'string',
                    },
                    content: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                    locale: {
                      type: 'string',
                      default: 'en',
                    },
                    isActive: {
                      type: 'boolean',
                      default: true,
                    },
                    metadata: {
                      type: 'object',
                    },
                    order: {
                      type: 'number',
                    },
                  },
                  required: ['type', 'key', 'title', 'content'],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Content created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Content',
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            403: {
              description: 'Insufficient privileges',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'Get bookings list',
          description: 'Retrieve list of bookings with optional filtering (requires authentication)',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number for pagination',
              schema: {
                type: 'integer',
                default: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of bookings per page',
              schema: {
                type: 'integer',
                default: 10,
              },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by booking status',
              schema: {
                type: 'string',
                enum: ['pending', 'confirmed', 'cancelled'],
              },
            },
            {
              name: 'type',
              in: 'query',
              description: 'Filter by booking type',
              schema: {
                type: 'string',
                enum: ['studio', 'coworking'],
              },
            },
          ],
          responses: {
            200: {
              description: 'Bookings retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      bookings: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Booking',
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: {
                            type: 'integer',
                          },
                          limit: {
                            type: 'integer',
                          },
                          total: {
                            type: 'integer',
                          },
                          totalPages: {
                            type: 'integer',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Bookings'],
          summary: 'Create new booking',
          description: 'Create a new studio or coworking space booking',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    phone: {
                      type: 'string',
                    },
                    date: {
                      type: 'string',
                      format: 'date-time',
                    },
                    start_time: {
                      type: 'string',
                    },
                    end_time: {
                      type: 'string',
                    },
                    message: {
                      type: 'string',
                    },
                    type: {
                      type: 'string',
                      enum: ['studio', 'coworking'],
                    },
                  },
                  required: ['name', 'email', 'date', 'start_time', 'end_time', 'type'],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Booking created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Booking',
                  },
                },
              },
            },
            400: {
              description: 'Validation error or time conflict',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'json') {
    const spec = swaggerJsdoc(options);
    return NextResponse.json(spec);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en" class="">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vasha Studio API Documentation</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <style>
        :root {
          --background: 0 0% 100%;
          --foreground: 224 71.4% 4.1%;
          --card: 0 0% 100%;
          --card-foreground: 224 71.4% 4.1%;
          --popover: 0 0% 100%;
          --popover-foreground: 224 71.4% 4.1%;
          --primary: 220.9 39.3% 11%;
          --primary-foreground: 210 20% 98%;
          --secondary: 220 14.3% 95.9%;
          --secondary-foreground: 220.9 39.3% 11%;
          --muted: 220 14.3% 95.9%;
          --muted-foreground: 220 8.9% 46.1%;
          --accent: 220 14.3% 95.9%;
          --accent-foreground: 220.9 39.3% 11%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 20% 98%;
          --border: 220 13% 91%;
          --input: 220 13% 91%;
          --ring: 224 71.4% 4.1%;
          --radius: 0.5rem;
        }

        .dark {
          --background: 224 71.4% 4.1%;
          --foreground: 210 20% 98%;
          --card: 224 71.4% 4.1%;
          --card-foreground: 210 20% 98%;
          --popover: 224 71.4% 4.1%;
          --popover-foreground: 210 20% 98%;
          --primary: 210 20% 98%;
          --primary-foreground: 220.9 39.3% 11%;
          --secondary: 215 27.9% 16.9%;
          --secondary-foreground: 210 20% 98%;
          --muted: 215 27.9% 16.9%;
          --muted-foreground: 217.9 10.6% 64.9%;
          --accent: 215 27.9% 16.9%;
          --accent-foreground: 210 20% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 20% 98%;
          --border: 215 27.9% 16.9%;
          --input: 215 27.9% 16.9%;
          --ring: 216 12.2% 83.9%;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Navbar styling to match the main app */
        .header-nav {
          width: 100%;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          background: hsl(var(--background));
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid hsl(var(--border));
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: hsl(var(--foreground));
          font-size: 1.5rem;
          font-weight: 700;
          user-select: none;
          transition: all 0.15s ease-in-out;
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .nav-links {
          display: none;
          gap: 0.25rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }

        .nav-link {
          position: relative;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          text-decoration: none;
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
          font-weight: 500;
          min-height: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-link:hover {
          color: hsl(var(--foreground));
          background: hsl(var(--accent) / 0.8);
        }

        .nav-link.active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-weight: 600;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .theme-toggle {
          margin-left: 0.5rem;
          padding: 0.5rem 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 2.75rem;
          min-width: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          outline: none;
        }

        .theme-toggle:hover {
          background: hsl(var(--accent));
          transform: scale(1.02);
        }

        .theme-toggle:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }

        /* API Header */
        .custom-header {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
          color: hsl(var(--primary-foreground));
          padding: 3rem 1rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .custom-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.03"><polygon points="36 34 18 34 18 26 36 26"/></g></svg>') repeat;
          opacity: 0.3;
        }

        .custom-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          position: relative;
          z-index: 1;
        }

        .custom-header p {
          font-size: 1.125rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .api-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .stat-item {
          background: hsl(var(--primary-foreground) / 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid hsl(var(--primary-foreground) / 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          min-width: 120px;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px hsl(var(--primary) / 0.3);
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        /* Swagger UI Container */
        #swagger-ui {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        /* Swagger UI Overrides */
        .swagger-ui {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        .swagger-ui .topbar {
          display: none !important;
        }

        .swagger-ui .info {
          margin: 0 0 2rem 0 !important;
        }

        .swagger-ui .info .title {
          color: hsl(var(--foreground)) !important;
          font-size: 2rem !important;
          font-weight: 700 !important;
        }

        .swagger-ui .info .description {
          color: hsl(var(--muted-foreground)) !important;
          font-size: 1rem !important;
          margin: 1rem 0 !important;
        }

        .swagger-ui .scheme-container {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
        }

        .swagger-ui .opblock-tag {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          margin: 0 0 1rem 0 !important;
        }

        .swagger-ui .opblock-tag-section h3 {
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
        }

        .swagger-ui .opblock {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          margin: 0 0 1rem 0 !important;
        }

        .swagger-ui .opblock.opblock-post {
          border-color: hsl(142.1 76.2% 36.3%) !important;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary {
          border-color: hsl(142.1 76.2% 36.3%) !important;
        }

        .swagger-ui .opblock.opblock-get {
          border-color: hsl(221.2 83.2% 53.3%) !important;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary {
          border-color: hsl(221.2 83.2% 53.3%) !important;
        }

        .swagger-ui .opblock-summary {
          background: hsl(var(--muted)) !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          padding: 1rem !important;
        }

        .swagger-ui .opblock-summary-method {
          border-radius: var(--radius) !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
        }

        .swagger-ui .opblock-summary-path {
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
          font-family: 'Inter', monospace !important;
        }

        .swagger-ui .opblock-summary-description {
          color: hsl(var(--muted-foreground)) !important;
        }

        .swagger-ui .opblock-description-wrapper {
          background: hsl(var(--background)) !important;
          border-top: 1px solid hsl(var(--border)) !important;
          padding: 1rem !important;
        }

        .swagger-ui .opblock-section-header {
          background: hsl(var(--muted)) !important;
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
          padding: 0.75rem 1rem !important;
        }

        .swagger-ui .parameters-col_description p,
        .swagger-ui .response-col_description p {
          color: hsl(var(--muted-foreground)) !important;
          margin: 0 !important;
        }

        .swagger-ui .parameter__name {
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
        }

        .swagger-ui .parameter__type {
          color: hsl(var(--muted-foreground)) !important;
          font-size: 0.875rem !important;
        }

        .swagger-ui .btn {
          border-radius: var(--radius) !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }

        .swagger-ui .btn.execute {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border: 1px solid hsl(var(--primary)) !important;
        }

        .swagger-ui .btn.execute:hover {
          background: hsl(var(--primary) / 0.9) !important;
          transform: translateY(-1px) !important;
        }

        .swagger-ui .btn.try-out__btn {
          background: hsl(var(--secondary)) !important;
          color: hsl(var(--secondary-foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }

        .swagger-ui .response-col_status {
          font-weight: 600 !important;
        }

        .swagger-ui .response .response-col_status {
          color: hsl(var(--foreground)) !important;
        }

        .swagger-ui .model-box {
          background: hsl(var(--muted)) !important;
          border-radius: var(--radius) !important;
          border: 1px solid hsl(var(--border)) !important;
        }

        .swagger-ui .model-title {
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
        }

        .swagger-ui textarea {
          background: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          color: hsl(var(--foreground)) !important;
          font-family: 'Inter', monospace !important;
        }

        .swagger-ui input[type="text"] {
          background: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          color: hsl(var(--foreground)) !important;
        }

        .swagger-ui .download-contents {
          background: hsl(var(--muted)) !important;
          border-radius: var(--radius) !important;
          padding: 1rem !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .custom-header h1 {
            font-size: 2rem;
          }

          .api-stats {
            gap: 1rem;
          }

          .stat-item {
            padding: 1rem;
            min-width: 100px;
          }

          #swagger-ui {
            padding: 1rem;
          }

          .header-content {
            padding: 0 1rem;
          }
        }

        /* Focus styles for accessibility */
        .swagger-ui .btn:focus,
        .swagger-ui input:focus,
        .swagger-ui textarea:focus {
          outline: 2px solid hsl(var(--primary)) !important;
          outline-offset: 2px !important;
        }
      </style>
    </head>
    <body>
      <nav class="header-nav">
        <div class="header-content">
          <a href="/" class="logo">
            <span>📸</span>
            Vasha Studio
          </a>
          
          <div class="nav-links">
            <a href="/" class="nav-link">Home</a>
            <a href="/studio" class="nav-link">Studio</a>
            <a href="/coworking" class="nav-link">Coworking</a>
            <a href="/gallery" class="nav-link">Gallery</a>
            <a href="/faq" class="nav-link">FAQ</a>
            <a href="/admin" class="nav-link">Admin</a>
            <a href="/api/docs" class="nav-link active">API</a>
          </div>

          <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
            <span id="theme-icon">🌙</span>
          </button>
        </div>
      </nav>

      <div class="custom-header">
        <h1>🎯 Vasha Studio API</h1>
        <p>Comprehensive API for managing studio bookings, content, and user interactions with modern authentication and real-time features</p>
        <div class="api-stats">
          <div class="stat-item">
            <span class="stat-number">15+</span>
            <span class="stat-label">Endpoints</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">5</span>
            <span class="stat-label">Resources</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">JWT</span>
            <span class="stat-label">Authentication</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">i18n</span>
            <span class="stat-label">Ready</span>
          </div>
        </div>
      </div>

      <div id="swagger-ui"></div>

      <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
      <script>
        // Theme management that syncs with main app
        function toggleTheme() {
          const html = document.documentElement;
          const isDark = html.classList.contains('dark');
          const icon = document.getElementById('theme-icon');
          
          if (isDark) {
            html.classList.remove('dark');
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
          } else {
            html.classList.add('dark');
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
          }
        }

        // Initialize theme from localStorage or system preference
        function initTheme() {
          const savedTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const icon = document.getElementById('theme-icon');
          
          if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            icon.textContent = '☀️';
          } else {
            icon.textContent = '🌙';
          }
        }

        // Initialize Swagger UI
        window.onload = function() {
          initTheme();
          
          const ui = SwaggerUIBundle({
            url: '/api/docs?format=json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            validatorUrl: null,
            tryItOutEnabled: true,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            docExpansion: 'list',
            operationsSorter: 'alpha',
            tagsSorter: 'alpha',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            defaultModelsExpandDepth: 1,
            requestInterceptor: function(request) {
              return request;
            },
            responseInterceptor: function(response) {
              return response;
            },
            onComplete: function() {
              console.log('Vasha Studio API documentation loaded successfully');
            }
          });
        };

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
          if (!localStorage.getItem('theme')) {
            const icon = document.getElementById('theme-icon');
            if (e.matches) {
              document.documentElement.classList.add('dark');
              icon.textContent = '☀️';
            } else {
              document.documentElement.classList.remove('dark');
              icon.textContent = '🌙';
            }
          }
        });
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
} 