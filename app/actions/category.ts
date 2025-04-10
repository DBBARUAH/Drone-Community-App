'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

// Define Category interface directly rather than importing it
export interface Category {
  id: string
  name: string
  description: string | null
  profileId: string | null
  createdAt: Date
  updatedAt: Date
}

// Type for category data
export interface CategoryFormData {
  name: string
  description?: string
}

// Type for the response when getting categories
export type CategoriesResponse = {
  categories?: Category[]
  error?: string
}

// Type for the response when setting profile categories
export type SetProfileCategoriesResponse = {
  success?: boolean
  error?: string
}

/**
 * Get all available categories (master list)
 */
export async function getAllCategories(): Promise<CategoriesResponse> {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }, // Order alphabetically
    })
    return { categories: categories as Category[] }
  } catch (error) {
    console.error('Failed to fetch all categories:', error)
    return { error: 'Failed to load categories.' }
  }
}

/**
 * Get all categories associated with a specific profile
 */
export async function getProfileCategories(profileId: string): Promise<CategoriesResponse> {
  try {
    const profileWithCategories = await db.profile.findUnique({
      where: { id: profileId },
      select: {
        categories: { // Select only the categories relation
           orderBy: { name: 'asc' }
        }
      }
    });

    if (!profileWithCategories) {
        return { error: 'Profile not found.' };
    }

    return { categories: profileWithCategories.categories as Category[] };

  } catch (error) {
    console.error('Failed to fetch profile categories:', error);
    return { error: 'Failed to load profile categories.' };
  }
}

/**
 * Set/update the categories associated with a profile.
 * Replaces the existing categories with the provided list of category IDs.
 * @param profileId The ID of the profile to update.
 * @param categoryIds An array of category IDs to associate with the profile.
 */
export async function setProfileCategories(
  profileId: string,
  categoryIds: string[]
): Promise<SetProfileCategoriesResponse> {
  try {
    // Use Prisma's connect syntax within an update operation
    // This efficiently sets the relation to only the provided category IDs
    await db.profile.update({
      where: { id: profileId },
      data: {
        categories: {
          // Set disconnects all existing relations not in the connect list
          // and connects the ones specified.
          set: categoryIds.map((id) => ({ id })), 
        },
      },
    })

    revalidatePath('/dashboard/portfolio') // Revalidate the portfolio page
    revalidatePath(`/profile/${profileId}`); // Revalidate specific profile page if it exists

    return { success: true }
  } catch (error) {
    console.error('Failed to set profile categories:', error)
    return { error: 'Failed to update profile categories.' }
  }
}

// --- Potentially add Admin-only functions later if needed ---
/*
export async function createCategory(data: CategoryFormData) { ... }
export async function updateCategory(categoryId: string, data: CategoryFormData) { ... }
export async function deleteCategory(categoryId: string) { ... }
*/ 