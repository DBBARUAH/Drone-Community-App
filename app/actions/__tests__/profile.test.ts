import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prismaMock } from '../../../vitest/setup/prisma-mock';
import { createProfile, updateBasicProfile, updateAdditionalInfo, getFullProfile, deleteProfile, BasicProfileFormData, AdditionalInfoFormData } from '../profile';

describe('Profile Actions', () => {
  const mockUserId = 'user-123';
  const mockProfileId = 'profile-123';
  
  const mockUser = {
    id: mockUserId,
    auth0Id: 'auth0|123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'PHOTOGRAPHER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const mockProfile = {
    id: mockProfileId,
    userId: mockUserId,
    title: 'Drone Photographer',
    businessName: 'Test Drone Services',
    location: 'New York',
    website: 'https://example.com',
    bio: 'Drone photographer',
    contactEmail: 'contact@example.com',
    phone: '123-456-7890',
    specializations: ['Aerial Photography', 'Real Estate'],
    serviceArea: 'Northeast',
    languages: ['English', 'Spanish'],
    insuranceDetails: 'Fully insured',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [],
    experiences: [],
    equipment: [],
    certifications: [],
    galleryItems: [],
  };

  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createProfile', () => {
    it('should create a new profile for an existing user', async () => {
      // Mock user exists but profile doesn't
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.profile.findUnique.mockResolvedValue(null);
      // Mock the created profile (should have default/empty values for most fields)
      const createdProfileStub = {
        id: mockProfileId,
        userId: mockUserId,
        title: null,
        businessName: null,
        location: null,
        website: null,
        bio: null,
        contactEmail: null,
        phone: null,
        specializations: [],
        serviceArea: null,
        languages: [],
        insuranceDetails: null,
        createdAt: expect.any(Date), // Use expect.any for generated dates
        updatedAt: expect.any(Date),
        categories: [],
        experiences: [],
        equipment: [],
        certifications: [],
        galleryItems: [],
      };
      prismaMock.profile.create.mockResolvedValue(createdProfileStub);

      const result = await createProfile(mockUser.auth0Id); // Use auth0Id

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { auth0Id: mockUser.auth0Id },
      });
      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      // Check if create is called with correct data (only userId is mandatory)
      expect(prismaMock.profile.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          specializations: [], // Default empty arrays
          languages: [],       // Default empty arrays
        },
      });
      expect(result).toHaveProperty('profile');
      // Compare specific fields or use partial matching if create returns minimal data
      expect(result.profile).toMatchObject({ userId: mockUserId });
    });

    it('should create a user and profile if user does not exist', async () => {
       prismaMock.user.findUnique.mockResolvedValue(null); // User doesn't exist
       const newUser = { ...mockUser, id: 'new-user-id' };
       const newProfile = {
         id: 'new-profile-id',
         userId: newUser.id,
         // ... other fields initialized to null/defaults
         specializations: [],
         languages: [],
         createdAt: new Date(),
         updatedAt: new Date(),
       }
       prismaMock.user.create.mockResolvedValue(newUser);
       prismaMock.profile.findUnique.mockResolvedValue(null); // Profile won't exist yet
       prismaMock.profile.create.mockResolvedValue(newProfile);

       const result = await createProfile('new-auth0-id');

       expect(prismaMock.user.create).toHaveBeenCalled();
       expect(prismaMock.profile.create).toHaveBeenCalledWith({
         data: {
           userId: newUser.id,
           specializations: [],
           languages: [],
         },
       });
       expect(result).toHaveProperty('profile');
       expect(result.profile?.userId).toBe(newUser.id);
    });

    it('should return existing profile if one exists for the user', async () => {
      // Mock user and profile exist
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await createProfile(mockUser.auth0Id);

      expect(prismaMock.profile.create).not.toHaveBeenCalled();
      expect(result).toEqual({ profile: mockProfile });
    });

    it('should handle error during user creation', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockRejectedValue(new Error('User creation failed'));

      const result = await createProfile('new-auth0-id');
      expect(result).toHaveProperty('error', 'Failed to create user');
      expect(prismaMock.profile.create).not.toHaveBeenCalled();
    });
    
    it('should handle error during profile creation', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.profile.findUnique.mockResolvedValue(null);
      prismaMock.profile.create.mockRejectedValue(new Error('Profile creation failed'));

      const result = await createProfile(mockUser.auth0Id);
      expect(result).toHaveProperty('error', 'Failed to create profile');
    });
  });

  describe('updateBasicProfile', () => {
    it('should update basic profile information including title', async () => {
      const updateData: BasicProfileFormData = {
        location: 'Los Angeles',
        contactEmail: 'new-contact@example.com',
        phone: '987-654-3210',
        title: 'Senior Pilot',
      };
      const expectedProfile = {
        ...mockProfile,
        location: updateData.location,
        contactEmail: updateData.contactEmail,
        phone: updateData.phone,
        title: updateData.title,
      };
      prismaMock.profile.update.mockResolvedValue(expectedProfile);

      const result = await updateBasicProfile(mockProfileId, updateData);

      expect(prismaMock.profile.update).toHaveBeenCalledWith({
        where: { id: mockProfileId },
        data: {
           title: updateData.title,
           location: updateData.location,
           contactEmail: updateData.contactEmail,
           phone: updateData.phone,
           website: undefined,
           bio: undefined
        },
      });
      expect(result.success).toBe(true);
      expect(result.profile).toEqual(expectedProfile);
    });

    it('should handle errors during update', async () => {
      const updateData = {
        location: 'Los Angeles',
      };

      // Mock an error during update
      prismaMock.profile.update.mockRejectedValue(new Error('Update failed'));

      const result = await updateBasicProfile(mockProfileId, updateData);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('updateAdditionalInfo', () => {
    it('should update additional profile information including new fields', async () => {
      const updateData: AdditionalInfoFormData = {
        bio: 'Updated professional bio.',
        businessName: 'Updated Drone Co.',
        website: 'https://updated.example.com',
        specializations: ['Mapping', 'Inspection'],
        serviceArea: 'West Coast',
        languages: ['English', 'German'],
        insuranceDetails: 'Increased coverage',
      };
      const expectedProfile = { ...mockProfile, ...updateData };
      prismaMock.profile.update.mockResolvedValue(expectedProfile);

      const result = await updateAdditionalInfo(mockProfileId, updateData);

      expect(prismaMock.profile.update).toHaveBeenCalledWith({
        where: { id: mockProfileId },
        data: updateData,
      });
      expect(result.success).toBe(true);
      expect(result.profile).toEqual(expectedProfile);
    });

     it('should handle errors during update', async () => {
      const updateData: AdditionalInfoFormData = {
        specializations: ['Mapping'], languages: ['English']
      };
      prismaMock.profile.update.mockRejectedValue(new Error('Update failed'));
      const result = await updateAdditionalInfo(mockProfileId, updateData);
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error', 'Failed to update profile');
    });
  });

  describe('getFullProfile', () => {
    it('should fetch a profile with all related data including categories', async () => {
      const fullProfileData = {
        ...mockProfile,
        categories: [{id: 'cat-1', profileId: mockProfileId, name: 'Events', description: 'Weddings', createdAt: new Date(), updatedAt: new Date()}],
      };
      prismaMock.profile.findUnique.mockResolvedValue(fullProfileData);

      const result = await getFullProfile(mockUserId);

      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          experiences: true,
          equipment: true,
          certifications: true,
          galleryItems: true,
        },
      });
      expect(result).toEqual({ profile: fullProfileData });
    });

    it('should handle errors during fetch', async () => {
      prismaMock.profile.findUnique.mockRejectedValue(new Error('Fetch failed'));

      const result = await getFullProfile(mockUserId);

      expect(result).toHaveProperty('error');
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', async () => {
      prismaMock.profile.delete.mockResolvedValue(mockProfile);

      const result = await deleteProfile(mockProfileId);

      expect(prismaMock.profile.delete).toHaveBeenCalledWith({
        where: { id: mockProfileId },
      });
      expect(result.success).toBe(true);
    });

    it('should handle errors during deletion', async () => {
      prismaMock.profile.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await deleteProfile(mockProfileId);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });
}); 