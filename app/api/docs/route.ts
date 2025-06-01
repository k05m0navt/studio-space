import { NextRequest, NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Studio Space API',
      version: '1.0.0',
      description: 'A comprehensive API for managing studio space bookings, content, and user interactions',
      contact: {
        name: 'Studio Space Team',
        email: 'api@studiospace.com',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Studio Space API Server',
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
      {
        name: 'Gallery',
        description: 'Image gallery management',
      },
      {
        name: 'Settings',
        description: 'Application settings and configuration',
      },
    ],
  },
  apis: ['./app/api/**/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'json') {
    return NextResponse.json(specs);
  }

  // Return beautiful HTML documentation
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Studio Space API Documentation</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
      <style>
        html {
          box-sizing: border-box;
          overflow: -moz-scrollbars-vertical;
          overflow-y: scroll;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
        body {
          margin:0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        #swagger-ui {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .swagger-ui .topbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .swagger-ui .topbar .topbar-wrapper {
          padding: 20px;
        }
        .swagger-ui .topbar .topbar-wrapper .link {
          color: white;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
        }
        .swagger-ui .info {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .swagger-ui .info .title {
          color: #667eea;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .swagger-ui .scheme-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .swagger-ui .opblock {
          border-radius: 10px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .swagger-ui .opblock.opblock-post {
          border-color: #49cc90;
          background: rgba(73, 204, 144, 0.1);
        }
        .swagger-ui .opblock.opblock-get {
          border-color: #61affe;
          background: rgba(97, 175, 254, 0.1);
        }
        .swagger-ui .opblock.opblock-put {
          border-color: #fca130;
          background: rgba(252, 161, 48, 0.1);
        }
        .swagger-ui .opblock.opblock-delete {
          border-color: #f93e3e;
          background: rgba(249, 62, 62, 0.1);
        }
        .swagger-ui .btn.authorize {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          padding: 10px 20px;
        }
        .swagger-ui .btn.execute {
          background: linear-gradient(135deg, #49cc90 0%, #38a3a5 100%);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
        }
        .custom-header {
          text-align: center;
          padding: 40px 20px;
          color: white;
        }
        .custom-header h1 {
          font-size: 48px;
          margin-bottom: 10px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .custom-header p {
          font-size: 18px;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .api-stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 40px;
        }
        .stat-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          display: block;
        }
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="custom-header">
        <h1>🎯 Studio Space API</h1>
        <p>Comprehensive API for managing studio space bookings, content, and user interactions</p>
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
        </div>
      </div>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
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
            defaultModelsExpandDepth: 2,
            requestInterceptor: function(request) {
              // Add any custom headers or modifications here
              return request;
            },
            responseInterceptor: function(response) {
              // Handle responses here
              return response;
            },
            onComplete: function() {
              console.log('Swagger UI loaded successfully');
            }
          });
        };
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