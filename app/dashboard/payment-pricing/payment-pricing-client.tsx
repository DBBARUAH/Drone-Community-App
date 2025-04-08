"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions, Appearance } from '@stripe/stripe-js'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, X, AlertTriangle, ArrowRight, Check, Info, TicketPercent } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CheckoutForm } from "@/components/payment/checkout-form"
import { publicConfig } from "@/lib/config"
import { useTheme } from "next-themes"

// Initialize Stripe with better error handling
let stripePromiseCache: ReturnType<typeof loadStripe> | null = null
const getStripePromise = () => {
  if (stripePromiseCache) return stripePromiseCache
  
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  console.log("Stripe Key:", key.substring(0, 10) + "...") // Debug key formatting without revealing full key
  if (!key) {
    console.error("Stripe Publishable Key is missing. Please check your .env file.");
    toast.error("Payment system configuration error. Please contact support.");
    // Return a dummy promise to avoid crashing, although payments won't work
    return { then: () => {}, catch: () => {}, finally: () => {} } as any; 
  }
  stripePromiseCache = loadStripe(key)
  return stripePromiseCache
}

const stripePromise = getStripePromise()

export default function PaymentPricingClient() {
  const router = useRouter()
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [finalAmount, setFinalAmount] = useState<number | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  // Define Stripe appearance based on the current theme
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: theme === 'dark' ? '#18181b' : '#ffffff',
      colorText: theme === 'dark' ? '#ffffff' : '#000000',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: theme === 'dark' ? '#27272a' : '#f9fafb',
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #e5e7eb',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        padding: '12px',
        fontSize: '14px',
      },
      '.Input:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 1px #3b82f6'
      },
      '.Label': {
        color: theme === 'dark' ? '#a1a1aa' : '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
      },
      '.Tab': {
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #e5e7eb',
        backgroundColor: theme === 'dark' ? '#27272a' : '#f9fafb',
        color: theme === 'dark' ? '#a1a1aa' : '#6b7280',
        borderRadius: '6px',
      },
      '.Tab--selected': {
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      },
      '.AccordionItem': {
        backgroundColor: theme === 'dark' ? '#27272a' : '#f9fafb',
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #e5e7eb',
        borderRadius: '8px',
      },
      '.AccordionItem-content': {
        backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff'
      },
      '.Button': {
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 16px',
        borderRadius: '6px',
      },
      '.Button:hover': {
        backgroundColor: '#2563eb',
      }
    }
  };

  // Options for Stripe Elements
  const elementOptions: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update appearance when theme changes
  useEffect(() => {
    // We just need the dependency on theme to re-render with updated appearance
  }, [theme])

  // Define subscription plans (Ensure prices are in cents)
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
      price: { monthly: 900, yearly: 9000 }, // $9.00 / $90.00
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
      price: { monthly: 1900, yearly: 19000 }, // $19.00 / $190.00
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
      setClientSecret('') // Clear secret if switching to free
      setFinalAmount(0)
      return
    }

    try {
      setIsLoading(true)
      setSelectedPlan(plan)
      setClientSecret('') // Clear previous secret
      setFinalAmount(null) // Clear previous final amount

      // Maximum number of retries
      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          // Create a payment intent on the server with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              plan: plan,
              billingCycle,
              promotionCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const data = await response.json();
          
          if (!response.ok) {
            if (response.status === 400) {
              // Handle validation errors
              if (data.error?.includes('promotion code')) {
                setCouponCode(''); // Clear invalid coupon
                throw new Error('Invalid or expired promotion code. Please try a different code.');
              } else if (data.error?.includes('plan')) {
                throw new Error('Invalid plan selected. Please refresh and try again.');
              } else {
                throw new Error(data.error || 'Invalid request. Please check your inputs.');
              }
            } else if (response.status === 429) {
              // Rate limiting
              throw new Error('Too many requests. Please wait a moment and try again.');
            } else {
              throw new Error(`Payment initialization failed (${response.status})`);
            }
          }

          setClientSecret(data.clientSecret);
          setFinalAmount(data.finalAmount);
          
          // Open payment modal after successful initialization
          setPaymentModalOpen(true);
          
          if (data.finalAmount !== data.originalAmount) {
            toast.success(`Coupon applied successfully! Final amount: $${(data.finalAmount / 100).toFixed(2)}`);
          } else {
            toast.info(`Payment initialized. Amount: $${(data.finalAmount / 100).toFixed(2)}`);
          }

          success = true; // Exit retry loop on success
          
        } catch (error: any) {
          attempt++;
          
          // Check if it's a network error or timeout
          if (error.name === 'AbortError' || error.name === 'TypeError') {
            if (attempt < maxRetries) {
              toast.error(`Network error. Retrying... (Attempt ${attempt}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
              continue;
            }
            throw new Error('Network error. Please check your connection and try again.');
          }
          
          // If it's not a network error, throw immediately
          throw error;
        }
      }

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      
      // Handle different error types
      if (error.message.includes('promotion code')) {
        toast.error('Invalid coupon code. Please check and try again.');
        setCouponCode(''); // Clear the invalid coupon code
        toast.warning('Coupon code has been cleared.');
      } else if (error.message.includes('Network error')) {
        toast.error(error.message);
        // Optionally reset the payment modal state
        setPaymentModalOpen(false);
      } else {
        toast.error(error.message || 'Failed to initialize payment. Please try again.');
      }

      // Reset states on error
      setSelectedPlan(null);
      setClientSecret('');
      setFinalAmount(null);
      
    } finally {
      setIsLoading(false);
    }
  }
  
  // Fixed useEffect to prevent infinite loops with coupon code
  useEffect(() => {
    // Only re-fetch when billingCycle changes and a plan is selected
    if (selectedPlan && selectedPlan !== 'free' && clientSecret) {
      const timer = setTimeout(() => {
        handleSelectPlan(selectedPlan);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    // We intentionally exclude couponCode to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [billingCycle]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code')
      return
    }
    if (!selectedPlan || selectedPlan === 'free') {
      setCouponError('Please select a paid plan before applying a coupon')
      return
    }

    setIsApplyingCoupon(true)
    setIsValidatingCoupon(true)
    setCouponError(null)
    setCouponSuccess(null)
    
    try {
      // First validate the coupon code
      const validateResponse = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promotionCode: couponCode.trim().toUpperCase(),
        }),
      })

      const validateData = await validateResponse.json()

      if (!validateResponse.ok) {
        throw new Error(validateData.error || 'Failed to validate coupon')
      }

      if (validateData.valid) {
        // Special handling for 100% discount
        if (validateData.promotion?.discountType === 'percentage' && validateData.promotion?.discountAmount === 100) {
          setCouponSuccess(`Full discount coupon "${couponCode}" applied successfully!`)
          toast.success('100% discount coupon applied!')
        } else {
          setCouponSuccess(`Coupon "${couponCode}" is valid! ${validateData.message}`)
        }
        // Re-fetch with the coupon code
        await handleSelectPlan(selectedPlan)
      } else {
        throw new Error(validateData.message || 'Invalid coupon code')
      }
    } catch (error: any) {
      setCouponError(error.message || 'Failed to apply coupon. Please try again.')
      setCouponCode('') // Clear invalid coupon
      toast.error(error.message || 'Failed to apply coupon')
    } finally {
      setIsApplyingCoupon(false)
      setIsValidatingCoupon(false)
    }
  }

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your subscription has been activated.');
    
    // Reset state after successful payment
    setPaymentModalOpen(false);
    setSelectedPlan(null);
    setCouponCode('');
    setCouponDiscount(0);
    setClientSecret('');
    setFinalAmount(null);
    setIsLoading(false);
    
    // Redirect to dashboard or a success confirmation page
    router.push('/dashboard/payment-success');
  }

  if (!isMounted) {
    // Optional: Render a basic loading skeleton or null
    return <div className="container max-w-6xl py-8 animate-pulse"><div className="h-96 bg-muted rounded-lg"></div></div>; 
  }

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  }

  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="space-y-10 md:space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Subscription Plans</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Choose the perfect plan for your photography business. Upgrade anytime.
          </p>
        </div>

        {/* Improved Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-card border rounded-xl p-1.5 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "flex-1 text-center py-2 px-4 rounded-md transition-all text-sm font-medium",
                billingCycle === 'monthly' 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                "flex-1 text-center py-2 px-4 rounded-md transition-all text-sm font-medium flex items-center justify-center gap-2",
                billingCycle === 'yearly' 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span>Yearly</span>
              <Badge variant="outline" className="text-xs py-0 h-5 bg-green-500/10 text-green-500 border-green-500/20">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {Object.entries(plans).map(([planId, plan]) => {
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
            const isSelected = selectedPlan === planId;
            const isFree = planId === 'free';

            return (
            <Card 
              key={planId} 
              className={cn(
                "relative flex flex-col transition-all duration-200 hover:shadow-lg",
                isSelected && !isFree && "ring-2 ring-primary border-primary",
                plan.popular && !isSelected && "border-primary/30" 
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="px-3 py-1 rounded-full font-medium">POPULAR</Badge>
                </div>
              )}
              <CardHeader className="pt-8">
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="text-3xl font-bold">
                  ${formatPrice(price)}
                  <span className="text-sm font-normal text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50" />
                      )}
                      <span className={cn(
                        !feature.included && "text-muted-foreground/50 line-through"
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
                  variant={isSelected ? "default" : plan.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading && selectedPlan === planId}
                >
                  {isLoading && selectedPlan === planId ? 'Loading...' : isSelected ? 'Selected' : isFree ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          )})}
        </div>

        {/* Payment Modal */}
        <Dialog open={paymentModalOpen && !!clientSecret} onOpenChange={(open) => setPaymentModalOpen(open)}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium">Complete Your Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedPlan && selectedPlan !== 'free' && clientSecret && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Selected plan</h3>
                      <div className="text-right">
                        <div className="text-sm font-medium">{plans[selectedPlan as keyof typeof plans].name}</div>
                        <div className="text-2xl font-bold">
                          ${formatPrice(finalAmount !== null ? finalAmount : plans[selectedPlan as keyof typeof plans].price[billingCycle])}
                          <span className="text-sm text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Elements stripe={stripePromise} options={elementOptions}>
                    <CheckoutForm 
                      onPaymentSuccess={handlePaymentSuccess} 
                      isLoading={isLoading} 
                      setIsLoading={setIsLoading} 
                    />
                  </Elements>

                  {/* Coupon Code Section moved after payment elements */}
                  <div className="pt-6 mt-6 border-t border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="coupon" className="text-sm font-medium">Have a Coupon Code?</Label>
                      {isValidatingCoupon && (
                        <span className="text-xs text-muted-foreground animate-pulse">
                          Validating coupon...
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-grow relative">
                          <Input 
                            id="coupon" 
                            placeholder="Enter coupon code" 
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value)
                              setCouponError(null)
                              setCouponSuccess(null)
                            }}
                            className={cn(
                              "pr-8",
                              couponError && "border-red-500 focus-visible:ring-red-500",
                              couponSuccess && "border-green-500 focus-visible:ring-green-500"
                            )}
                            disabled={isValidatingCoupon || isApplyingCoupon}
                          />
                          {isValidatingCoupon && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-r-transparent" />
                            </div>
                          )}
                        </div>
                        <Button 
                          onClick={handleApplyCoupon} 
                          disabled={isApplyingCoupon || isValidatingCoupon || !couponCode}
                          variant="outline"
                          className="flex-shrink-0 min-w-[100px]" 
                        >
                          {isValidatingCoupon ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-r-transparent" />
                              Validating
                            </span>
                          ) : isApplyingCoupon ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-r-transparent" />
                              Applying
                            </span>
                          ) : (
                            <>
                              Apply
                              <TicketPercent className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Coupon Status Messages */}
                      {couponError && (
                        <div className="text-sm text-red-500 bg-red-500/10 py-2 px-3 rounded-md flex items-start gap-2">
                          <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{couponError}</span>
                        </div>
                      )}
                      {couponSuccess && (
                        <div className="text-sm text-green-500 bg-green-500/10 py-2 px-3 rounded-md flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{couponSuccess}</span>
                        </div>
                      )}
                      
                      {/* Discount Applied Message */}
                      {finalAmount !== null && 
                        plans[selectedPlan as keyof typeof plans] && 
                        finalAmount !== plans[selectedPlan as keyof typeof plans].price[billingCycle] && (
                        <div className="text-sm text-green-500 bg-green-500/10 py-2 px-3 rounded-md flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Discount applied! Original price: <span className="line-through">${formatPrice(plans[selectedPlan as keyof typeof plans].price[billingCycle])}</span>
                            <br />New total: <strong>${formatPrice(finalAmount)}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 