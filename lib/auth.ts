import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/app/generated/prisma';
import { createClient } from '@/lib/supabase/server';

const prisma = new PrismaClient();

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthContext {
  user: AuthUser;
  request: NextRequest;
}

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    
    // Verify token exists in database and is not expired
    const session = await prisma.session.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return session?.user || null;
  } catch {
    return null;
  }
}

export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as AuthUser;

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function requireAuth(handler: (context: AuthContext) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const user = await authenticateRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler({ user, request });
  };
}

export function requireRole(roles: string[]) {
  return function(handler: (context: AuthContext) => Promise<Response>) {
    return async (request: NextRequest): Promise<Response> => {
      const user = await authenticateRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      if (!roles.includes(user.role)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return handler({ user, request });
    };
  };
}

export async function logout(token: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch {
    // Silently handle errors
  }
}

export async function requireAuthSupabase(request: NextRequest) {
  const supabase = createClient();
  
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new Error('Invalid token');
    }
    
    return user;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  // Using a simple hash for demo purposes
  // In production, use bcrypt or similar
  return Buffer.from(password).toString('base64');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = Buffer.from(password).toString('base64');
  return hashedPassword === hash;
}

export function generateToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyTokenSupabase(token: string): JWTPayload {
  try {
    jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return jwt.decode(token) as JWTPayload;
  } catch {
    throw new Error('Invalid token');
  }
} 