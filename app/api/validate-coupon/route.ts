import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
})

export async function POST(request: Request) {
  try {
    const { promotionCode } = await request.json()

    if (!promotionCode) {
      return NextResponse.json(
        { valid: false, message: 'Promotion code is required' },
        { status: 400 }
      )
    }

    try {
      // First try to fetch by exact promotion code
      const promotions = await stripe.promotionCodes.list({
        code: promotionCode,
        active: true,
      })

      if (promotions.data.length === 0) {
        return NextResponse.json(
          { valid: false, message: 'Invalid or expired promotion code' },
          { status: 200 }
        )
      }

      const promotion = promotions.data[0]

      // Check if the promotion code is expired
      if (promotion.expires_at && promotion.expires_at < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { valid: false, message: 'This promotion code has expired' },
          { status: 200 }
        )
      }

      // Check if the promotion code has reached its maximum redemption limit
      if (
        promotion.max_redemptions &&
        promotion.times_redeemed >= promotion.max_redemptions
      ) {
        return NextResponse.json(
          { valid: false, message: 'This promotion code has reached its usage limit' },
          { status: 200 }
        )
      }

      // Get the coupon details
      const coupon = await stripe.coupons.retrieve(promotion.coupon.id)

      let discountMessage = ''
      if (coupon.percent_off) {
        discountMessage = `${coupon.percent_off}% off`
      } else if (coupon.amount_off) {
        discountMessage = `$${(coupon.amount_off / 100).toFixed(2)} off`
      }

      return NextResponse.json({
        valid: true,
        message: `Valid coupon code: ${discountMessage}`,
        promotion: {
          id: promotion.id,
          code: promotion.code,
          couponId: coupon.id,
          discountType: coupon.percent_off ? 'percentage' : 'fixed',
          discountAmount: coupon.percent_off || coupon.amount_off,
        }
      })
    } catch (error) {
      console.error('Error validating promotion code:', error)
      return NextResponse.json(
        { valid: false, message: 'Error validating promotion code' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 