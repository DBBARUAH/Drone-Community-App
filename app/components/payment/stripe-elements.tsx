"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "./checkout-form"
import { useEffect, useState } from "react"
import { publicConfig } from "@/lib/config"

// Initialize Stripe in client-side only
let stripePromiseCache: ReturnType<typeof loadStripe> | null = null
const getStripePromise = () => {
  if (stripePromiseCache) return stripePromiseCache
  
  // Safety check - only initialize in browser
  if (typeof window === 'undefined') return null
  
  const key = publicConfig.stripePublishableKey || ''
  stripePromiseCache = loadStripe(key)
  return stripePromiseCache
}

interface StripeElementsProps {
  clientSecret: string
  onPaymentSuccess: () => void
}

export function StripeElements({ clientSecret, onPaymentSuccess }: StripeElementsProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  
  useEffect(() => {
    setIsMounted(true)
    setStripePromise(getStripePromise())
  }, [])
  
  if (!isMounted || !stripePromise) {
    return null
  }

  const appearance: import("@stripe/stripe-js").StripeElementsOptions["appearance"] = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0072F5',
      colorBackground: '#ffffff',
      colorText: '#333333',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  )
} 