import { PrismaClient } from '@/app/generated/prisma'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL
      }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
})

export default prisma 