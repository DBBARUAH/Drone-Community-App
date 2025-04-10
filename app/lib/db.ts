import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient
export const db = globalThis.prisma ?? new PrismaClient({
  // Optional: Log database queries during development
  // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Store the instance in the global variable in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} 