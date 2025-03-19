'use client'

import { useState } from 'react'
import { validateEmail, validateName, registerOrSignIn, sendVerificationEmail, getUserProfile } from '@firebase/services/auth'

interface ChatInterface {
  addBotMessage: (message: string) => void
}

interface ChatbotAuthManagerProps {
  chatInterface: ChatInterface
}

export function ChatbotAuthManager({ chatInterface }: ChatbotAuthManagerProps) {
  const [registrationStage, setRegistrationStage] = useState<'initial' | 'ask_name' | 'ask_email' | null>('initial')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  async function handleNameInput(name: string) {
    const nameValidation = validateName(name)
    if (!nameValidation.isValid) {
      chatInterface.addBotMessage(
        "That doesn't seem like a valid name. Could you please tell me your full name?"
      )
      return
    }

    setUserName(name.trim())
    chatInterface.addBotMessage(
      `Nice to meet you, ${name}! \n\n` +
      "Could you share the email address you'd like to use for your Travellers Beats account?"
    )
    setRegistrationStage('ask_email')
  }

  async function handleEmailInput(email: string) {
    if (!validateEmail(email)) {
      chatInterface.addBotMessage(
        "Hmm, that doesn't look like a valid email. Could you double-check and try again?"
      )
      return
    }

    setUserEmail(email.trim())

    try {
      const authResult = await registerOrSignIn(email, userName)

      if (authResult.needsVerification) {
        await sendVerificationEmail(authResult.user)
        
        chatInterface.addBotMessage(
          `Almost there, ${userName}! 🌟\n\n` +
          "We've sent a verification link to your email. Please check your inbox " +
          "(including spam folder) and click the link to activate your account.\n\n" +
          "Once verified, you'll unlock full access to Travellers Beats community features!"
        )
      } else {
        const userProfile = await getUserProfile(authResult.user.uid)
        
        chatInterface.addBotMessage(
          `Welcome back, ${userProfile?.firstName || userName}! 🎉\n\n` +
          "We're excited to continue your aerial creative journey with Travellers Beats. " +
          "What can I help you with today?"
        )
      }

      setRegistrationStage(null)
    } catch (error) {
      console.error("Registration error:", error)
      chatInterface.addBotMessage(
        "Oops! Something went wrong during registration. " +
        "Could you please try again or contact our support team?"
      )
      setRegistrationStage(null)
    }
  }

  // ... rest of your component implementation
} 