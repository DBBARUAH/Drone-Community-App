'use server'

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

type ExperienceData = {
  title: string;
  company?: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string;
};

type ExperienceResponse = {
  success: boolean;
  experience?: Prisma.ExperienceGetPayload<{}>;
  error?: string;
};

type ExperiencesResponse = {
  experiences?: Prisma.ExperienceGetPayload<{}>[];
  error?: string;
};

/**
 * Add a new experience entry for a profile
 */
export async function addExperience(
  profileId: string,
  data: ExperienceData
): Promise<ExperienceResponse> {
  try {
    const experience = await db.experience.create({
      data: {
        ...data,
        profileId,
      },
    });

    return { success: true, experience };
  } catch (error) {
    console.error('Failed to add experience:', error);
    return {
      success: false,
      error: 'Failed to add experience. Please try again later.',
    };
  }
}

/**
 * Update an existing experience entry
 */
export async function updateExperience(
  experienceId: string,
  data: ExperienceData
): Promise<ExperienceResponse> {
  try {
    const experience = await db.experience.update({
      where: { id: experienceId },
      data,
    });

    return { success: true, experience };
  } catch (error) {
    console.error('Failed to update experience:', error);
    return {
      success: false,
      error: 'Failed to update experience. Please try again later.',
    };
  }
}

/**
 * Delete an experience entry
 */
export async function deleteExperience(
  experienceId: string
): Promise<ExperienceResponse> {
  try {
    await db.experience.delete({
      where: { id: experienceId },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete experience:', error);
    return {
      success: false,
      error: 'Failed to delete experience. Please try again later.',
    };
  }
}

/**
 * Get all experiences for a specific profile
 */
export async function getProfileExperiences(
  profileId: string
): Promise<ExperiencesResponse> {
  try {
    const experiences = await db.experience.findMany({
      where: { profileId },
      orderBy: { startDate: 'desc' },
    });

    return { experiences };
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return {
      error: 'Failed to load experiences. Please try again later.',
    };
  }
} 