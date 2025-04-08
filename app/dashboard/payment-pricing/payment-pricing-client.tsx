"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, X, AlertTriangle, ArrowRight, Check, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CheckoutForm } from "@/components/payment/checkout-form"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function PaymentPricingClient() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Define subscription plans
  const plans = {
    free: {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      features: [
        { text: '5 portfolio items', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Community access', included: true },
        { text: 'Standard support', included: true },
        { text: 'Custom domain', included: false },
        { text: 'Priority in search results', included: false },
        { text: 'Advanced analytics', included: false },
      ],
      popular: false
    },
    pro: {
      name: 'Pro',
      description: 'For serious photographers',
      price: { monthly: 9, yearly: 90 },
      features: [
        { text: '20 portfolio items', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Community spotlight', included: true },
        { text: 'Priority support', included: true },
        { text: 'Custom domain', included: true },
        { text: 'Priority in search results', included: true },
        { text: 'Booking management', included: false },
      ],
      popular: true
    },
    premium: {
      name: 'Premium',
      description: 'For professional photographers',
      price: { monthly: 19, yearly: 190 },
      features: [
        { text: 'Unlimited portfolio items', included: true },
        { text: 'Real-time analytics', included: true },
        { text: 'Featured community profile', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Advanced custom domain', included: true },
        { text: 'Top search placement', included: true },
        { text: 'Advanced booking system', included: true },
      ],
      popular: false
    }
  }

  const handleSelectPlan = async (plan: string) => {
    if (plan === 'free') {
      setSelectedPlan(plan)
      toast.success('Free plan selected!')
      return
    }

    try {
      setIsLoading(true)
      setSelectedPlan(plan)

      // In a real implementation you would create a payment intent on your server
      // For demonstration purposes we're just simulating this
      setTimeout(() => {
        setIsLoading(false)
        // Mock client secret - in reality this would come from your backend
        setClientSecret('mock_client_secret')
      }, 1000)
    } catch (error) {
      console.error('Error selecting plan:', error)
      toast.error('Failed to select plan. Please try again.')
      setIsLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code')
      return
    }

    try {
      setIsApplyingCoupon(true)
      
      // Simulate API call to validate coupon
      setTimeout(() => {
        // Mock coupon validation
        if (couponCode.toLowerCase() === 'drone10') {
          setCouponDiscount(10)
          toast.success('Coupon applied: 10% discount')
        } else if (couponCode.toLowerCase() === 'drone20') {
          setCouponDiscount(20)
          toast.success('Coupon applied: 20% discount')
        } else {
          toast.error('Invalid coupon code')
          setCouponDiscount(0)
        }
        setIsApplyingCoupon(false)
      }, 1000)
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon. Please try again.')
      setIsApplyingCoupon(false)
    }
  }

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your subscription has been activated.')
    // Reset state
    setSelectedPlan(null)
    setCouponCode('')
    setCouponDiscount(0)
    setClientSecret('')
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your photography business. Upgrade anytime to unlock more features.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs 
            defaultValue="monthly" 
            value={billingCycle}
            onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge className="ml-2 bg-green-600 hover:bg-green-700">Save 20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {Object.entries(plans).map(([planId, plan]) => (
            <Card key={planId} className={cn(
              "relative flex flex-col", 
              plan.popular && "border-primary shadow-md"
            )}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground">MOST POPULAR</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    ${billingCycle === 'monthly' 
                      ? plan.price.monthly.toFixed(2) 
                      : plan.price.yearly.toFixed(2)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/70 mr-2 shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm", 
                        !feature.included && "text-muted-foreground/70"
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={planId === 'free' ? 'outline' : 'default'}
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading || selectedPlan === planId}
                >
                  {isLoading && selectedPlan === planId 
                    ? 'Processing...' 
                    : selectedPlan === planId
                      ? 'Selected'
                      : planId === 'free'
                        ? 'Continue with Free'
                        : `Subscribe to ${plan.name}`
                  }
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedPlan && selectedPlan !== 'free' && (
          <div className="mt-12 max-w-2xl mx-auto">
            <Alert className="bg-primary/5 border-primary/20 mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Secure Checkout</AlertTitle>
              <AlertDescription>
                You're subscribing to the {plans[selectedPlan as keyof typeof plans].name} plan ({billingCycle}).
                All payments are processed securely through Stripe.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>Complete your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>{plans[selectedPlan as keyof typeof plans].name} ({billingCycle})</span>
                      <span>
                        ${billingCycle === 'monthly' 
                          ? plans[selectedPlan as keyof typeof plans].price.monthly.toFixed(2) 
                          : plans[selectedPlan as keyof typeof plans].price.yearly.toFixed(2)}
                      </span>
                    </div>
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({couponDiscount}%)</span>
                        <span>
                          -${(
                            (billingCycle === 'monthly' 
                              ? plans[selectedPlan as keyof typeof plans].price.monthly 
                              : plans[selectedPlan as keyof typeof plans].price.yearly) * 
                            (couponDiscount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        ${(
                          (billingCycle === 'monthly' 
                            ? plans[selectedPlan as keyof typeof plans].price.monthly 
                            : plans[selectedPlan as keyof typeof plans].price.yearly) * 
                          (1 - couponDiscount / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coupon" className="text-sm font-medium">Coupon Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="border border-input bg-background hover:bg-accent"
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>

                  {clientSecret && (
                    <div className="mt-4 space-y-6">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Demo Mode: This is a test payment interface
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input 
                                id="card-number" 
                                placeholder="4242 4242 4242 4242" 
                                className="h-10"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input 
                                  id="expiry" 
                                  placeholder="MM/YY" 
                                  className="h-10"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input 
                                  id="cvc" 
                                  placeholder="123" 
                                  className="h-10"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handlePaymentSuccess}
                        size="lg"
                      >
                        <span>Complete Payment</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Questions about our plans? <a href="#" className="underline text-primary">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  )
} 