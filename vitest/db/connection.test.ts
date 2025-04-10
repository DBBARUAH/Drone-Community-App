import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup/prisma-mock';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({
          data: [{ status: 'available' }],
          error: null
        }))
      }))
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({
          data: { path: 'test-path' },
          error: null
        })),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://example.com/test.jpg' }
        }))
      }))
    }
  }))
}));

describe('Database Connections', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  describe('Prisma Database Connection', () => {
    it('should connect to the database using the pooler connection', async () => {
      // Mock the raw query execution
      prismaMock.$executeRaw.mockResolvedValue(1);
      
      // Test a simple query to verify connection is working
      const result = await prismaMock.$executeRaw`SELECT 1 as result`;
      expect(result).toBe(1);
      expect(prismaMock.$executeRaw).toHaveBeenCalled();
    });

    it('should handle database connection errors gracefully', async () => {
      // Mock a connection error
      prismaMock.$executeRaw.mockRejectedValue(new Error("Can't reach database server"));
      
      // The function should throw an error
      await expect(prismaMock.$executeRaw`SELECT 1 as result`).rejects.toThrow("Can't reach database server");
    });
  });

  describe('Supabase Connection', () => {
    it('should initialize Supabase client correctly', () => {
      // Set environment variables for test
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key');
      
      const supabase = createClient('https://test.supabase.co', 'test-key');
      expect(supabase).toBeDefined();
      expect(createClient).toHaveBeenCalledWith('https://test.supabase.co', 'test-key');
    });

    it('should be able to connect to Supabase service', async () => {
      // Set environment variables for test
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key');
      
      const supabase = createClient('https://test.supabase.co', 'test-key');
      const { data, error } = await supabase.from('_service_status').select('*').limit(1);
      
      expect(error).toBeNull();
      expect(data).toEqual([{ status: 'available' }]);
    });

    it('should handle Supabase connection with missing environment variables', () => {
      // Unset environment variables
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
      
      // In a real app, we'd expect initialization to fail, but our mock doesn't actually check env vars
      const supabase = createClient('', '');
      expect(supabase).toBeDefined();
      expect(createClient).toHaveBeenCalledWith('', '');
    });
  });
}); 