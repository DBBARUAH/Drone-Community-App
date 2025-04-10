'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Types for form data based on the schema
export type BasicProfileFormData = {
  title?: string;
  location?: string;
  website?: string;
  bio?: string;
  contactEmail?: string;
  phone?: string;
};

export type AdditionalInfoFormData = {
  bio?: string;
  businessName?: string;
  website?: string;
  specializations: string[];
  serviceArea?: string;
  languages: string[];
  insuranceDetails?: string;
};

/**
 * Create a new profile for a user
 * @param auth0Id The Auth0 ID of the user (sub from Auth0 user object)
 */
export async function createProfile(auth0Id: string) {
  console.log('Starting createProfile with auth0Id:', auth0Id);
  try {
    // First, check if we already have a User with this Auth0 ID
    let user = await db.user.findUnique({
      where: { auth0Id },
    });
    
    console.log('Existing user found?', !!user);

    // If no user exists with this Auth0 ID, create one
    if (!user) {
      // This is a new user from Auth0, we need to create a User record first
      try {
        console.log('Creating new user with auth0Id:', auth0Id);
        // We don't have email and name here, but we'll handle that later
        // The important part is to create a User with the auth0Id
        user = await db.user.create({
          data: {
            auth0Id,
            email: `${auth0Id.replace('|', '-')}@placeholder.com`, // Placeholder email
            role: 'PHOTOGRAPHER', // Assuming this is for photographers
            name: 'New User', // Default name
          },
        });
        
        console.log('Created new user:', user);
      } catch (error) {
        console.error('Failed to create user:', error);
        // More detailed error logging
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        return { error: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}` };
      }
    }

    // Now that we have a user, check if a profile already exists
    console.log('Checking for existing profile for userId:', user.id);
    const existingProfile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    console.log('Existing profile found?', !!existingProfile);
    if (existingProfile) {
      console.log('Returning existing profile:', existingProfile.id);
      return { profile: existingProfile };
    }

    // Create new profile with default empty values
    console.log('Creating new profile for userId:', user.id);
    try {
      const profile = await db.profile.create({
        data: {
          userId: user.id,
          specializations: [],
          languages: [],
        },
      });
      
      console.log('Created new profile:', profile.id);
      return { profile };
    } catch (profileError) {
      console.error('Failed to create profile:', profileError);
      // More detailed profile error logging
      if (profileError instanceof Error) {
        console.error('Profile error name:', profileError.name);
        console.error('Profile error message:', profileError.message);
        console.error('Profile error stack:', profileError.stack);
      }
      return { error: `Failed to create profile: ${profileError instanceof Error ? profileError.message : 'Unknown error'}` };
    }
  } catch (error) {
    console.error('Failed in createProfile:', error);
    // More detailed error logging for the entire function
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return { error: `Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Update basic profile information
 */
export async function updateBasicProfile(
  profileId: string,
  data: BasicProfileFormData
) {
  try {
    const profile = await db.profile.update({
      where: { id: profileId },
      data: {
        title: data.title,
        location: data.location,
        website: data.website,
        bio: data.bio,
        contactEmail: data.contactEmail,
        phone: data.phone,
      },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, profile };
  } catch (error) {
    console.error('Failed to update basic profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Update additional information
 */
export async function updateAdditionalInfo(
  profileId: string,
  data: AdditionalInfoFormData
) {
  try {
    const profile = await db.profile.update({
      where: { id: profileId },
      data: {
        bio: data.bio,
        businessName: data.businessName,
        website: data.website,
        specializations: data.specializations,
        serviceArea: data.serviceArea,
        languages: data.languages,
        insuranceDetails: data.insuranceDetails,
      },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, profile };
  } catch (error) {
    console.error('Failed to update additional info:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Get a user's profile with all related data
 */
export async function getFullProfile(userId: string) {
  try {
    const profile = await db.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
        equipment: true,
        certifications: true,
        galleryItems: true,
      },
    });

    return { profile };
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return { error: 'Failed to fetch profile' };
  }
}

/**
 * Delete a profile
 */
export async function deleteProfile(profileId: string) {
  try {
    await db.profile.delete({
      where: { id: profileId },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete profile:', error);
    return { success: false, error: 'Failed to delete profile' };
  }
} 