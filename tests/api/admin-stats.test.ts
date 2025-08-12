import { GET } from '@/app/api/admin/stats/route';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function makeAuthHeaders(token: string) {
  return new Headers({ Authorization: `Bearer ${token}` });
}

describe('GET /api/admin/stats', () => {
  const secret = 'fallback-secret';
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ userId: 'u1', email: 'a@b.com', role: 'ADMIN' }, secret, { expiresIn: '1h' });
  });

  afterEach(() => jest.restoreAllMocks());

  it('aggregates stats', async () => {
    jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({
      id: 's1',
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      user: { id: 'u1', email: 'a@b.com', role: 'ADMIN' },
    } as any);

    jest
      .spyOn(prisma.booking, 'count')
      .mockResolvedValueOnce(10 as any)
      .mockResolvedValueOnce(2 as any)
      .mockResolvedValueOnce(5 as any)
      .mockResolvedValueOnce(3 as any)
      .mockResolvedValueOnce(4 as any)
      .mockResolvedValueOnce(2 as any);

    jest.spyOn(prisma.user, 'count').mockResolvedValue(7 as any);
    jest
      .spyOn(prisma.booking, 'findMany')
      .mockResolvedValue([{ type: 'studio' }, { type: 'coworking' }] as any);

    const req = new Request('http://localhost/api/admin/stats', {
      headers: makeAuthHeaders(token),
    });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.totalBookings).toBeDefined();
    expect(json.activeMembers).toBeDefined();
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/admin/stats');
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });
});
