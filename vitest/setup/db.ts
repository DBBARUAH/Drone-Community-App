import { PrismaClient } from '@prisma/client'
import { vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// Mock the Prisma client using vitest-mock-extended
const prismaMock = mockDeep<PrismaClient>()

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Export both the mock instance and the mock itself for potential direct mocking
export const db = prismaMock
export { prismaMock } // Export the raw mock 