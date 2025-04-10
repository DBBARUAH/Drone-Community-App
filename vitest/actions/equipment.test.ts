import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db as realDb } from '@/lib/db' // Import REAL db
import { prismaMock } from '../setup/db' // Import mock implementation
import { mockReset } from 'vitest-mock-extended' // Correct import
import {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  getProfileEquipment,
} from '@/actions/equipment'
import type { Equipment } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Explicitly mock the db path
vi.mock('@/lib/db')

describe('Equipment Actions', () => {
  const profileId = 'prof_equip123'
  const equipmentId = 'equip_drone456'
  const equipmentData = {
    name: 'DJI Mavic 3',
    type: 'Drone',
    description: 'Professional grade drone',
  }

  beforeEach(() => {
    mockReset(prismaMock)
    vi.mocked(realDb).equipment = prismaMock.equipment
    vi.mocked(revalidatePath).mockClear()
  })

  // -- Tests for addEquipment --
  describe('addEquipment', () => {
    const newEquipment: Equipment = {
      id: equipmentId,
      profileId,
      ...equipmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should add equipment and revalidate path', async () => {
      prismaMock.equipment.create.mockResolvedValue(newEquipment)

      const result = await addEquipment(profileId, equipmentData)

      expect(prismaMock.equipment.create).toHaveBeenCalledWith({
        data: { ...equipmentData, profileId },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, equipment: newEquipment })
    })

    it('should return error if database creation fails', async () => {
      const dbError = new Error('DB create failed')
      prismaMock.equipment.create.mockRejectedValue(dbError)

      const result = await addEquipment(profileId, equipmentData)

      expect(prismaMock.equipment.create).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to add equipment' })
    })
  })

  // -- Tests for updateEquipment --
  describe('updateEquipment', () => {
    const updateData = { name: 'DJI Mavic 3 Pro' }
    const updatedEquipment: Equipment = {
      id: equipmentId,
      profileId,
      name: updateData.name, // Updated name
      type: equipmentData.type,
      description: equipmentData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should update equipment and revalidate path', async () => {
      prismaMock.equipment.update.mockResolvedValue(updatedEquipment)

      const result = await updateEquipment(equipmentId, updateData)

      expect(prismaMock.equipment.update).toHaveBeenCalledWith({
        where: { id: equipmentId },
        data: updateData,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true, equipment: updatedEquipment })
    })

    it('should return error if database update fails', async () => {
      const dbError = new Error('DB update failed')
      prismaMock.equipment.update.mockRejectedValue(dbError)

      const result = await updateEquipment(equipmentId, updateData)

      expect(prismaMock.equipment.update).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to update equipment' })
    })
  })

  // -- Tests for deleteEquipment --
  describe('deleteEquipment', () => {
    const deletedEquipment: Equipment = {
      id: equipmentId, profileId, ...equipmentData, createdAt: new Date(), updatedAt: new Date()
    }
    
    it('should delete equipment and revalidate path', async () => {
      prismaMock.equipment.delete.mockResolvedValue(deletedEquipment) 

      const result = await deleteEquipment(equipmentId)

      expect(prismaMock.equipment.delete).toHaveBeenCalledWith({ where: { id: equipmentId } })
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/portfolio')
      expect(result).toEqual({ success: true })
    })

    it('should return error if database deletion fails', async () => {
      const dbError = new Error('DB delete failed')
      prismaMock.equipment.delete.mockRejectedValue(dbError)

      const result = await deleteEquipment(equipmentId)

      expect(prismaMock.equipment.delete).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false, error: 'Failed to delete equipment' })
    })
  })

  // -- Tests for getProfileEquipment --
  describe('getProfileEquipment', () => {
    const mockEquipmentList: Equipment[] = [
      { id: 'eq1', profileId, name: 'Drone A', type: 'Drone', description: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 'eq2', profileId, name: 'Camera B', type: 'Camera', description: 'Test Cam', createdAt: new Date(), updatedAt: new Date() },
    ]

    it('should return list of equipment for a profile', async () => {
      prismaMock.equipment.findMany.mockResolvedValue(mockEquipmentList)

      const result = await getProfileEquipment(profileId)

      expect(prismaMock.equipment.findMany).toHaveBeenCalledWith({
        where: { profileId },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual({ equipment: mockEquipmentList })
    })

    it('should return error if database fetch fails', async () => {
      const dbError = new Error('DB fetch failed')
      prismaMock.equipment.findMany.mockRejectedValue(dbError)

      const result = await getProfileEquipment(profileId)

      expect(prismaMock.equipment.findMany).toHaveBeenCalled()
      expect(result).toEqual({ error: 'Failed to fetch equipment' })
    })
  })
})
