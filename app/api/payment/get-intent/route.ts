import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import auth0Instance from '@/lib/auth0'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function GET(req: NextRequest) {
  try {
    // Get payment intent ID from query params
    const searchParams = req.nextUrl.searchParams
    const paymentIntentId = searchParams.get('payment_intent')
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method']
    })
    
    return NextResponse.json({ paymentIntent })
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    
    if (error instanceof Stripe.errors.StripeInvalidRequestError && error.code === 'resource_missing') {
      return NextResponse.json(
        { error: 'Invalid payment session ID provided.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Could not retrieve payment details. Please contact support.' },
      { status: 500 }
    )
  }
} 