import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import the REAL db object
import { prismaMock } from '../setup/db' // Import the mock implementation
import { createProfile } from '@/actions/profile'
import { Prisma, Role } from '@prisma/client'
import {
  updateBasicProfile,
  updateAdditionalInfo,
  getFullProfile,
  deleteProfile,
  type BasicProfileFormData,
  type AdditionalInfoFormData,
} from '@/actions/profile'
import { revalidatePath } from 'next/cache' // Import for mocking check
import { mockReset } from 'vitest-mock-extended' // Import mockReset

// Explicitly mock the path used by the actions
vi.mock('@/lib/db')

describe('Profile Actions', () => { // Combine describe blocks for simplicity with this mocking
  const auth0Id = 'auth0|testuser123'
  const userId = 'user_clt123abc'
  const profileId = 'prof_xyz789'

  beforeEach(() => {
    // Reset the mock implementation before each test
    mockReset(prismaMock)
    // Assign the mock implementation to the mocked db object
    vi.mocked(realDb).user = prismaMock.user
    vi.mocked(realDb).profile = prismaMock.profile
    // Add other models if profile actions use them directly
    
    // Also reset other mocks if needed
    vi.mocked(revalidatePath).mockClear()
  })

  // -- createProfile tests --
  describe('createProfile', () => {
    it('should create a new user and profile if neither exist', async () => {
      // Mocks are now set on prismaMock directly
      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue({ id: userId, auth0Id, email:'', role: Role.PHOTOGRAPHER, name:'', createdAt: new Date(), updatedAt: new Date() })
      prismaMock.profile.findUnique.mockResolvedValue(null)
      const newProfile = { id: profileId, userId, specializations:[], languages:[], createdAt: new Date(), updatedAt: new Date(), title:null, location:null, website:null, bio:null, contactEmail:null, phone:null, businessName:null, serviceArea:null, insuranceDetails:null }
      prismaMock.profile.create.mockResolvedValue(newProfile)

      const result = await createProfile(auth0Id)

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { auth0Id } })
      expect(prismaMock.user.create).toHaveBeenCalled()
      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({ where: { userId } })
      expect(prismaMock.profile.create).toHaveBeenCalled()
      expect(result).toEqual({ profile: newProfile })
    })

     it('should create only a new profile if user exists but profile does not', async () => {
       const existingUser = { id: userId, auth0Id, email:'', role: Role.CLIENT, name:'', createdAt: new Date(), updatedAt: new Date() }
       prismaMock.user.findUnique.mockResolvedValue(existingUser)
       prismaMock.profile.findUnique.mockResolvedValue(null)
       const newProfile = { id: profileId, userId, specializations:[], languages:[], createdAt: new Date(), updatedAt: new Date(), title:null, location:null, website:null, bio:null, contactEmail:null, phone:null, businessName:null, serviceArea:null, insuranceDetails:null }
       prismaMock.profile.create.mockResolvedValue(newProfile)

       const result = await createProfile(auth0Id)

       expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { auth0Id } })
       expect(prismaMock.user.create).not.toHaveBeenCalled()
       expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({ where: { userId: existingUser.id } })
       expect(prismaMock.profile.create).toHaveBeenCalled()
       expect(result).toEqual({ profile: newProfile })
     })
     
     it('should return the existing profile if both user and profile exist', async () => {
        const existingUser = { id: userId, auth0Id, email:'', role: Role.PHOTOGRAPHER, name:'', createdAt: new Date(), updatedAt: new Date() }
        const existingProfile = { id: profileId, userId, title: 'Pro', location: 'City', specializations:[], languages:[], createdAt: new Date(), updatedAt: new Date(), website:null, bio:null, contactEmail:null, phone:null, businessName:null, serviceArea:null, insuranceDetails:null }
        prismaMock.user.findUnique.mockResolvedValue(existingUser)
        prismaMock.profile.findUnique.mockResolvedValue(existingProfile)

        const result = await createProfile(auth0Id)

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { auth0Id } })
        expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({ where: { userId: existingUser.id } })
        expect(prismaMock.user.create).not.toHaveBeenCalled()
        expect(prismaMock.profile.create).not.toHaveBeenCalled()
        expect(result).toEqual({ profile: existingProfile })
     })

     it('should return an error if user creation fails', async () => {
        const creationError = new Error('User create error')
        prismaMock.user.findUnique.mockResolvedValue(null)
        prismaMock.user.create.mockRejectedValue(creationError)

        const result = await createProfile(auth0Id)

        expect(prismaMock.user.findUnique).toHaveBeenCalled()
        expect(prismaMock.user.create).toHaveBeenCalled()
        expect(prismaMock.profile.findUnique).not.toHaveBeenCalled()
        expect(prismaMock.profile.create).not.toHaveBeenCalled()
        expect(result).toEqual({ error: `Failed to create user: ${creationError.message}` })
     })

     it('should return an error if profile creation fails', async () => {
        const existingUser = { id: userId, auth0Id, email:'', role: Role.CLIENT, name:'', createdAt: new Date(), updatedAt: new Date() }
        const creationError = new Error('Profile create error')
        prismaMock.user.findUnique.mockResolvedValue(existingUser)
        prismaMock.profile.findUnique.mockResolvedValue(null)
        prismaMock.profile.create.mockRejectedValue(creationError)

        const result = await createProfile(auth0Id)

        expect(prismaMock.user.findUnique).toHaveBeenCalled()
        expect(prismaMock.user.create).not.toHaveBeenCalled()
        expect(prismaMock.profile.findUnique).toHaveBeenCalled()
        expect(prismaMock.profile.create).toHaveBeenCalled()
        expect(result).toEqual({ error: `Failed to create profile: ${creationError.message}` })
     })
  })
  
  // -- updateBasicProfile tests --
  describe('updateBasicProfile', () => {
     const basicData: BasicProfileFormData = {
       title: 'Pilot',
       location: 'Mars',
       website: 'site.com',
       bio: undefined, // Example of an optional field not provided
       contactEmail: 'email@test.com',
       phone: undefined
     }
     // Explicitly define the expected result, mapping undefined to null
     const updatedProfile: Prisma.ProfileGetPayload<{}> = {
       id: profileId,
       userId, 
       title: basicData.title ?? null,
       location: basicData.location ?? null,
       website: basicData.website ?? null,
       bio: basicData.bio ?? null,
       contactEmail: basicData.contactEmail ?? null,
       phone: basicData.phone ?? null,
       // Include other necessary fields from Profile model, setting to null if optional and not in basicData
       businessName: null,
       specializations: [],
       serviceArea: null,
       languages: [],
       insuranceDetails: null,
       createdAt: new Date(), 
       updatedAt: new Date()
     }

     it('should update basic profile info and revalidate path', async () => {
       prismaMock.profile.update.mockResolvedValue(updatedProfile)
       
       const result = await updateBasicProfile(profileId, basicData)

       expect(prismaMock.profile.update).toHaveBeenCalledWith({ where: { id: profileId }, data: basicData })
       expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
       expect(result).toEqual({ success: true, profile: updatedProfile })
     })

     it('should return an error if update fails', async () => {
       const updateError = new Error('Update failed')
       prismaMock.profile.update.mockRejectedValue(updateError)

       const result = await updateBasicProfile(profileId, basicData)

       expect(prismaMock.profile.update).toHaveBeenCalled()
       expect(revalidatePath).not.toHaveBeenCalled()
       expect(result).toEqual({ success: false, error: 'Failed to update profile' })
     })
  })
  
  // -- updateAdditionalInfo tests --
   describe('updateAdditionalInfo', () => {
     const additionalData: AdditionalInfoFormData = { 
         bio: 'Bio', 
         businessName: 'Biz Name', 
         website: undefined,
         specializations:['A', 'B'], 
         serviceArea: 'Area 51', 
         languages: ['Klingon'],
         insuranceDetails: undefined
     }
     // Explicitly define the expected result, mapping undefined to null
     const updatedProfile: Prisma.ProfileGetPayload<{}> = {
       id: profileId, 
       userId, 
       bio: additionalData.bio ?? null,
       businessName: additionalData.businessName ?? null,
       website: additionalData.website ?? null,
       specializations: additionalData.specializations, // Arrays are usually handled
       serviceArea: additionalData.serviceArea ?? null,
       languages: additionalData.languages, // Arrays are usually handled
       insuranceDetails: additionalData.insuranceDetails ?? null,
       // Include other necessary fields from Profile model, setting to null if optional and not in additionalData
       title: null,
       location: null,
       contactEmail: null,
       phone: null,
       createdAt: new Date(), 
       updatedAt: new Date()
     }

     it('should update additional info and revalidate path', async () => {
       prismaMock.profile.update.mockResolvedValue(updatedProfile)
       
       const result = await updateAdditionalInfo(profileId, additionalData)

       expect(prismaMock.profile.update).toHaveBeenCalledWith({ where: { id: profileId }, data: additionalData })
       expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
       expect(result).toEqual({ success: true, profile: updatedProfile })
     })

     it('should return an error if update fails', async () => {
       const updateError = new Error('Update failed')
       prismaMock.profile.update.mockRejectedValue(updateError)

       const result = await updateAdditionalInfo(profileId, additionalData)

       expect(prismaMock.profile.update).toHaveBeenCalled()
       expect(revalidatePath).not.toHaveBeenCalled()
       expect(result).toEqual({ success: false, error: 'Failed to update profile' })
     })
   })

  // -- getFullProfile tests --
   describe('getFullProfile', () => {
     const fullProfile = { id: profileId, userId, title: 'Pilot', experiences:[], equipment:[], certifications:[], galleryItems:[], specializations:[], languages:[], createdAt: new Date(), updatedAt: new Date(), location:null, website:null, bio:null, contactEmail:null, phone:null, businessName:null, serviceArea:null, insuranceDetails:null }

     it('should fetch the full profile with relations', async () => {
       prismaMock.profile.findUnique.mockResolvedValue(fullProfile)

       const result = await getFullProfile(userId)

       const expectedInclude = { experiences: true, equipment: true, certifications: true, galleryItems: true }
       expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({ where: { userId }, include: expectedInclude })
       expect(result).toEqual({ profile: fullProfile })
     })

     it('should return an error if profile not found or fetch fails', async () => {
       const fetchError = new Error('Fetch failed')
       prismaMock.profile.findUnique.mockRejectedValue(fetchError)

       const result = await getFullProfile(userId)

       expect(prismaMock.profile.findUnique).toHaveBeenCalled()
       expect(result).toEqual({ error: 'Failed to fetch profile' })
     })
   })

  // -- deleteProfile tests --
   describe('deleteProfile', () => {
     it('should delete the profile and revalidate path', async () => {
       prismaMock.profile.delete.mockResolvedValue({ id: profileId } as any)

       const result = await deleteProfile(profileId)

       expect(prismaMock.profile.delete).toHaveBeenCalledWith({ where: { id: profileId } })
       expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
       expect(result).toEqual({ success: true })
     })

     it('should return an error if deletion fails', async () => {
       const deleteError = new Error('Delete failed')
       prismaMock.profile.delete.mockRejectedValue(deleteError)

       const result = await deleteProfile(profileId)

       expect(prismaMock.profile.delete).toHaveBeenCalled()
       expect(revalidatePath).not.toHaveBeenCalled()
       expect(result).toEqual({ success: false, error: 'Failed to delete profile' })
     })
   })
})
