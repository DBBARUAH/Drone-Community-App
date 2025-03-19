'use client'

import { useState } from 'react'
import { db } from '@/firebase/config'
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'

interface BookingData {
  service?: string
  personal?: {
    name: string
    email: string
    phone: string
  }
  project?: {
    date: string
    time: string
    location: string
    requirements?: string
  }
}

export function useBooking() {
  const [bookingData, setBookingData] = useState<BookingData>({})

  const setService = (service: string) => {
    setBookingData(prev => ({ ...prev, service }))
  }

  const setPersonalDetails = (personal: BookingData['personal']) => {
    setBookingData(prev => ({ ...prev, personal }))
  }

  const setProjectDetails = (project: BookingData['project']) => {
    setBookingData(prev => ({ ...prev, project }))
  }

  const submitBooking = async () => {
    try {
      // Submit to Formspree
      await fetch('https://formspree.io/f/xgegjwqk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          subject: 'New Drone Service Booking Request'
        })
      })

      // Update Firestore
      const usersRef = collection(db, "chatbot_users")
      const email = bookingData.personal?.email.toLowerCase()
      const q = query(usersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)

      const bookingEntry = {
        service: bookingData.service,
        date: bookingData.project?.date,
        time: bookingData.project?.time,
        location: bookingData.project?.location,
        requirements: bookingData.project?.requirements,
        createdAt: new Date().toISOString()
      }

      if (querySnapshot.empty) {
        await addDoc(usersRef, {
          fullName: bookingData.personal?.name,
          email,
          phone: bookingData.personal?.phone,
          bookings: [bookingEntry],
          source: "booking_request",
          lastUpdated: new Date().toISOString(),
          timestamp: new Date().toISOString()
        })
      } else {
        const userDoc = querySnapshot.docs[0]
        const existingData = userDoc.data()
        
        await updateDoc(doc(db, "chatbot_users", userDoc.id), {
          fullName: existingData.fullName || bookingData.personal?.name,
          phone: existingData.phone || bookingData.personal?.phone,
          bookings: [...(existingData.bookings || []), bookingEntry],
          sources: Array.from(new Set([
            ...(existingData.sources || [existingData.source]),
            "booking_request"
          ])),
          lastUpdated: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      throw error
    }
  }

  return {
    bookingData,
    setService,
    setPersonalDetails,
    setProjectDetails,
    submitBooking
  }
} 