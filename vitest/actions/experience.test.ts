import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import REAL db
import { prismaMock } from '../setup/db' // Import mock implementation
import { mockReset } from 'vitest-mock-extended' // Correct import
import {
  addExperience,
  updateExperience,
  deleteExperience,
  getProfileExperiences,
} from '@/actions/experience'
import { Prisma, Experience } from '@prisma/client' // Import Prisma types

// Explicitly mock the db path
vi.mock('@/lib/db')

describe('Experience Actions', () => {
  const profileId = 'prof_exp123'
  const experienceId = 'exp_job456'
  const experienceData = {
    title: 'Lead Drone Pilot',
    company: 'Sky High Inc.',
    location: 'New York, NY',
    startDate: new Date(2020, 0, 1), // Jan 1, 2020
    endDate: new Date(2022, 11, 31), // Dec 31, 2022
    description: 'Managed drone operations.',
  }

  beforeEach(() => {
    mockReset(prismaMock)
    vi.mocked(realDb).experience = prismaMock.experience
  })

  // -- Tests for addExperience --
  describe('addExperience', () => {
    const newExperience: Experience = {
      id: experienceId,
      profileId,
      ...experienceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should add experience successfully', async () => {
      prismaMock.experience.create.mockResolvedValue(newExperience)

      const result = await addExperience(profileId, experienceData)

      expect(prismaMock.experience.create).toHaveBeenCalledWith({
        data: { ...experienceData, profileId },
      })
      expect(result).toEqual({ success: true, experience: newExperience })
    })

    it('should return error if database creation fails', async () => {
      const dbError = new Error('DB create failed')
      prismaMock.experience.create.mockRejectedValue(dbError)

      const result = await addExperience(profileId, experienceData)

      expect(prismaMock.experience.create).toHaveBeenCalled()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to add experience')
      expect(result.experience).toBeUndefined()
    })
  })

  // -- Tests for updateExperience --
  describe('updateExperience', () => {
    // Define the type locally, matching the action file
    type ExperienceData = {
      title: string;
      company?: string;
      location?: string;
      startDate: Date;
      endDate?: Date | null;
      description?: string;
    };

    // Define the full data for the update, using the local ExperienceData type
    const updatedExperienceData: ExperienceData = {
        title: 'Senior Drone Pilot', // The updated field
        company: experienceData.company,
        location: experienceData.location,
        startDate: experienceData.startDate, // Required field
        endDate: experienceData.endDate,
        description: experienceData.description,
    }
    
    // Explicitly construct the result object, mapping undefined to null
    const updatedExperienceResult: Experience = {
      id: experienceId,
      profileId,
      title: updatedExperienceData.title,
      company: updatedExperienceData.company ?? null,
      location: updatedExperienceData.location ?? null,
      startDate: updatedExperienceData.startDate,
      endDate: updatedExperienceData.endDate === undefined ? null : updatedExperienceData.endDate, // Handle undefined explicitly for Date | null
      description: updatedExperienceData.description ?? null,
      createdAt: new Date(), // Keep existing or use new for mock?
      updatedAt: new Date(), // Should be a new date
    }

    it('should update experience successfully', async () => {
      prismaMock.experience.update.mockResolvedValue(updatedExperienceResult)

      // Pass the object matching the local ExperienceData type
      const result = await updateExperience(experienceId, updatedExperienceData)

      expect(prismaMock.experience.update).toHaveBeenCalledWith({
        where: { id: experienceId },
        data: updatedExperienceData, // Expect the object matching ExperienceData
      })
      expect(result).toEqual({ success: true, experience: updatedExperienceResult })
    })

    it('should return error if database update fails', async () => {
      const dbError = new Error('DB update failed')
      prismaMock.experience.update.mockRejectedValue(dbError)

      // Pass the object matching the local ExperienceData type
      const result = await updateExperience(experienceId, updatedExperienceData)

      expect(prismaMock.experience.update).toHaveBeenCalled()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to update experience')
      expect(result.experience).toBeUndefined()
    })
  })

  // -- Tests for deleteExperience --
  describe('deleteExperience', () => {
     const deletedExperience: Experience = {
       id: experienceId, profileId, ...experienceData, createdAt: new Date(), updatedAt: new Date()
     }
    
    it('should delete experience successfully', async () => {
      prismaMock.experience.delete.mockResolvedValue(deletedExperience) 

      const result = await deleteExperience(experienceId)

      expect(prismaMock.experience.delete).toHaveBeenCalledWith({ where: { id: experienceId } })
      expect(result).toEqual({ success: true })
      expect(result.error).toBeUndefined()
    })

    it('should return error if database deletion fails', async () => {
      const dbError = new Error('DB delete failed')
      prismaMock.experience.delete.mockRejectedValue(dbError)

      const result = await deleteExperience(experienceId)

      expect(prismaMock.experience.delete).toHaveBeenCalled()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to delete experience')
      expect(result.experience).toBeUndefined()
    })
  })

  // -- Tests for getProfileExperiences --
  describe('getProfileExperiences', () => {
    const mockExperienceList: Experience[] = [
      { id: 'exp1', profileId, title: 'Job A', startDate: new Date(2022, 0, 1), company: null, location: null, endDate: null, description: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 'exp2', profileId, title: 'Job B', startDate: new Date(2021, 0, 1), company: 'Comp B', location: null, endDate: null, description: null, createdAt: new Date(), updatedAt: new Date() },
    ]

    it('should return list of experiences for a profile', async () => {
      prismaMock.experience.findMany.mockResolvedValue(mockExperienceList)

      const result = await getProfileExperiences(profileId)

      expect(prismaMock.experience.findMany).toHaveBeenCalledWith({
        where: { profileId },
        orderBy: { startDate: 'desc' },
      })
      expect(result).toEqual({ experiences: mockExperienceList })
      expect(result.error).toBeUndefined()
    })

    it('should return error if database fetch fails', async () => {
      const dbError = new Error('DB fetch failed')
      prismaMock.experience.findMany.mockRejectedValue(dbError)

      const result = await getProfileExperiences(profileId)

      expect(prismaMock.experience.findMany).toHaveBeenCalled()
      expect(result.experiences).toBeUndefined()
      expect(result.error).toContain('Failed to load experiences')
    })
  })
})
