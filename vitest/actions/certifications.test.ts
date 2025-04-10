import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import REAL db
import { prismaMock } from '../setup/db' // Import mock implementation
import { mockReset } from 'vitest-mock-extended' // Import mockReset
import { uploadFile, deleteFile } from '@/lib/supabase' // Mocked functions (already mocked globally, but keep import)
import {
  addCertification,
  updateCertification,
  deleteCertification,
  getProfileCertifications,
} from '@/actions/certifications'
import type { Certification } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Explicitly mock the db path
vi.mock('@/lib/db')

// Mock File object
const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
const mockFileUrl = 'https://supabase.co/storage/v1/object/public/certifications/profiles/prof_abc123/certifications/test.pdf'
const storageBucket = 'certifications'

describe('Certification Actions', () => {
  const profileId = 'prof_abc123'
  const certificationId = 'cert_xyz789'
  const baseCertData = {
    name: 'FAA Part 107',
    issuingBody: 'FAA',
  }

  beforeEach(() => {
    // Reset mock implementation
    mockReset(prismaMock)
    // Assign mock methods to the mocked realDb
    vi.mocked(realDb).certification = prismaMock.certification
    // Reset other mocks
    vi.mocked(uploadFile).mockClear()
    vi.mocked(deleteFile).mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  // -- Tests for addCertification --
  describe('addCertification', () => {
    it('should add a certification without a file', async () => {
      const newCert: Certification = {
        id: certificationId,
        profileId,
        ...baseCertData,
        certificationId: null,
        issueDate: null,
        expiryDate: null,
        credentialUrl: null,
        fileUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.certification.create.mockResolvedValue(newCert)

      const result = await addCertification(profileId, baseCertData)

      expect(prismaMock.certification.create).toHaveBeenCalledWith({
        data: { ...baseCertData, profileId },
      })
      expect(uploadFile).not.toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, certification: newCert })
    })

    it('should add a certification with a file', async () => {
      const newCert: Certification = {
        id: certificationId,
        profileId,
        ...baseCertData,
        certificationId: null,
        issueDate: null,
        expiryDate: null,
        credentialUrl: null,
        fileUrl: mockFileUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vi.mocked(uploadFile).mockResolvedValue({ url: mockFileUrl })
      prismaMock.certification.create.mockResolvedValue(newCert)

      const result = await addCertification(profileId, baseCertData, mockFile)

      const expectedUploadPath = `profiles/${profileId}/certifications`
      expect(uploadFile).toHaveBeenCalledWith(mockFile, storageBucket, expectedUploadPath)
      expect(prismaMock.certification.create).toHaveBeenCalledWith({
        data: {
          ...baseCertData,
          profileId,
          fileUrl: mockFileUrl,
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, certification: newCert })
    })

    it('should return error if file upload fails', async () => {
      const uploadErrorMsg = 'Supabase upload error'
      vi.mocked(uploadFile).mockResolvedValue({ error: uploadErrorMsg })

      const result = await addCertification(profileId, baseCertData, mockFile)

      expect(uploadFile).toHaveBeenCalled()
      expect(prismaMock.certification.create).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to add certification' })
    })

    it('should return error if database creation fails', async () => {
      const dbError = new Error('DB insert failed')
      prismaMock.certification.create.mockRejectedValue(dbError)

      const result = await addCertification(profileId, baseCertData)

      expect(prismaMock.certification.create).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to add certification' })
    })
  })

  // -- Tests for updateCertification --
  describe('updateCertification', () => {
    const updateData = {
      name: 'Updated FAA Part 107',
      credentialUrl: 'http://new-credential.com',
    }
    const existingCert: Certification = {
      id: certificationId,
      profileId,
      ...baseCertData,
      fileUrl: null,
      certificationId: null,
      issueDate: null,
      expiryDate: null,
      credentialUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedCert = { ...existingCert, ...updateData, updatedAt: new Date() }

    it('should update certification details without a file', async () => {
      prismaMock.certification.update.mockResolvedValue(updatedCert)

      const result = await updateCertification(certificationId, updateData)

      expect(prismaMock.certification.update).toHaveBeenCalledWith({
        where: { id: certificationId },
        data: updateData,
      })
      expect(uploadFile).not.toHaveBeenCalled()
      expect(deleteFile).not.toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, certification: updatedCert })
    })

    it('should update certification details with a new file (no existing file)', async () => {
      const newFileUrl = 'https://new-upload.com/file.jpg'
      const certWithNewFile = { ...updatedCert, fileUrl: newFileUrl }
      prismaMock.certification.findUnique.mockResolvedValue(existingCert)
      vi.mocked(uploadFile).mockResolvedValue({ url: newFileUrl })
      prismaMock.certification.update.mockResolvedValue(certWithNewFile)

      const result = await updateCertification(certificationId, updateData, mockFile)

      expect(prismaMock.certification.findUnique).toHaveBeenCalled()
      expect(deleteFile).not.toHaveBeenCalled()
      expect(uploadFile).toHaveBeenCalledWith(mockFile, storageBucket, `profiles/${profileId}/certifications`)
      expect(prismaMock.certification.update).toHaveBeenCalledWith({
        where: { id: certificationId },
        data: { ...updateData, fileUrl: newFileUrl },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, certification: certWithNewFile })
    })

    it('should update certification details with a new file (replacing existing file)', async () => {
      // Use a realistic URL structure including the bucket name
      const oldFileUrl = `https://test.supabase.co/storage/v1/object/public/${storageBucket}/profiles/${profileId}/certifications/old.png`; 
      const oldFilePath = `profiles/${profileId}/certifications/old.png`; // This expected path remains correct
      const certWithOldFile = { ...existingCert, fileUrl: oldFileUrl };
      const newFileUrl = 'https://new-upload.com/file.jpg';
      const certWithNewFile = { ...updatedCert, fileUrl: newFileUrl };

      prismaMock.certification.findUnique.mockResolvedValue(certWithOldFile);
      vi.mocked(deleteFile).mockResolvedValue({ success: true });
      vi.mocked(uploadFile).mockResolvedValue({ url: newFileUrl });
      prismaMock.certification.update.mockResolvedValue(certWithNewFile);

      const result = await updateCertification(certificationId, updateData, mockFile);

      expect(prismaMock.certification.findUnique).toHaveBeenCalled();
      expect(deleteFile).toHaveBeenCalledWith(storageBucket, oldFilePath);
      expect(uploadFile).toHaveBeenCalledWith(mockFile, storageBucket, `profiles/${profileId}/certifications`);
      expect(prismaMock.certification.update).toHaveBeenCalledWith({
        where: { id: certificationId },
        data: { ...updateData, fileUrl: newFileUrl }, // Ensure data includes the new fileUrl
      });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio');
      expect(result).toEqual({ success: true, certification: certWithNewFile });
    });
    
    it('should return error if findUnique fails when uploading file', async () => {
       prismaMock.certification.findUnique.mockResolvedValue(null)

       const result = await updateCertification(certificationId, updateData, mockFile)

       expect(prismaMock.certification.findUnique).toHaveBeenCalled()
       expect(uploadFile).not.toHaveBeenCalled()
       expect(deleteFile).not.toHaveBeenCalled()
       expect(prismaMock.certification.update).not.toHaveBeenCalled()
       expect(revalidatePath).not.toHaveBeenCalled()
       expect(result).toEqual({ success: false, error: 'Failed to update certification' }) 
    })

    it('should return error if database update fails', async () => {
      const dbError = new Error('DB update failed')
      prismaMock.certification.update.mockRejectedValue(dbError)

      const result = await updateCertification(certificationId, updateData)

      expect(prismaMock.certification.update).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to update certification' })
    })
  })

  // -- Tests for deleteCertification --
  describe('deleteCertification', () => {
    const certToDelete: Certification = {
        id: certificationId,
        profileId,
        ...baseCertData,
        fileUrl: null,
        certificationId: null,
        issueDate: null,
        expiryDate: null,
        credentialUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    
    it('should delete certification without a file URL', async () => {
        prismaMock.certification.findUnique.mockResolvedValue(certToDelete)
        prismaMock.certification.delete.mockResolvedValue(certToDelete)

        const result = await deleteCertification(certificationId)

        expect(prismaMock.certification.findUnique).toHaveBeenCalledWith({ where: { id: certificationId } })
        expect(deleteFile).not.toHaveBeenCalled()
        expect(prismaMock.certification.delete).toHaveBeenCalledWith({ where: { id: certificationId } })
        expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
        expect(result).toEqual({ success: true })
    })

    it('should delete certification and the associated file', async () => {
        const fileUrl = `https://test.supabase.co/storage/v1/object/public/${storageBucket}/profiles/${profileId}/certifications/my-cert.pdf`
        const filePath = `profiles/${profileId}/certifications/my-cert.pdf`
        const certWithFile = { ...certToDelete, fileUrl }
        
        prismaMock.certification.findUnique.mockResolvedValue(certWithFile)
        vi.mocked(deleteFile).mockResolvedValue({ success: true })
        prismaMock.certification.delete.mockResolvedValue(certWithFile)

        const result = await deleteCertification(certificationId)

        expect(prismaMock.certification.findUnique).toHaveBeenCalledWith({ where: { id: certificationId } })
        expect(deleteFile).toHaveBeenCalledWith(storageBucket, filePath)
        expect(prismaMock.certification.delete).toHaveBeenCalledWith({ where: { id: certificationId } })
        expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
        expect(result).toEqual({ success: true })
    })

    it('should return error if certification not found', async () => {
        prismaMock.certification.findUnique.mockResolvedValue(null)

        const result = await deleteCertification(certificationId)

        expect(prismaMock.certification.findUnique).toHaveBeenCalled()
        expect(deleteFile).not.toHaveBeenCalled()
        expect(prismaMock.certification.delete).not.toHaveBeenCalled()
        expect(revalidatePath).not.toHaveBeenCalled()
        expect(result).toEqual({ success: false, error: 'Failed to delete certification' })
    })

    it('should return error if file deletion fails', async () => {
        const certWithFile = { ...certToDelete, fileUrl: mockFileUrl }
        prismaMock.certification.findUnique.mockResolvedValue(certWithFile)
        vi.mocked(deleteFile).mockRejectedValue(new Error('Supabase delete error'))

        const result = await deleteCertification(certificationId)

        expect(prismaMock.certification.findUnique).toHaveBeenCalled()
        expect(deleteFile).toHaveBeenCalledWith(storageBucket, `profiles/${profileId}/certifications/test.pdf`)
        expect(prismaMock.certification.delete).not.toHaveBeenCalled()
        expect(revalidatePath).not.toHaveBeenCalled()
        expect(result).toEqual({ success: false, error: 'Failed to delete certification' })
    })

    it('should return error if database deletion fails', async () => {
        prismaMock.certification.findUnique.mockResolvedValue(certToDelete)
        prismaMock.certification.delete.mockRejectedValue(new Error('DB delete failed'))

        const result = await deleteCertification(certificationId)

        expect(prismaMock.certification.findUnique).toHaveBeenCalled()
        expect(deleteFile).not.toHaveBeenCalled()
        expect(prismaMock.certification.delete).toHaveBeenCalled()
        expect(revalidatePath).not.toHaveBeenCalled()
        expect(result).toEqual({ success: false, error: 'Failed to delete certification' })
    })
  })
  
  // -- Tests for getProfileCertifications --
  describe('getProfileCertifications', () => {
      const mockCertList: Certification[] = [
        { id: 'cert1', profileId, name: 'Cert A', fileUrl: null, createdAt: new Date(2023, 10, 1), updatedAt: new Date(), certificationId: null, issuingBody: null, issueDate: null, expiryDate: null, credentialUrl: null },
        { id: 'cert2', profileId, name: 'Cert B', fileUrl: 'some_url', createdAt: new Date(2023, 5, 1), updatedAt: new Date(), certificationId: null, issuingBody: null, issueDate: null, expiryDate: null, credentialUrl: null },
      ]
      
      it('should return list of certifications for a profile', async () => {
          prismaMock.certification.findMany.mockResolvedValue(mockCertList)

          const result = await getProfileCertifications(profileId)

          expect(prismaMock.certification.findMany).toHaveBeenCalledWith({
              where: { profileId },
              orderBy: { createdAt: 'desc' },
          })
          expect(result).toEqual({ certifications: mockCertList })
      })

      it('should return error if database fetch fails', async () => {
          const dbError = new Error('DB fetch failed')
          prismaMock.certification.findMany.mockRejectedValue(dbError)

          const result = await getProfileCertifications(profileId)

          expect(prismaMock.certification.findMany).toHaveBeenCalled()
          expect(result).toEqual({ error: 'Failed to fetch certifications' })
      })
  })
})
