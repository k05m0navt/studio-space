#!/usr/bin/env node
// Create an admin user directly via Prisma (reads .env.local)
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../app/generated/prisma');

async function main(email, password) {
  const prisma = new PrismaClient();
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      console.log(JSON.stringify({ ok: false, reason: 'admin_exists', email: existingAdmin.email }));
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: 'Administrator', role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true }
    });

    // create a session token for convenience (optional)
    const token = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({ data: { userId: user.id, token, expiresAt } });

    console.log(JSON.stringify({ ok: true, email: user.email, password, id: user.id, token }));
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: err && err.message }));
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

const suppliedEmail = process.argv[2] || `admin.${Date.now()}@example.test`;
const suppliedPassword = process.argv[3] || 'ChangeMe123!';
main(suppliedEmail, suppliedPassword);
