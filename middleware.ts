import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Rate limiting storage (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 60000); // Clean every minute

function applyRateLimit(request: NextRequest): boolean {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = (forwardedFor?.split(',')[0]?.trim()) || realIp || request.nextUrl.hostname || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window
  
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  const current = rateLimit.get(key) || { count: 0, resetTime: now + windowMs };
  
  current.count++;
  rateLimit.set(key, current);
  
  return current.count <= maxRequests;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  
  return response;
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Handle manifest.json requests from any locale path
  if (request.nextUrl.pathname.endsWith('/manifest.json')) {
    return NextResponse.rewrite(new URL('/manifest.json', request.url));
  }
  
  // Determine if API path
  const isBaseApi = request.nextUrl.pathname.startsWith('/api/');
  const isLocaleApi = /^\/(ru|en)\/api\//.test(request.nextUrl.pathname);
  const isAuthEndpoint = /\/api\/auth\//.test(request.nextUrl.pathname);

  // Apply rate limiting to API routes (skip auth endpoints)
  if ((isBaseApi || isLocaleApi) && !isAuthEndpoint) {
    if (!applyRateLimit(request)) {
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + 900000),
        }
      });
    }
  }
  
  // For API requests, skip next-intl locale routing to avoid rewriting /api -> /en/api
  let response: NextResponse;
  if (isBaseApi || isLocaleApi) {
    response = NextResponse.next();
  } else {
    // Handle internationalization for non-API requests
    response = intlMiddleware(request);
  }
  
  // Add security headers to all responses
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API and trpc routes (excluding admin)
    '/api/((?!admin).+)',
    '/trpc/(.*)',
    // Match internationalization
    '/',
    '/(ru|en)/:path*',
    // Handle manifest.json in any locale path
    '/(ru|en)/manifest.json',
  ],
}; 