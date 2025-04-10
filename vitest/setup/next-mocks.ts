import { vi } from 'vitest';

// Mock Next.js's revalidatePath function
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// If you need to mock other Next.js functions, add them here 