'use client'

import { useState } from 'react'
import { ServiceSelection } from './steps/ServiceSelection'
import { PersonalDetails } from './steps/PersonalDetails'
import { ProjectDetails } from './steps/ProjectDetails'
import { SuccessMessage } from './steps/SuccessMessage'
import { useBooking } from '@/hooks/useBooking'
import styles from './BookingModal.module.css'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const { 
    bookingData,
    setService,
    setPersonalDetails,
    setProjectDetails,
    submitBooking
  } = useBooking()

  if (!isOpen) return null

  const steps = {
    1: <ServiceSelection onSelect={setService} onNext={() => setCurrentStep(2)} />,
    2: <PersonalDetails 
         onSubmit={setPersonalDetails} 
         onBack={() => setCurrentStep(1)}
         onNext={() => setCurrentStep(3)}
       />,
    3: <ProjectDetails
         onSubmit={async (data) => {
           setProjectDetails(data)
           await submitBooking()
           setCurrentStep(4)
         }}
         onBack={() => setCurrentStep(2)}
       />,
    4: <SuccessMessage onClose={onClose} />
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {steps[currentStep as keyof typeof steps]}
      </div>
    </div>
  )
} 