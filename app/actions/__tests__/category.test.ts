import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prismaMock } from '../../../vitest/setup/prisma-mock'
import {
  getAllCategories,
  getProfileCategories,
  setProfileCategories,
  CategoriesResponse,
  SetProfileCategoriesResponse,
  Category
} from '../category' // Adjust the import path as necessary

// Mock Data
const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Aerial Photography',
    description: 'Capturing images from the sky',
    profileId: null, // Categories might not be directly linked to a single profile in the table itself
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-2',
    name: 'Real Estate Videography',
    description: 'Creating videos for property listings',
    profileId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-3',
    name: 'Events',
    description: 'Weddings, festivals, etc.',
    profileId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockProfileId = 'profile-123'

describe('Category Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  // Test: getAllCategories
  describe('getAllCategories', () => {
    it('should return all categories ordered by name', async () => {
      prismaMock.category.findMany.mockResolvedValue(mockCategories)

      const result: CategoriesResponse = await getAllCategories()

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      })
      expect(result.categories).toEqual(mockCategories)
      expect(result.error).toBeUndefined()
    })

    it('should handle errors during fetch', async () => {
      prismaMock.category.findMany.mockRejectedValue(new Error('Fetch failed'))

      const result: CategoriesResponse = await getAllCategories()

      expect(result.categories).toBeUndefined()
      expect(result.error).toBe('Failed to load categories.')
    })
  })

  // Test: getProfileCategories
  describe('getProfileCategories', () => {
    it('should return categories for a specific profile', async () => {
      const profileWithCategories = {
        categories: [mockCategories[0], mockCategories[2]], // Example subset
      }
      // Mock the profile findUnique call selecting categories
      prismaMock.profile.findUnique.mockResolvedValue(profileWithCategories as any) // Use 'as any' for simplified mock structure

      const result: CategoriesResponse = await getProfileCategories(mockProfileId)

      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({
        where: { id: mockProfileId },
        select: {
          categories: { 
            orderBy: { name: 'asc' }
          }
        },
      })
      expect(result.categories).toEqual(profileWithCategories.categories)
      expect(result.error).toBeUndefined()
    })
    
    it('should return error if profile not found', async () => {
        prismaMock.profile.findUnique.mockResolvedValue(null);
        
        const result: CategoriesResponse = await getProfileCategories(mockProfileId);
        
        expect(result.categories).toBeUndefined();
        expect(result.error).toBe('Profile not found.');
    })

    it('should handle errors during fetch', async () => {
      prismaMock.profile.findUnique.mockRejectedValue(new Error('Fetch failed'))

      const result: CategoriesResponse = await getProfileCategories(mockProfileId)

      expect(result.categories).toBeUndefined()
      expect(result.error).toBe('Failed to load profile categories.')
    })
  })

  // Test: setProfileCategories
  describe('setProfileCategories', () => {
    it('should update profile categories using set', async () => {
      const categoryIdsToSet = [mockCategories[1].id, mockCategories[2].id]
      prismaMock.profile.update.mockResolvedValue({ id: mockProfileId } as any) // Mock successful update

      const result: SetProfileCategoriesResponse = await setProfileCategories(
        mockProfileId,
        categoryIdsToSet
      )

      expect(prismaMock.profile.update).toHaveBeenCalledWith({
        where: { id: mockProfileId },
        data: {
          categories: {
            set: categoryIdsToSet.map((id) => ({ id })),
          },
        },
      })
      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should handle errors during update', async () => {
      prismaMock.profile.update.mockRejectedValue(new Error('Update failed'))

      const result: SetProfileCategoriesResponse = await setProfileCategories(
        mockProfileId,
        [mockCategories[0].id]
      )

      expect(result.success).toBeUndefined()
      expect(result.error).toBe('Failed to update profile categories.')
    })
  })
}) 