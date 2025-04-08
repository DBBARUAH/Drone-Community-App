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

    // *** VALIDATE AND APPLY STRIPE PROMOTION CODE ***
    if (promotionCode) {
      try {
        // First try to retrieve the promotion code directly
        const promoCodes = await stripe.promotionCodes.list({
          code: promotionCode.trim().toUpperCase(),
          active: true,
          limit: 1,
          expand: ['data.coupon']
        });

        if (promoCodes.data.length === 0) {
          // If not found by exact code, try searching case-insensitive
          const allPromoCodes = await stripe.promotionCodes.list({
            active: true,
            limit: 100 // Reasonable limit to search through
          });
          
          const matchingCode = allPromoCodes.data.find(
            code => code.code.toLowerCase() === promotionCode.trim().toLowerCase()
          );

          if (matchingCode) {
            // Retrieve full details with coupon expanded
            const fullPromoCode = await stripe.promotionCodes.retrieve(matchingCode.id, {
              expand: ['coupon']
            });
            promoCodes.data = [fullPromoCode];
          }
        }

        if (promoCodes.data.length > 0) {
          const validPromoCode = promoCodes.data[0];
          const coupon = validPromoCode.coupon;

          if (!coupon.valid) {
            return NextResponse.json(
              { error: 'This promotion code is no longer valid.' },
              { status: 400 }
            );
          }

          // Calculate discounted amount
          if (coupon.percent_off) {
            const discountAmount = Math.round(amount * (coupon.percent_off / 100));
            amount = amount - discountAmount;
            discountDetails = { 
              percent_off: coupon.percent_off,
              original_amount: amount + discountAmount,
              discount_amount: discountAmount
            };
          } else if (coupon.amount_off) {
            amount = Math.max(0, amount - coupon.amount_off);
            discountDetails = { 
              amount_off: coupon.amount_off,
              original_amount: amount + coupon.amount_off,
              discount_amount: coupon.amount_off
            };
          }

          // Ensure minimum charge amount if necessary
          if (amount < 0) amount = 0;

          appliedPromotionCodeId = validPromoCode.id;
          appliedCouponId = coupon.id;
          console.log(`Applied promo code ${promotionCode} (Coupon ${coupon.id}), final amount: ${amount}`);

        } else {
          return NextResponse.json(
            { error: `Invalid promotion code: '${promotionCode}'` },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Error validating promotion code:", error);
        return NextResponse.json(
          { error: 'Could not validate promotion code. Please try again.' },
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
      metadata.discountDetails = JSON.stringify(discountDetails); // Store discount info
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
      appliedPromotionCodeId: appliedPromotionCodeId, 
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: `Error creating payment intent: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 