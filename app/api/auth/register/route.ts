import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.format() }, { status: 400 });
    }

    const { email, password, name } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, password: passwordHash, role: 'USER' } });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
