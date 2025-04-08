"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Lock, Sparkles, Star, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"

export default function PaymentPricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  const { user, isLoading } = useAuth()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Basic analytics and portfolio features",
      features: [
        "Basic profile and portfolio",
        "Limited analytics dashboard",
        "Standard booking management",
        "Community access",
      ],
      limitations: [
        "Limited to 10 portfolio items",
        "Basic analytics only",
        "No revenue forecasting",
        "No competitor benchmarking",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19.99",
      period: "monthly",
      description: "Enhanced features for growing photographers",
      features: [
        "Everything in Free plan",
        "Unlimited portfolio items",
        "Enhanced analytics dashboard",
        "Priority in search results",
        "Custom branding options",
      ],
      limitations: ["Limited revenue forecasting", "Basic competitor benchmarking", "Standard support"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$39.99",
      period: "monthly",
      description: "Complete solution for professional photographers",
      features: [
        "Everything in Pro plan",
        "Full premium analytics suite",
        "Advanced revenue forecasting",
        "Detailed competitor benchmarking",
        "Client demographic insights",
        "Priority support",
        "Featured photographer status",
      ],
      limitations: [],
    },
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true)
    setCouponError(null)

    // Simulate API call to validate coupon
    setTimeout(() => {
      // For development: DEVPREMIUM is a special coupon that unlocks premium features
      if (couponCode.toLowerCase() === "devpremium") {
        setCouponApplied(true)
        setCouponError(null)
        toast({
          title: "Developer Mode Activated",
          description: "Premium features are now available for development purposes.",
          duration: 5000,
        })
        // In a real app, you would set a cookie or localStorage flag here
        localStorage.setItem("devPremiumAccess", "true")
      } else if (couponCode.toLowerCase() === "premium50") {
        setCouponApplied(true)
        setCouponError(null)
      } else {
        setCouponApplied(false)
        setCouponError("Invalid coupon code")
      }
      setIsApplyingCoupon(false)
    }, 1000)
  }

  const handleSubscribe = () => {
    // In a real app, this would redirect to a payment processor
    alert(`Subscribing to ${selectedPlan} plan${couponApplied ? " with coupon applied" : ""}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment & Pricing</h2>
        <p className="text-muted-foreground">Choose the right plan for your photography business</p>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Try Premium Analytics for free</AlertTitle>
        <AlertDescription>
          Get a 1-month free trial of our Premium plan. No credit card required for the trial period.
        </AlertDescription>
      </Alert>

      <Alert className="bg-primary/5 border-primary/20">
        <Lock className="h-4 w-4" />
        <AlertTitle>Developer Access</AlertTitle>
        <AlertDescription>
          For development purposes, use the coupon code <strong>DEVPREMIUM</strong> to unlock all premium features.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="monthly">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Billing (Save 20%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden",
                  selectedPlan === plan.id && "border-primary ring-1 ring-primary",
                  plan.id === "premium" && "border-amber-500/50",
                )}
              >
                {plan.id === "premium" && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-tl-none rounded-br-none bg-gradient-to-r from-amber-500 to-amber-300 text-black">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      BEST VALUE
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.id === "free" ? "outline" : "default"}
                    className={cn(
                      "w-full",
                      plan.id === "premium" &&
                        "bg-gradient-to-r from-amber-500 to-amber-300 text-black hover:from-amber-600 hover:to-amber-400",
                    )}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === "free" ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.id === "premium" && <Sparkles className="h-4 w-4 mr-2" />}
                        Select Plan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={`${plan.id}-yearly`}
                className={cn(
                  "relative overflow-hidden",
                  selectedPlan === `${plan.id}-yearly` && "border-primary ring-1 ring-primary",
                  plan.id === "premium" && "border-amber-500/50",
                )}
              >
                {plan.id === "premium" && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-tl-none rounded-br-none bg-gradient-to-r from-amber-500 to-amber-300 text-black">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      BEST VALUE
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    {plan.id !== "free" ? (
                      <>
                        <span className="text-3xl font-bold">
                          ${(Number.parseFloat(plan.price.replace("$", "")) * 0.8 * 12).toFixed(2)}
                        </span>
                        <span className="ml-1 text-muted-foreground">/yearly</span>
                        <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
                          Save 20%
                        </Badge>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.id === "free" ? "outline" : "default"}
                    className={cn(
                      "w-full",
                      plan.id === "premium" &&
                        "bg-gradient-to-r from-amber-500 to-amber-300 text-black hover:from-amber-600 hover:to-amber-400",
                    )}
                    onClick={() => handleSelectPlan(`${plan.id}-yearly`)}
                  >
                    {plan.id === "free" ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.id === "premium" && <Sparkles className="h-4 w-4 mr-2" />}
                        Select Plan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPlan && selectedPlan !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Subscription</CardTitle>
            <CardDescription>
              You've selected the {selectedPlan.includes("premium") ? "Premium" : "Pro"} plan
              {selectedPlan.includes("yearly") ? " with yearly billing" : ""}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Have a coupon code?</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode}>
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>

              {couponApplied && (
                <div className="text-sm text-green-500 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Coupon applied successfully! 50% discount.
                </div>
              )}

              {couponError && <div className="text-sm text-red-500">{couponError}</div>}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {selectedPlan.includes("premium")
                    ? selectedPlan.includes("yearly")
                      ? "$383.90"
                      : "$39.99"
                    : selectedPlan.includes("yearly")
                      ? "$191.90"
                      : "$19.99"}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-green-500">
                  <span>Discount (50%)</span>
                  <span>
                    -
                    {selectedPlan.includes("premium")
                      ? selectedPlan.includes("yearly")
                        ? "$191.95"
                        : "$20.00"
                      : selectedPlan.includes("yearly")
                        ? "$95.95"
                        : "$10.00"}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {couponApplied
                    ? selectedPlan.includes("premium")
                      ? selectedPlan.includes("yearly")
                        ? "$191.95"
                        : "$19.99"
                      : selectedPlan.includes("yearly")
                        ? "$95.95"
                        : "$9.99"
                    : selectedPlan.includes("premium")
                      ? selectedPlan.includes("yearly")
                        ? "$383.90"
                        : "$39.99"
                      : selectedPlan.includes("yearly")
                        ? "$191.90"
                        : "$19.99"}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" onClick={handleSubscribe}>
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>

            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Secure payment processing
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
