"use client"

import { useState, useEffect, type FormEvent } from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CheckoutFormProps {
  onPaymentSuccess: () => void
}

export function CheckoutForm({ onPaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          toast({ title: "Payment Successful!", description: "Your subscription is now active." })
          onPaymentSuccess() // Notify parent component
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe, onPaymentSuccess])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js hasn't loaded yet.")
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/dashboard/payment-pricing?success=true`, // Add success param
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
        <span id="button-text">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-3 w-3" />}
          {isLoading ? "Processing..." : "Pay Now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-sm text-red-500 text-center">{message}</div>}
       <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
          <Lock className="h-3 w-3 mr-1" />
          Secure payment processing by Stripe
       </div>
    </form>
  )
} 