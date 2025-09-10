import { PrismaClient } from '@/app/generated/prisma'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Prefer the pooled DATABASE_URL for runtime. Use DIRECT_URL for migrations when explicitly requested.
const isMigration = process.env.MIGRATION_MODE === 'true';
const connectionUrl = isMigration ? (process.env.DIRECT_URL || process.env.DATABASE_URL) : (process.env.DATABASE_URL || process.env.DIRECT_URL);

if (!connectionUrl) {
  throw new Error('No Prisma connection string found in DIRECT_URL or DATABASE_URL');
}

export const prisma: PrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: connectionUrl,
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error disconnecting prisma on SIGTERM', err);
  }
});

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error disconnecting prisma on SIGINT', err);
  }
});

export default prisma 