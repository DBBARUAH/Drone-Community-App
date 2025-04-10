'use server'

import { db } from '@/lib/db';
import { uploadFile, deleteFile } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const STORAGE_BUCKET = 'gallery';

type GalleryItemFormData = {
  title?: string;
  description?: string;
  type: string; // 'IMAGE' or 'VIDEO'
};

/**
 * Add a new gallery item with file upload
 */
export async function addGalleryItem(
  profileId: string, 
  data: GalleryItemFormData,
  file: File
) {
  try {
    // Handle file upload to Supabase
    const uploadPath = `profiles/${profileId}`;
    const uploadResult = await uploadFile(file, STORAGE_BUCKET, uploadPath);
    
    if ('error' in uploadResult) {
      throw new Error(uploadResult.error);
    }

    // Determine if it's an image or video URL based on type
    const fileUrl = uploadResult.url;
    const itemData: any = {
      ...data,
      profileId,
    };

    // Set either imageUrl or videoUrl based on type
    if (data.type === 'IMAGE') {
      itemData.imageUrl = fileUrl;
    } else if (data.type === 'VIDEO') {
      itemData.videoUrl = fileUrl;
    }

    // Create record in database
    const galleryItem = await db.galleryItem.create({
      data: itemData,
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, galleryItem };
  } catch (error) {
    console.error('Failed to add gallery item:', error);
    return { success: false, error: 'Failed to add gallery item' };
  }
}

/**
 * Update gallery item metadata (not file)
 */
export async function updateGalleryItemMetadata(
  galleryItemId: string,
  data: { title?: string; description?: string }
) {
  try {
    const galleryItem = await db.galleryItem.update({
      where: { id: galleryItemId },
      data,
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, galleryItem };
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return { success: false, error: 'Failed to update gallery item' };
  }
}

/**
 * Delete a gallery item and its associated file
 */
export async function deleteGalleryItem(galleryItemId: string) {
  try {
    // First get the item to find the file URL
    const galleryItem = await db.galleryItem.findUnique({
      where: { id: galleryItemId },
    });

    if (!galleryItem) {
      throw new Error('Gallery item not found');
    }

    // Extract file path from URL to delete from storage
    const fileUrl = galleryItem.imageUrl || galleryItem.videoUrl;
    if (fileUrl) {
      // Extract path from URL - Supabase URLs typically have a structure like:
      // https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = fileUrl.split(`${STORAGE_BUCKET}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await deleteFile(STORAGE_BUCKET, filePath);
      }
    }

    // Delete from database
    await db.galleryItem.delete({
      where: { id: galleryItemId },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return { success: false, error: 'Failed to delete gallery item' };
  }
}

/**
 * Get all gallery items for a profile
 */
export async function getProfileGalleryItems(profileId: string) {
  try {
    const galleryItems = await db.galleryItem.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return { galleryItems };
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return { error: 'Failed to fetch gallery items' };
  }
} 