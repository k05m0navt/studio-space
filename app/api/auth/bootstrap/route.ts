import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!bootstrapSecret || authHeader !== `Bearer ${bootstrapSecret}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const hasAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' as any } });
    if (hasAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const body = await request.json();
    const { email, password, name } = schema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'ADMIN' as any },
      select: { id: true, email: true, name: true, role: true }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({ token, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Bootstrap admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
