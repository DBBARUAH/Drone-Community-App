import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Set dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// Import the client component directly instead of using dynamic import
// to avoid SSR issues with Stripe
import PaymentPricingClient from './payment-pricing-client'

export default function PaymentPricingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading payment options...</span>
      </div>
    }>
      <PaymentPricingClient />
    </Suspense>
  )
}
