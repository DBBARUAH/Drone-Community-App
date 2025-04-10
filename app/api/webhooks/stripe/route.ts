import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getRequiredServerConfig } from '@/lib/config'

// Initialize Stripe with proper error handling
const getStripeInstance = () => {
  const secretKey = getRequiredServerConfig('stripeSecretKey')
  return new Stripe(secretKey, {
    apiVersion: '2025-03-31.basil',   
  })
}

// Get webhook secret with proper error handling
const getWebhookSecret = () => {
  return getRequiredServerConfig('stripeWebhookSecret')
}

export async function POST(req: Request) {
  try {
    const stripe = getStripeInstance()
    const webhookSecret = getWebhookSecret()
    const body = await req.text()
    
    // Get the signature directly from request headers
    const signatureHeader = req.headers.get('stripe-signature')
    
    if (!signatureHeader) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signatureHeader,
      webhookSecret
    )

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        // Handle successful payment
        console.log('Payment successful:', checkoutSession.id)
        // TODO: Update user subscription status in your database
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription updates
        console.log('Subscription updated:', subscription.id)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellation
        console.log('Subscription cancelled:', deletedSubscription.id)
        // TODO: Update user subscription status in your database
        break

      case 'coupon.created':
        const coupon = event.data.object as Stripe.Coupon
        console.log('Coupon created:', coupon.id)
        // TODO: Maybe store coupon in database for reference
        break

      case 'coupon.deleted':
        const deletedCoupon = event.data.object as Stripe.Coupon
        console.log('Coupon deleted:', deletedCoupon.id)
        // TODO: Update database to mark coupon as invalid
        break
        
      case 'promotion_code.created':
        const promoCode = event.data.object as Stripe.PromotionCode
        console.log('Promotion code created:', promoCode.id, 'for coupon:', promoCode.coupon.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    )
  }
} 