import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TIMEOUT_MS = 2000;

async function checkDb() {
  // run a minimal query
  return await prisma.$queryRaw`select 1`;
}

export async function GET(request: NextRequest) {
  try {
    const res = await Promise.race([
      checkDb(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)),
    ]);

    if (res) {
      return NextResponse.json({ ok: true, db: true }, { status: 200 });
    }

    return NextResponse.json({ ok: false, db: false }, { status: 503 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ ok: false, db: false, error: String(error) }, { status: 503 });
  }
}
