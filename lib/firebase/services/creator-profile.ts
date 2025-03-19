'use server'

import { db } from '../config'
import { 
  doc, 
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

interface SocialLinks {
  instagram?: string
  facebook?: string
  youtube?: string
  others?: string
}

interface ProfileData {
  fullName: string
  email: string
  phone: string
  portfolioUrl: string
  socialLinks: SocialLinks
}

export async function updateCreatorProfile(userId: string, profileData: ProfileData) {
  try {
    const {
      fullName,
      email,
      phone,
      portfolioUrl,
      socialLinks
    } = profileData

    const creatorData = {
      fullName,
      email,
      phone,
      portfolio: {
        websiteUrl: portfolioUrl,
        socialMedia: {
          instagram: socialLinks.instagram || '',
          facebook: socialLinks.facebook || '',
          youtube: socialLinks.youtube || '',
          otherLinks: socialLinks.others || ''
        },
        updatedAt: new Date().toISOString()
      },
      creatorStatus: 'pending',
      verificationStatus: 'unverified',
      sources: ['creator_registration'],
      accountType: 'creator',
      metadata: {
        applicationStatus: 'pending_review',
        lastStatusUpdate: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    }

    const userRef = doc(db, 'chatbot_users', userId)
    await updateDoc(userRef, creatorData)

    return {
      success: true,
      userId,
      message: 'Creator profile updated successfully'
    }
  } catch (error) {
    console.error('Error updating creator profile:', error)
    throw new Error('Failed to update creator profile')
  }
}

export async function getCreatorProfile(email: string) {
  try {
    const usersRef = collection(db, 'chatbot_users')
    const q = query(usersRef, where('email', '==', email.toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data()
      return {
        success: true,
        data: userData
      }
    }

    return {
      success: false,
      message: 'Creator profile not found'
    }
  } catch (error) {
    console.error('Error fetching creator profile:', error)
    throw new Error('Failed to fetch creator profile')
  }
}

export async function updateCreatorStatus(email: string, newStatus: string) {
  try {
    const usersRef = collection(db, 'chatbot_users')
    const q = query(usersRef, where('email', '==', email.toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      await updateDoc(doc(db, 'chatbot_users', userDoc.id), {
        creatorStatus: newStatus,
        'metadata.applicationStatus': newStatus,
        'metadata.lastStatusUpdate': new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      })

      return {
        success: true,
        message: `Creator status updated to ${newStatus}`
      }
    }

    throw new Error('User not found')
  } catch (error) {
    console.error('Error updating creator status:', error)
    throw new Error('Failed to update creator status')
  }
} 