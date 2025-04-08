import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

// REMOVE Hardcoded coupons
// const validCoupons: { [key: string]: number } = {
//   DRONE10: 10, // 10% off
//   DRONE20: 20, // 20% off
// }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Rename couponCode to promotionCode for clarity, as user enters Promo Code
    const { plan, billingCycle, promotionCode } = body 

    // Get plan details (you should store these in a database or env variables in production)
    const plans = {
      pro: {
        monthly: 900, // $9.00
        yearly: 9000, // $90.00
      },
      premium: {
        monthly: 1900, // $19.00
        yearly: 19000, // $190.00
      },
    }

    const selectedPlan = plans[plan as keyof typeof plans]
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Calculate base amount
    let amount = billingCycle === 'monthly' ? selectedPlan.monthly : selectedPlan.yearly
    let appliedPromotionCodeId: string | undefined = undefined;
    let appliedCouponId: string | undefined = undefined;
    let discountDetails = {};
    const originalAmount = amount; // Store original amount

    // *** VALIDATE AND APPLY STRIPE PROMOTION CODE ***
    if (promotionCode) {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promotionCode,
          active: true,
          limit: 1,
          expand: ['data.coupon'] // Expand the coupon details
        });

        if (promoCodes.data.length > 0) {
          const validPromoCode = promoCodes.data[0];
          const coupon = validPromoCode.coupon;
          let calculatedDiscount = 0; // Variable to store the calculated discount value

          // Calculate discounted amount
          if (coupon.percent_off) {
            calculatedDiscount = Math.round(amount * (coupon.percent_off / 100));
            amount = amount - calculatedDiscount;
            discountDetails = { percent_off: coupon.percent_off, calculated_discount: calculatedDiscount };
          } else if (coupon.amount_off) {
            calculatedDiscount = coupon.amount_off;
            amount = amount - calculatedDiscount;
            discountDetails = { amount_off: coupon.amount_off, calculated_discount: calculatedDiscount };
          }
          
          // Ensure amount doesn't go below 0 AFTER discount calculation
          amount = Math.max(0, amount); 

           // Check for minimum chargeable amount (e.g., 50 cents for USD) AFTER ensuring it's not negative
           const minimumChargeAmount = 50; // Define minimum charge amount in cents
           if (amount > 0 && amount < minimumChargeAmount) {
             console.warn(`Discounted amount ${amount} is below minimum charge amount ${minimumChargeAmount}.`);
             return NextResponse.json(
               { error: `The total amount after discount ($${(amount / 100).toFixed(2)}) is below the minimum required charge ($${(minimumChargeAmount / 100).toFixed(2)}).` },
               { status: 400 }
             );
           }

          appliedPromotionCodeId = validPromoCode.id;
          appliedCouponId = coupon.id;
          console.log(`Applied promo code ${promotionCode} (Coupon ${coupon.id}), final amount: ${amount}`);

        } else {
          // Promotion code is invalid or inactive
          console.warn(`Invalid or inactive promotion code: ${promotionCode}`);
          return NextResponse.json(
            { error: `Invalid or inactive promotion code: '${promotionCode}'` },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Error validating promotion code:", error);
        return NextResponse.json(
          { error: 'Could not validate promotion code' },
          { status: 500 }
        );
      }
    }

    // Create payment intent metadata
    const metadata: Stripe.MetadataParam = {
      plan,
      billingCycle,
    }
    if (appliedPromotionCodeId) {
      metadata.appliedPromotionCodeId = appliedPromotionCodeId;
      // Only add coupon ID if it exists
      if (appliedCouponId) { 
        metadata.appliedCouponId = appliedCouponId;
      }
      // Keep discount details in metadata for records
      metadata.discountDetails = JSON.stringify({ ...discountDetails, original_amount: originalAmount }); 
    }

    // Create payment intent with final amount and metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Use the potentially discounted amount (could be 0)
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      finalAmount: amount,
      originalAmount: originalAmount, // Return original amount
      appliedPromotionCodeId: appliedPromotionCodeId, 
      discountDetails: appliedPromotionCodeId ? discountDetails : null // Return discount details if applied
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: `Error creating payment intent: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 