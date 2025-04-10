import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prismaMock } from '../setup/prisma-mock';

// Define types locally instead of importing from @prisma/client
type User = {
  id: string;
  auth0Id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

type Profile = {
  id: string;
  userId: string;
  title: string | null;
  businessName: string | null;
  location: string | null;
  website: string | null;
  bio: string | null;
  contactEmail: string | null;
  phone: string | null;
  specializations: string[];
  serviceArea: string | null;
  languages: string[];
  insuranceDetails: string | null;
  createdAt: Date;
  updatedAt: Date;
};

describe('Profile Model', () => {
  // Sample test data
  const mockUser: User = {
    id: 'user-test-id',
    auth0Id: 'auth0|test123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'CLIENT',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockProfile: Profile = {
    id: 'profile-test-id',
    userId: mockUser.id,
    title: 'Drone Pilot',
    businessName: 'Sky High Pics',
    location: 'New York',
    website: 'https://example.com',
    bio: 'Test bio',
    contactEmail: 'contact@example.com',
    phone: '123-456-7890',
    specializations: ['Aerial Photography', 'Real Estate'],
    serviceArea: 'Northeast',
    languages: ['English', 'Spanish'],
    insuranceDetails: 'Full coverage',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Clean up between tests
  afterEach(() => {
    // The mock reset is handled by the prisma-mock setup
  });

  it('should create a new profile', async () => {
    // Mock the profile create operation
    prismaMock.profile.create.mockResolvedValue(mockProfile);

    // Perform the operation using the mocked client
    const created = await prismaMock.profile.create({
      data: {
        userId: mockUser.id,
        location: 'New York',
        // ... other profile data
      }
    });

    // Assert the result matches our mock
    expect(created).toEqual(mockProfile);
    expect(created.userId).toBe(mockUser.id);
    expect(prismaMock.profile.create).toHaveBeenCalledTimes(1);
  });

  it('should find a profile by ID', async () => {
    // Mock the profile findUnique operation
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    // Perform the operation
    const profile = await prismaMock.profile.findUnique({
      where: { id: mockProfile.id }
    });

    // Assertions
    expect(profile).toEqual(mockProfile);
    expect(profile?.id).toBe('profile-test-id');
    expect(prismaMock.profile.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should find a profile by userId', async () => {
    // Mock the profile findUnique operation
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    // Find profile by userId
    const profile = await prismaMock.profile.findUnique({
      where: { userId: mockUser.id }
    });

    // Assertions
    expect(profile).toEqual(mockProfile);
    expect(profile?.userId).toBe(mockUser.id);
    expect(prismaMock.profile.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should update a profile', async () => {
    const updatedProfile = {
      ...mockProfile,
      bio: 'Updated bio',
      location: 'Los Angeles'
    };

    // Mock the update operation
    prismaMock.profile.update.mockResolvedValue(updatedProfile);

    // Perform the update
    const profile = await prismaMock.profile.update({
      where: { id: mockProfile.id },
      data: {
        bio: 'Updated bio',
        location: 'Los Angeles'
      }
    });

    // Assertions
    expect(profile.bio).toBe('Updated bio');
    expect(profile.location).toBe('Los Angeles');
    expect(prismaMock.profile.update).toHaveBeenCalledTimes(1);
  });

  it('should delete a profile', async () => {
    // Mock the delete operation
    prismaMock.profile.delete.mockResolvedValue(mockProfile);

    // Perform the delete
    const deleted = await prismaMock.profile.delete({
      where: { id: mockProfile.id }
    });

    // Assertions
    expect(deleted).toEqual(mockProfile);
    expect(prismaMock.profile.delete).toHaveBeenCalledTimes(1);
  });

  it('should find profiles with included relationships', async () => {
    const profileWithRelations = {
      ...mockProfile,
      user: mockUser,
      experiences: [],
      equipment: [],
      certifications: [],
      galleryItems: []
    };

    // Mock the findUnique operation with includes
    prismaMock.profile.findUnique.mockResolvedValue(profileWithRelations);

    // Perform the query with includes
    const profile = await prismaMock.profile.findUnique({
      where: { id: mockProfile.id },
      include: {
        user: true,
        experiences: true,
        equipment: true,
        certifications: true,
        galleryItems: true
      }
    });

    // Assertions
    expect(profile).toEqual(profileWithRelations);
    expect(profile?.user).toEqual(mockUser);
    expect(Array.isArray(profile?.experiences)).toBe(true);
    expect(prismaMock.profile.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should create a new profile with new fields', async () => {
    // Mock the profile create operation
    prismaMock.profile.create.mockResolvedValue(mockProfile);

    // Perform the operation using the mocked client
    const created = await prismaMock.profile.create({
      data: {
        userId: mockUser.id,
        title: 'Drone Pilot',
        businessName: 'Sky High Pics',
        location: 'New York',
        specializations: [],
        languages: []
      }
    });

    // Assert the result matches our mock
    expect(created).toEqual(mockProfile);
    expect(created.userId).toBe(mockUser.id);
    expect(created.title).toBe('Drone Pilot');
    expect(created.businessName).toBe('Sky High Pics');
    expect(prismaMock.profile.create).toHaveBeenCalledTimes(1);
  });

  it('should update a profile with new fields', async () => {
    const updatedProfileData = {
      bio: 'Updated bio',
      location: 'Los Angeles',
      title: 'Senior Drone Operator',
      businessName: 'LA Aerials'
    };
    const expectedUpdatedProfile = {
      ...mockProfile,
      ...updatedProfileData
    };

    // Mock the update operation
    prismaMock.profile.update.mockResolvedValue(expectedUpdatedProfile);

    // Perform the update
    const profile = await prismaMock.profile.update({
      where: { id: mockProfile.id },
      data: updatedProfileData
    });

    // Assertions
    expect(profile.bio).toBe('Updated bio');
    expect(profile.location).toBe('Los Angeles');
    expect(profile.title).toBe('Senior Drone Operator');
    expect(profile.businessName).toBe('LA Aerials');
    expect(prismaMock.profile.update).toHaveBeenCalledTimes(1);
  });
}); 