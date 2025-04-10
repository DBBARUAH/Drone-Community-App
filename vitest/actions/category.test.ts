import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import REAL db
import { prismaMock } from '../setup/db' // Import mock implementation
import { mockReset } from 'vitest-mock-extended' // Correct import for mockReset
import {
  getAllCategories,
  getProfileCategories,
  setProfileCategories,
  type Category as ActionCategory,
} from '@/actions/category'
import type { Category as PrismaCategory } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Explicitly mock the db path
vi.mock('@/lib/db')

describe('Category Actions', () => {
  const profileId = 'prof_abc123'
  const categoryIds = ['cat1', 'cat3']

  beforeEach(() => {
    // Reset mock implementation
    mockReset(prismaMock)
    // Assign mock methods to the mocked realDb
    vi.mocked(realDb).category = prismaMock.category
    vi.mocked(realDb).profile = prismaMock.profile
    // Reset other mocks
    vi.mocked(revalidatePath).mockClear()
  })

  // -- Tests for getAllCategories --
  describe('getAllCategories', () => {
    it('should return all categories ordered by name', async () => {
      const mockCategories: PrismaCategory[] = [
        { id: 'cat2', name: 'Events', description: 'Desc 2', profileId: 'prof1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'cat1', name: 'Real Estate', description: 'Desc 1', profileId: 'prof1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'cat4', name: 'Weddings', description: null, profileId: 'prof2', createdAt: new Date(), updatedAt: new Date() },
      ]
      prismaMock.category.findMany.mockResolvedValue(mockCategories)

      const result = await getAllCategories()

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } })
      expect(result).toEqual({ categories: mockCategories as ActionCategory[] })
    })

    it('should return an error if fetching fails', async () => {
      const fetchError = new Error('DB connection error')
      prismaMock.category.findMany.mockRejectedValue(fetchError)

      const result = await getAllCategories()

      expect(prismaMock.category.findMany).toHaveBeenCalled()
      expect(result).toEqual({ error: 'Failed to load categories.' })
    })
  })

  // -- Tests for getProfileCategories --
  describe('getProfileCategories', () => {
    it('should return categories associated with a profile', async () => {
      const mockProfileWithCategories = {
        categories: [
          { id: 'cat1', name: 'Category A', description: null, profileId: profileId, createdAt: new Date(), updatedAt: new Date() },
          { id: 'cat3', name: 'Category C', description: null, profileId: profileId, createdAt: new Date(), updatedAt: new Date() },
        ],
      }
      // Mock the profile model directly
      prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithCategories as any)

      const result = await getProfileCategories(profileId)

      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({
        where: { id: profileId },
        select: {
          categories: { orderBy: { name: 'asc' } },
        },
      })
      expect(result).toEqual({ categories: mockProfileWithCategories.categories })
    })

    it('should return an error if profile is not found', async () => {
      prismaMock.profile.findUnique.mockResolvedValue(null)

      const result = await getProfileCategories(profileId)

      expect(prismaMock.profile.findUnique).toHaveBeenCalled()
      expect(result).toEqual({ error: 'Profile not found.' })
    })

    it('should return an error if fetching profile categories fails', async () => {
      const fetchError = new Error('DB error')
      prismaMock.profile.findUnique.mockRejectedValue(fetchError)

      const result = await getProfileCategories(profileId)

      expect(prismaMock.profile.findUnique).toHaveBeenCalled()
      expect(result).toEqual({ error: 'Failed to load profile categories.' })
    })
  })

  // -- Tests for setProfileCategories --
  describe('setProfileCategories', () => {
    it('should update profile categories and revalidate paths', async () => {
      prismaMock.profile.update.mockResolvedValue({} as any)

      const result = await setProfileCategories(profileId, categoryIds)

      expect(prismaMock.profile.update).toHaveBeenCalledWith({
        where: { id: profileId },
        data: {
          categories: {
            set: categoryIds.map((id) => ({ id })), 
          },
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(revalidatePath).toHaveBeenCalledWith(`/profile/${profileId}`)
      expect(result).toEqual({ success: true })
    })

    it('should return an error if updating profile categories fails', async () => {
      const updateError = new Error('DB update error')
      prismaMock.profile.update.mockRejectedValue(updateError)

      const result = await setProfileCategories(profileId, categoryIds)

      expect(prismaMock.profile.update).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ error: 'Failed to update profile categories.' })
    })
  })
})
