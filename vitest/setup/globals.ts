import { vi } from 'vitest'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock @/lib/supabase
vi.mock('@/lib/supabase', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}))

// Mock hooks or other global dependencies if needed
// vi.mock('@/hooks/useAuth', () => ({
//   useAuth: vi.fn(() => ({ user: { sub: 'auth0|123' }, isLoading: false }))
// }))

console.log('Global mocks applied for Vitest') 