'use client'

import { auth, db } from '../config'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  User
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

interface NameValidation {
  isValid: boolean
  message?: string
  firstName?: string
  lastName?: string
}

interface AuthResult {
  user: User
  firstName: string
  lastName: string
  isNewUser: boolean
  needsVerification: boolean
  existingUserData?: any
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateName(fullName: string): NameValidation {
  const nameParts = fullName.trim().split(/\s+/)
  
  if (nameParts.length < 2) {
    return {
      isValid: false,
      message: "Please provide both first and last name."
    }
  }
  
  const invalidNameParts = nameParts.filter(part => 
    part.length < 2 || 
    !/^[A-Za-z\-']+$/.test(part)
  )
  
  if (invalidNameParts.length > 0) {
    return {
      isValid: false,
      message: "Names should contain only letters, hyphens, or apostrophes."
    }
  }
  
  return {
    isValid: true,
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' ')
  }
}

export async function findUserByEmail(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const usersRef = collection(db, 'chatbot_users')
    const q = query(usersRef, where('email', '==', normalizedEmail))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()
      
      return {
        exists: true,
        id: userDoc.id,
        data: {
          ...userData,
          sources: Array.from(new Set([...(userData.sources || [userData.source])])) 
        }
      }
    }

    return { exists: false }
  } catch (error) {
    console.error('Error checking user existence:', error)
    throw error
  }
}

export async function registerOrSignIn(email: string, fullName: string): Promise<AuthResult> {
  try {
    const nameValidation = validateName(fullName)
    if (!nameValidation.isValid || !nameValidation.firstName || !nameValidation.lastName) {
      throw new Error(nameValidation.message || 'Invalid name format')
    }

    const existingUser = await findUserByEmail(email)
    const temporaryPassword = generateTemporaryPassword()
    
    const userCredential = existingUser.exists
      ? await signInWithEmailAndPassword(auth, email, temporaryPassword)
      : await createUserWithEmailAndPassword(auth, email, temporaryPassword)

    const user = userCredential.user
    
    const userData = {
      firstName: nameValidation.firstName,
      lastName: nameValidation.lastName,
      email: email.toLowerCase(),
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      verified: user.emailVerified,
      source: 'creator_registration'
    }

    const userDocRef = doc(db, 'chatbot_users', existingUser.exists ? existingUser.id : user.uid)
    await setDoc(userDocRef, userData, { merge: true })

    return {
      user,
      firstName: nameValidation.firstName,
      lastName: nameValidation.lastName,
      isNewUser: !existingUser.exists,
      needsVerification: !user.emailVerified,
      existingUserData: existingUser.exists ? existingUser.data : undefined
    }
  } catch (error) {
    console.error('Registration/Sign-in Error:', error)
    throw error
  }
}

export async function sendVerificationEmail(user: User) {
  try {
    await sendEmailVerification(user)
    const userDocRef = doc(db, 'chatbot_users', user.uid)
    await updateDoc(userDocRef, {
      verificationEmailSent: new Date().toISOString()
    })
    return true
  } catch (error) {
    console.error('Verification Email Error:', error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userDocRef = doc(db, 'chatbot_users', userId)
    const userDoc = await getDoc(userDocRef)
    return userDoc.exists() ? userDoc.data() : null
  } catch (error) {
    console.error('Get User Profile Error:', error)
    throw error
  }
}

export async function signOutUser() {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    console.error('Sign Out Error:', error)
    throw error
  }
}

function generateTemporaryPassword() {
  return Math.random().toString(36).slice(-8) + 
         Math.random().toString(36).slice(-8).toUpperCase() + 
         '!@#'
} 