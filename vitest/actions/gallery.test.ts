import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import REAL db
import { prismaMock } from '../setup/db' // Import mock implementation
import { mockReset } from 'vitest-mock-extended' // Correct import
import { uploadFile, deleteFile } from '@/lib/supabase' // Keep import for mock clearing
import {
  addGalleryItem,
  updateGalleryItemMetadata,
  deleteGalleryItem,
  getProfileGalleryItems,
} from '@/actions/gallery'
import type { GalleryItem } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Explicitly mock the db path
vi.mock('@/lib/db')

// Mock File object
const mockImageFile = new File(['dummy image'], 'test.jpg', { type: 'image/jpeg' })
const mockVideoFile = new File(['dummy video'], 'test.mp4', { type: 'video/mp4' })
// Define storage bucket globally
const storageBucket = 'gallery'

describe('Gallery Actions', () => {
  const profileId = 'prof_gal123'
  const galleryItemId = 'gal_item_abc789'
  // Define mockFileUrl here, where profileId is in scope
  const mockFileUrl = `https://supabase.co/storage/v1/gallery/profiles/${profileId}/test.jpg`
  const baseItemData = {
    title: 'Test Item',
    description: 'A description',
  }

  beforeEach(() => {
    mockReset(prismaMock)
    vi.mocked(realDb).galleryItem = prismaMock.galleryItem
    // Reset other mocks
    vi.mocked(uploadFile).mockClear()
    vi.mocked(deleteFile).mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  // -- Tests for addGalleryItem --
  describe('addGalleryItem', () => {
    it('should add an IMAGE gallery item', async () => {
      const itemData = { ...baseItemData, type: 'IMAGE' as const }
      const newItem: GalleryItem = {
        id: galleryItemId,
        profileId,
        ...itemData,
        imageUrl: mockFileUrl,
        videoUrl: null,
        categoryId: null,
        location: null,
        featured: false,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vi.mocked(uploadFile).mockResolvedValue({ url: mockFileUrl })
      prismaMock.galleryItem.create.mockResolvedValue(newItem)

      const result = await addGalleryItem(profileId, itemData, mockImageFile)

      const expectedUploadPath = `profiles/${profileId}`
      expect(uploadFile).toHaveBeenCalledWith(mockImageFile, storageBucket, expectedUploadPath)
      expect(prismaMock.galleryItem.create).toHaveBeenCalledWith({
        data: {
          ...itemData,
          profileId,
          imageUrl: mockFileUrl,
          videoUrl: undefined,
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, galleryItem: newItem })
    })

    it('should add a VIDEO gallery item', async () => {
       const itemData = { ...baseItemData, type: 'VIDEO' as const }
       const newItem: GalleryItem = {
         id: galleryItemId,
         profileId,
         ...itemData,
         imageUrl: null,
         videoUrl: mockFileUrl,
         categoryId: null,
         location: null,
         featured: false,
         views: 0,
         createdAt: new Date(),
         updatedAt: new Date(),
       }
       vi.mocked(uploadFile).mockResolvedValue({ url: mockFileUrl })
       prismaMock.galleryItem.create.mockResolvedValue(newItem)

       const result = await addGalleryItem(profileId, itemData, mockVideoFile)

       const expectedUploadPath = `profiles/${profileId}`
       expect(uploadFile).toHaveBeenCalledWith(mockVideoFile, storageBucket, expectedUploadPath)
       expect(prismaMock.galleryItem.create).toHaveBeenCalledWith({
         data: {
           ...itemData,
           profileId,
           videoUrl: mockFileUrl,
           imageUrl: undefined,
         },
       })
       expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
       expect(result).toEqual({ success: true, galleryItem: newItem })
    })

    it('should return error if file upload fails', async () => {
      const itemData = { ...baseItemData, type: 'IMAGE' as const }
      vi.mocked(uploadFile).mockResolvedValue({ error: 'Upload failed' })
      const result = await addGalleryItem(profileId, itemData, mockImageFile)
      expect(prismaMock.galleryItem.create).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to add gallery item' })
    })

    it('should return error if database creation fails', async () => {
      const itemData = { ...baseItemData, type: 'IMAGE' as const }
      vi.mocked(uploadFile).mockResolvedValue({ url: mockFileUrl })
      prismaMock.galleryItem.create.mockRejectedValue(new Error('DB Error'))
      const result = await addGalleryItem(profileId, itemData, mockImageFile)
      expect(prismaMock.galleryItem.create).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to add gallery item' })
    })
  })

  // -- Tests for updateGalleryItemMetadata --
  describe('updateGalleryItemMetadata', () => {
    const updateData = { title: 'Updated Title', description: 'New description' }
    const existingItem: GalleryItem = {
        id: galleryItemId, profileId, type: 'IMAGE', imageUrl: mockFileUrl, videoUrl: null, categoryId: null, location: null, featured: false, views: 0, createdAt: new Date(), updatedAt: new Date(), title: 'Old Title', description: 'Old Desc'
    }
    const updatedItem = { ...existingItem, ...updateData, updatedAt: new Date() }

    it('should update metadata and revalidate path', async () => {
      prismaMock.galleryItem.update.mockResolvedValue(updatedItem)

      const result = await updateGalleryItemMetadata(galleryItemId, updateData)

      expect(prismaMock.galleryItem.update).toHaveBeenCalledWith({
        where: { id: galleryItemId },
        data: updateData,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, galleryItem: updatedItem })
    })

    it('should return error if database update fails', async () => {
      prismaMock.galleryItem.update.mockRejectedValue(new Error('DB update failed'))

      const result = await updateGalleryItemMetadata(galleryItemId, updateData)

      expect(prismaMock.galleryItem.update).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to update gallery item' })
    })
  })

  // -- Tests for deleteGalleryItem --
  describe('deleteGalleryItem', () => {
    const baseItem: GalleryItem = {
      id: galleryItemId, profileId, type: 'IMAGE', title: '', description: null, categoryId: null, location: null, featured: false, views: 0, createdAt: new Date(), updatedAt: new Date(), imageUrl: null, videoUrl: null
    }
    // itemWithImage and itemWithVideo will now use the correctly scoped mockFileUrl
    const itemWithImage: GalleryItem = { ...baseItem, imageUrl: mockFileUrl }
    const itemWithVideo: GalleryItem = { ...baseItem, type: 'VIDEO', videoUrl: mockFileUrl }
    const filePath = `profiles/${profileId}/test.jpg`

    it('should delete item with image URL and revalidate', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(itemWithImage)
      vi.mocked(deleteFile).mockResolvedValue({ success: true })
      prismaMock.galleryItem.delete.mockResolvedValue(itemWithImage)
      const result = await deleteGalleryItem(galleryItemId)
      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).toHaveBeenCalledWith(storageBucket, filePath)
      expect(prismaMock.galleryItem.delete).toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true })
    })
    
    it('should delete item with video URL and revalidate', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(itemWithVideo)
      vi.mocked(deleteFile).mockResolvedValue({ success: true })
      prismaMock.galleryItem.delete.mockResolvedValue(itemWithVideo)
      const result = await deleteGalleryItem(galleryItemId)
      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).toHaveBeenCalledWith(storageBucket, filePath)
      expect(prismaMock.galleryItem.delete).toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true })
    })

    it('should delete item without URL and revalidate', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(baseItem)
      prismaMock.galleryItem.delete.mockResolvedValue(baseItem)

      const result = await deleteGalleryItem(galleryItemId)

      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).not.toHaveBeenCalled()
      expect(prismaMock.galleryItem.delete).toHaveBeenCalledWith({ where: { id: galleryItemId } })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true })
    })
    
    it('should return error if item not found', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(null)

      const result = await deleteGalleryItem(galleryItemId)

      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).not.toHaveBeenCalled()
      expect(prismaMock.galleryItem.delete).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to delete gallery item' })
    })
    
    it('should return error if file deletion fails', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(itemWithImage)
      vi.mocked(deleteFile).mockRejectedValue(new Error('Storage error'))
      const result = await deleteGalleryItem(galleryItemId)
      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).toHaveBeenCalledWith(storageBucket, filePath)
      expect(prismaMock.galleryItem.delete).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to delete gallery item' })
    })

    it('should return error if database deletion fails', async () => {
      prismaMock.galleryItem.findUnique.mockResolvedValue(itemWithImage)
      vi.mocked(deleteFile).mockResolvedValue({ success: true })
      prismaMock.galleryItem.delete.mockRejectedValue(new Error('DB delete failed'))

      const result = await deleteGalleryItem(galleryItemId)

      expect(prismaMock.galleryItem.findUnique).toHaveBeenCalled()
      expect(deleteFile).toHaveBeenCalled()
      expect(prismaMock.galleryItem.delete).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to delete gallery item' })
    })
  })

  // -- Tests for getProfileGalleryItems --
  describe('getProfileGalleryItems', () => {
     const mockItemList: GalleryItem[] = [
       { id: 'gal1', profileId, title: 'Image 1', type: 'IMAGE', imageUrl: 'url1', videoUrl: null, categoryId: null, location: null, featured: false, views: 0, createdAt: new Date(), updatedAt: new Date(), description: null },
       { id: 'gal2', profileId, title: 'Video 1', type: 'VIDEO', imageUrl: null, videoUrl: 'url2', categoryId: null, location: null, featured: true, views: 10, createdAt: new Date(), updatedAt: new Date(), description: null },
     ]

     it('should return list of gallery items for a profile', async () => {
       prismaMock.galleryItem.findMany.mockResolvedValue(mockItemList)

       const result = await getProfileGalleryItems(profileId)

       expect(prismaMock.galleryItem.findMany).toHaveBeenCalledWith({
         where: { profileId },
         orderBy: { createdAt: 'desc' },
       })
       expect(result).toEqual({ galleryItems: mockItemList })
     })

     it('should return error if database fetch fails', async () => {
       const dbError = new Error('DB fetch failed')
       prismaMock.galleryItem.findMany.mockRejectedValue(dbError)

       const result = await getProfileGalleryItems(profileId)

       expect(prismaMock.galleryItem.findMany).toHaveBeenCalled()
       expect(result).toEqual({ error: 'Failed to fetch gallery items' })
     })
  })
})
