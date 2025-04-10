'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type EquipmentFormData = {
  name: string;
  type?: string;
  description?: string;
};

/**
 * Add a new equipment entry to a profile
 */
export async function addEquipment(profileId: string, data: EquipmentFormData) {
  try {
    const equipment = await db.equipment.create({
      data: {
        ...data,
        profileId,
      },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, equipment };
  } catch (error) {
    console.error('Failed to add equipment:', error);
    return { success: false, error: 'Failed to add equipment' };
  }
}

/**
 * Update an existing equipment entry
 */
export async function updateEquipment(equipmentId: string, data: EquipmentFormData) {
  try {
    const equipment = await db.equipment.update({
      where: { id: equipmentId },
      data,
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, equipment };
  } catch (error) {
    console.error('Failed to update equipment:', error);
    return { success: false, error: 'Failed to update equipment' };
  }
}

/**
 * Delete an equipment entry
 */
export async function deleteEquipment(equipmentId: string) {
  try {
    await db.equipment.delete({
      where: { id: equipmentId },
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    return { success: false, error: 'Failed to delete equipment' };
  }
}

/**
 * Get all equipment for a profile
 */
export async function getProfileEquipment(profileId: string) {
  try {
    const equipment = await db.equipment.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return { equipment };
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    return { error: 'Failed to fetch equipment' };
  }
} 