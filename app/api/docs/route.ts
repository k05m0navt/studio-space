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

  // Return beautiful HTML documentation matching the web app design
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
          --radius: 0.625rem;
          --background: oklch(1 0 0);
          --foreground: oklch(0.145 0 0);
          --card: oklch(1 0 0);
          --card-foreground: oklch(0.145 0 0);
          --popover: oklch(1 0 0);
          --popover-foreground: oklch(0.145 0 0);
          --primary: oklch(0.205 0 0);
          --primary-foreground: oklch(0.985 0 0);
          --secondary: oklch(0.97 0 0);
          --secondary-foreground: oklch(0.205 0 0);
          --muted: oklch(0.97 0 0);
          --muted-foreground: oklch(0.556 0 0);
          --accent: oklch(0.97 0 0);
          --accent-foreground: oklch(0.205 0 0);
          --destructive: oklch(0.577 0.245 27.325);
          --border: oklch(0.922 0 0);
          --input: oklch(0.922 0 0);
          --ring: oklch(0.708 0 0);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --background: oklch(0.145 0 0);
            --foreground: oklch(0.985 0 0);
            --card: oklch(0.205 0 0);
            --card-foreground: oklch(0.985 0 0);
            --popover: oklch(0.205 0 0);
            --popover-foreground: oklch(0.985 0 0);
            --primary: oklch(0.922 0 0);
            --primary-foreground: oklch(0.205 0 0);
            --secondary: oklch(0.269 0 0);
            --secondary-foreground: oklch(0.985 0 0);
            --muted: oklch(0.269 0 0);
            --muted-foreground: oklch(0.708 0 0);
            --accent: oklch(0.269 0 0);
            --accent-foreground: oklch(0.985 0 0);
            --destructive: oklch(0.704 0.191 22.216);
            --border: oklch(1 0 0 / 10%);
            --input: oklch(1 0 0 / 15%);
            --ring: oklch(0.556 0 0);
          }
        }

        * {
          box-sizing: border-box;
        }

        html {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: var(--background);
          color: var(--foreground);
          line-height: 1.6;
          antialiased: true;
          transition: background 0.3s, color 0.3s;
        }

        .header-nav {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background: var(--background)/95;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-toggle {
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--foreground);
        }

        .theme-toggle:hover {
          background: var(--accent);
        }

        .custom-header {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--background);
          border-bottom: 1px solid var(--border);
        }

        .custom-header h1 {
          font-size: 3rem;
          margin: 0 0 1rem 0;
          font-weight: 700;
          color: var(--foreground);
          background: linear-gradient(135deg, var(--primary), var(--primary));
          -webkit-background-clip: text;
          background-clip: text;
        }

        .custom-header p {
          font-size: 1.125rem;
          margin: 0 0 2rem 0;
          color: var(--muted-foreground);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .api-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 1.5rem;
          border-radius: calc(var(--radius) + 4px);
          text-align: center;
          min-width: 120px;
          transition: all 0.2s;
        }

        .stat-item:hover {
          background: var(--accent);
          transform: translateY(-2px);
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          display: block;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          margin-top: 0.25rem;
        }

        #swagger-ui {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Override Swagger UI styles to match our design */
        .swagger-ui {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .swagger-ui .topbar {
          display: none !important;
        }

        .swagger-ui .info {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          border-radius: calc(var(--radius) + 4px) !important;
          padding: 2rem !important;
          margin-bottom: 2rem !important;
        }

        .swagger-ui .info .title {
          color: var(--foreground) !important;
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.5rem !important;
        }

        .swagger-ui .info .description {
          color: var(--muted-foreground) !important;
          font-size: 1rem !important;
        }

        .swagger-ui .scheme-container {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius) !important;
          padding: 1.5rem !important;
          margin-bottom: 2rem !important;
        }

        .swagger-ui .opblock {
          border-radius: var(--radius) !important;
          margin-bottom: 1rem !important;
          border: 1px solid var(--border) !important;
          background: var(--card) !important;
          overflow: hidden;
        }

        .swagger-ui .opblock.opblock-post {
          border-left: 4px solid #10b981 !important;
        }

        .swagger-ui .opblock.opblock-get {
          border-left: 4px solid #3b82f6 !important;
        }

        .swagger-ui .opblock.opblock-put {
          border-left: 4px solid #f59e0b !important;
        }

        .swagger-ui .opblock.opblock-delete {
          border-left: 4px solid #ef4444 !important;
        }

        .swagger-ui .opblock-summary {
          background: var(--background) !important;
          border-bottom: 1px solid var(--border) !important;
          padding: 1rem 1.5rem !important;
        }

        .swagger-ui .opblock-summary-method {
          border-radius: calc(var(--radius) - 2px) !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
          padding: 0.25rem 0.5rem !important;
        }

        .swagger-ui .opblock-summary-path {
          color: var(--foreground) !important;
          font-weight: 500 !important;
          font-family: 'Inter', monospace !important;
        }

        .swagger-ui .opblock-description-wrapper {
          background: var(--card) !important;
          padding: 1.5rem !important;
        }

        .swagger-ui .btn {
          border-radius: var(--radius) !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
        }

        .swagger-ui .btn.authorize {
          background: var(--primary) !important;
          border: none !important;
          color: var(--primary-foreground) !important;
          padding: 0.5rem 1rem !important;
        }

        .swagger-ui .btn.authorize:hover {
          opacity: 0.9 !important;
          transform: translateY(-1px) !important;
        }

        .swagger-ui .btn.execute {
          background: var(--primary) !important;
          border: none !important;
          color: var(--primary-foreground) !important;
        }

        .swagger-ui .btn.execute:hover {
          opacity: 0.9 !important;
        }

        .swagger-ui .parameters-col_description {
          color: var(--muted-foreground) !important;
        }

        .swagger-ui .response-col_status {
          color: var(--foreground) !important;
          font-weight: 600 !important;
        }

        .swagger-ui .model-box {
          background: var(--muted) !important;
          border-radius: var(--radius) !important;
          border: 1px solid var(--border) !important;
        }

        .swagger-ui .model-title {
          color: var(--foreground) !important;
          font-weight: 600 !important;
        }

        .swagger-ui textarea {
          background: var(--background) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius) !important;
          color: var(--foreground) !important;
          font-family: 'Inter', monospace !important;
        }

        .swagger-ui input[type="text"] {
          background: var(--background) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius) !important;
          color: var(--foreground) !important;
        }

        .swagger-ui .download-contents {
          background: var(--muted) !important;
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
          outline: 2px solid var(--primary) !important;
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
          <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
            🌙
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
        // Theme management
        function toggleTheme() {
          const html = document.documentElement;
          const isDark = html.classList.contains('dark');
          const button = document.querySelector('.theme-toggle');
          
          if (isDark) {
            html.classList.remove('dark');
            button.textContent = '🌙';
            localStorage.setItem('theme', 'light');
          } else {
            html.classList.add('dark');
            button.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
          }
        }

        // Initialize theme
        function initTheme() {
          const savedTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const button = document.querySelector('.theme-toggle');
          
          if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            button.textContent = '☀️';
          } else {
            button.textContent = '🌙';
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
            const button = document.querySelector('.theme-toggle');
            if (e.matches) {
              document.documentElement.classList.add('dark');
              button.textContent = '☀️';
            } else {
              document.documentElement.classList.remove('dark');
              button.textContent = '🌙';
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