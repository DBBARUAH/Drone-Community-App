"use client"

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { ArrowRight, Loader2, CreditCard, AlertCircle, Info } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CheckoutFormProps {
  onPaymentSuccess: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function CheckoutForm({ onPaymentSuccess, isLoading, setIsLoading }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(undefined)

      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payment-success`,
        },
      })

      if (result.error) {
        if (result.error.type === 'card_error' || result.error.type === 'validation_error') {
          setErrorMessage(result.error.message)
          toast.error(result.error.message || 'An error occurred with your card.')
        } else {
          setErrorMessage('An unexpected error occurred.')
          toast.error('An unexpected error occurred during payment.')
        }
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        window.location.href = `${window.location.origin}/dashboard/payment-success?payment_intent=${result.paymentIntent.id}`;
      } else if (result.paymentIntent) {
        toast.info(`Payment status: ${result.paymentIntent.status}. You will be notified upon completion.`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a test mode payment. No actual charges will be made.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full bg-muted/50 rounded-lg">
        <AccordionItem value="test-cards">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              View Test Card Numbers
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Successful Payment</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <div>Card Number:</div>
                  <div className="font-mono">4242 4242 4242 4242</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Card Declined</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <div>Card Number:</div>
                  <div className="font-mono">4000 0000 0000 0002</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Insufficient Funds</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <div>Card Number:</div>
                  <div className="font-mono">4000 0000 0000 9995</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">3D Secure Required</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <div>Card Number:</div>
                  <div className="font-mono">4000 0000 0000 3220</div>
                </div>
              </div>

              <div className="pt-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Use any future expiry date, any 3-digit CVC, and any postal code
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement 
          options={{
            layout: 'tabs',
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            defaultValues: {
              billingDetails: {
                name: 'Test User',
                email: 'test@example.com',
              }
            },
            fields: {
              billingDetails: {
                address: 'auto'
              }
            }
          }} 
        />
        {errorMessage && (
          <div className="text-sm text-red-500">{errorMessage}</div>
        )}
        <Button 
          type="submit"
          className="w-full" 
          size="lg"
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              Complete Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  )
} 