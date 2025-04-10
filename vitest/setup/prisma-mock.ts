import { vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Use any to avoid type errors until we fix the path
import type { PrismaClient } from '@prisma/client';

// Create a mocked version of the PrismaClient
const prisma = mockDeep<any>();

// Reset mocks between tests
beforeEach(() => {
  mockReset(prisma);
});

// Mock the whole db.ts module
vi.mock('../../app/lib/db', () => ({
  db: prisma,
}));

export { prisma as prismaMock }; 