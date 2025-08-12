import { POST } from '@/app/api/bookings/route';
import { prisma } from '@/lib/prisma';

describe('POST /api/bookings', () => {
  const baseBody = {
    name: 'Test User',
    email: 'test@example.com',
    type: 'studio',
    date: new Date('2025-08-12T10:00:00Z').toISOString(),
    start_time: '10:00',
    end_time: '12:00',
  } as const;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a booking when no conflicts', async () => {
    jest.spyOn(prisma.booking, 'findMany').mockResolvedValue([] as any);
    jest.spyOn(prisma.booking, 'create').mockResolvedValue({ id: '1', ...baseBody, status: 'pending', createdAt: new Date(), updatedAt: new Date() } as any);

    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify(baseBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.email).toBe('test@example.com');
  });

  it('returns 409 on conflicting booking', async () => {
    jest.spyOn(prisma.booking, 'findMany').mockResolvedValue([{ id: 'x' }] as any);

    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify(baseBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(409);
  });

  it('returns 400 on validation error', async () => {
    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });
});
