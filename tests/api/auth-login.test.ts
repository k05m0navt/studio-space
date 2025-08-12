import { POST } from '@/app/api/auth/login/route';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    compare: jest.fn(async () => true),
  },
}));

describe('POST /api/auth/login', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns token and user on valid credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', role: 'ADMIN', password: 'hash' } as any);
    jest.spyOn(prisma.session, 'create').mockResolvedValue({} as any);
    jest.spyOn(jwt, 'sign').mockReturnValue('token123' as any);

    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'secret123' }) });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.token).toBe('token123');
    expect(json.user.email).toBe('a@b.com');
  });

  it('rejects invalid credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null as any);
    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'no@user.com', password: 'secret123' }) });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it('validates input', async () => {
    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({}) });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });
});
