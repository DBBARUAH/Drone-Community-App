'use server'

import { db } from '@/lib/db';
import { uploadFile, deleteFile } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const STORAGE_BUCKET = 'certifications';

type CertificationFormData = {
  name: string;
  issuingBody?: string;
  certificationId?: string;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  credentialUrl?: string;
};

/**
 * Add a new certification with optional file upload
 */
export async function addCertification(
  profileId: string,
  data: CertificationFormData,
  file?: File
) {
  try {
    // Prepare certification data
    const certData: any = {
      ...data,
      profileId,
    };

    // Handle file upload if provided
    if (file) {
      const uploadPath = `profiles/${profileId}/certifications`;
      const uploadResult = await uploadFile(file, STORAGE_BUCKET, uploadPath);
      
      if ('error' in uploadResult) {
        throw new Error(uploadResult.error);
      }
      
      certData.fileUrl = uploadResult.url;
    }

    // Create certification in database
    const certification = await db.certification.create({
      data: certData,
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, certification };
  } catch (error) {
    console.error('Failed to add certification:', error);
    return { success: false, error: 'Failed to add certification' };
  }
}

/**
 * Update a certification's details
 */
export async function updateCertification(
  certificationId: string,
  data: CertificationFormData,
  file?: File
) {
  try {
    const certData: any = { ...data };
    
    // Handle file upload if provided
    if (file) {
      // Get existing certification to get profileId
      const existingCert = await db.certification.findUnique({
        where: { id: certificationId },
        select: { profileId: true, fileUrl: true },
      });
      
      if (!existingCert) {
        throw new Error('Certification not found');
      }
      
      // Delete existing file if any
      if (existingCert.fileUrl) {
        // More robust path extraction: find the first occurrence of bucket/
        const bucketPathSegment = `${STORAGE_BUCKET}/`;
        const pathStartIndex = existingCert.fileUrl.indexOf(bucketPathSegment);
        if (pathStartIndex !== -1) {
          const filePath = existingCert.fileUrl.substring(pathStartIndex + bucketPathSegment.length);
          await deleteFile(STORAGE_BUCKET, filePath);
        }
      }
      
      // Upload new file
      const uploadPath = `profiles/${existingCert.profileId}/certifications`;
      const uploadResult = await uploadFile(file, STORAGE_BUCKET, uploadPath);
      
      if ('error' in uploadResult) {
        throw new Error(uploadResult.error);
      }
      
      certData.fileUrl = uploadResult.url;
    }

    // Update certification in database
    const certification = await db.certification.update({
      where: { id: certificationId },
      data: certData,
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, certification };
  } catch (error) {
    console.error('Failed to update certification:', error);
    return { success: false, error: 'Failed to update certification' };
  }
}

/**
 * Delete a certification and its associated file
 */
export async function deleteCertification(certificationId: string) {
  try {
    // Get the certification to find the file URL
    const certification = await db.certification.findUnique({
      where: { id: certificationId },
    });

    if (!certification) {
      throw new Error('Certification not found');
    }

    // Delete file from storage if exists
    if (certification.fileUrl) {
      // More robust path extraction: find the first occurrence of bucket/
      const bucketPathSegment = `${STORAGE_BUCKET}/`;
      const pathStartIndex = certification.fileUrl.indexOf(bucketPathSegment);
      if (pathStartIndex !== -1) {
        const filePath = certification.fileUrl.substring(pathStartIndex + bucketPathSegment.length);
        await deleteFile(STORAGE_BUCKET, filePath);
      }
    }

    // Delete from database
    await db.certification.delete({
      where: { id: certificationId },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete certification:', error);
    return { success: false, error: 'Failed to delete certification' };
  }
}

/**
 * Get all certifications for a profile
 */
export async function getProfileCertifications(profileId: string) {
  try {
    const certifications = await db.certification.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return { certifications };
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    return { error: 'Failed to fetch certifications' };
  }
} 