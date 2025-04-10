import { describe, it, expect, vi } from 'vitest';
import { getUserWithProfile } from '../userActions'; // Function to test
import { prismaMock } from '../../../vitest/setup/prisma-mock'; // Use the global mock setup

describe('getUserWithProfile', () => {
  it('should return user with profile if found', async () => {
    // Arrange: Define mock data
    const mockUserId = 'user123';
    const mockUser = {
      id: mockUserId,
      auth0Id: 'auth|abcde',
      email: 'test@example.com',
      name: 'Test User',
      role: 'PHOTOGRAPHER', // Use string directly
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        id: 'profile456',
        userId: mockUserId,
        location: 'Test City',
        website: 'https://test.com',
        bio: 'A test bio',
        contactEmail: null,
        phone: null,
        specializations: ['portraits', 'events'],
        serviceArea: 'Local',
        languages: ['English'],
        insuranceDetails: 'Covered',
        travelPolicy: 'Willing to travel',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add empty arrays for related models if needed for type consistency
        experiences: [],
        equipment: [],
        certifications: [],
        galleryItems: [],
      },
    };

    // Configure the mock: Tell prismaMock.user.findUnique to resolve with mockUser
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    // Act: Call the function under test
    const user = await getUserWithProfile(mockUserId);

    // Assert: Check the results
    expect(user).toEqual(mockUser); // Verify the returned data matches mock data
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1); // Verify findUnique was called once
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ // Verify it was called with correct args
      where: { id: mockUserId },
      include: { profile: true },
    });
  });

  it('should return null if user is not found', async () => {
    // Arrange: Configure the mock to return null
    const mockUserId = 'nonexistentUser';
    prismaMock.user.findUnique.mockResolvedValue(null);

    // Act: Call the function
    const user = await getUserWithProfile(mockUserId);

    // Assert: Check the result
    expect(user).toBeNull();
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockUserId },
      include: { profile: true },
    });
  });

  it('should return null if userId is empty or null', async () => {
    // Act & Assert for empty string
    const userEmpty = await getUserWithProfile('');
    expect(userEmpty).toBeNull();

    // Act & Assert for null (need to adjust function signature slightly or cast)
    // const userNull = await getUserWithProfile(null as any); // If needed
    // expect(userNull).toBeNull();

    // Assert that findUnique was NOT called in these cases
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
}); 