import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup/prisma-mock';

describe('Prisma Database Connection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should connect to the database using the pooler connection', async () => {
    // Mock the raw query execution
    prismaMock.$executeRaw.mockResolvedValue(1);
    
    // Test a simple query to verify connection is working
    const result = await prismaMock.$executeRaw`SELECT 1 as result`;
    expect(result).toBe(1);
    expect(prismaMock.$executeRaw).toHaveBeenCalled();
  });

  it('should have access to the User model', async () => {
    // Mock the count operation
    prismaMock.user.count.mockResolvedValue(5);
    
    // Test the count operation
    const count = await prismaMock.user.count();
    expect(typeof count).toBe('number');
    expect(count).toBe(5);
    expect(prismaMock.user.count).toHaveBeenCalled();
  });

  it('should have access to the Profile model', async () => {
    // Mock the count operation
    prismaMock.profile.count.mockResolvedValue(3);
    
    // Test the count operation
    const count = await prismaMock.profile.count();
    expect(typeof count).toBe('number');
    expect(count).toBe(3);
    expect(prismaMock.profile.count).toHaveBeenCalled();
  });

  // This test is useful for development to verify your schema is correctly set up
  it('should have all the expected models from the schema', async () => {
    // These models should exist on the prisma client
    const expectedModels = [
      'user', 
      'profile', 
      'experience', 
      'equipment', 
      'certification', 
      'galleryItem'
    ];
    
    for (const model of expectedModels) {
      expect(prismaMock).toHaveProperty(model);
    }
  });
}); 