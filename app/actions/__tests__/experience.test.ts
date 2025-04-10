import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prismaMock } from '../../../vitest/setup/prisma-mock';
import { addExperience, updateExperience, deleteExperience, getProfileExperiences } from '../experience';

describe('Experience Actions', () => {
  const mockProfileId = 'profile-123';
  const mockExperienceId = 'exp-123';
  
  const mockExperience = {
    id: mockExperienceId,
    profileId: mockProfileId,
    title: 'Drone Photographer',
    company: 'Aerial Studios',
    location: 'New York',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2023-01-01'),
    description: 'Captured aerial footage for real estate clients',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('addExperience', () => {
    it('should add a new experience entry', async () => {
      const newExperienceData = {
        title: 'Drone Photographer',
        company: 'Aerial Studios',
        location: 'New York',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-01-01'),
        description: 'Captured aerial footage for real estate clients',
      };

      prismaMock.experience.create.mockResolvedValue(mockExperience);

      const result = await addExperience(mockProfileId, newExperienceData);

      expect(prismaMock.experience.create).toHaveBeenCalledWith({
        data: {
          ...newExperienceData,
          profileId: mockProfileId,
        },
      });
      expect(result.success).toBe(true);
      expect(result.experience).toEqual(mockExperience);
    });

    it('should handle errors during creation', async () => {
      const newExperienceData = {
        title: 'Drone Photographer',
        startDate: new Date('2022-01-01'),
      };

      prismaMock.experience.create.mockRejectedValue(new Error('Creation failed'));

      const result = await addExperience(mockProfileId, newExperienceData);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('updateExperience', () => {
    it('should update an existing experience entry', async () => {
      const updateData = {
        title: 'Senior Drone Photographer',
        description: 'Updated job description',
        startDate: new Date('2022-01-01'),
      };

      prismaMock.experience.update.mockResolvedValue({
        ...mockExperience,
        ...updateData,
      });

      const result = await updateExperience(mockExperienceId, updateData);

      expect(prismaMock.experience.update).toHaveBeenCalledWith({
        where: { id: mockExperienceId },
        data: updateData,
      });
      expect(result.success).toBe(true);
      expect(result.experience).toEqual({
        ...mockExperience,
        ...updateData,
      });
    });

    it('should handle errors during update', async () => {
      const updateData = {
        title: 'Senior Drone Photographer',
        startDate: new Date('2022-01-01'),
      };

      prismaMock.experience.update.mockRejectedValue(new Error('Update failed'));

      const result = await updateExperience(mockExperienceId, updateData);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('deleteExperience', () => {
    it('should delete an experience entry', async () => {
      prismaMock.experience.delete.mockResolvedValue(mockExperience);

      const result = await deleteExperience(mockExperienceId);

      expect(prismaMock.experience.delete).toHaveBeenCalledWith({
        where: { id: mockExperienceId },
      });
      expect(result.success).toBe(true);
    });

    it('should handle errors during deletion', async () => {
      prismaMock.experience.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await deleteExperience(mockExperienceId);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('getProfileExperiences', () => {
    it('should fetch all experiences for a profile', async () => {
      const mockExperiences = [
        mockExperience,
        {
          ...mockExperience,
          id: 'exp-456',
          title: 'Video Editor',
        },
      ];

      prismaMock.experience.findMany.mockResolvedValue(mockExperiences);

      const result = await getProfileExperiences(mockProfileId);

      expect(prismaMock.experience.findMany).toHaveBeenCalledWith({
        where: { profileId: mockProfileId },
        orderBy: { startDate: 'desc' },
      });
      expect(result).toEqual({ experiences: mockExperiences });
    });

    it('should handle errors during fetch', async () => {
      prismaMock.experience.findMany.mockRejectedValue(new Error('Fetch failed'));

      const result = await getProfileExperiences(mockProfileId);

      expect(result).toHaveProperty('error');
    });
  });
}); 