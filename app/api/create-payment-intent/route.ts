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

export async function POST(req: Request) {
  try {
    const stripe = getStripeInstance()
    const { planId, amount, coupon } = await req.json()

    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Define calculation params
    let finalAmount = amount
    let metadata: Record<string, string> = {
      planId,
    }

    // Handle coupons
    if (coupon) {
      if (coupon.toLowerCase() === 'premium50') {
        // Apply 50% discount
        finalAmount = Math.floor(amount * 0.5)
        metadata.couponApplied = 'premium50'
        metadata.discount = '50%'
      } else {
        // In a real app, you would check against valid coupon codes in your database
        // or verify against Stripe coupon codes
        return NextResponse.json(
          { error: 'Invalid coupon code' },
          { status: 400 }
        )
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 