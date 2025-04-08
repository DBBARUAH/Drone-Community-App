"use client";

import Stripe from 'stripe';
import React, { Suspense, useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, ArrowRight, Sparkles, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import TimedRedirect from './timed-redirect';
import { motion, AnimatePresence } from "framer-motion";

// Loading component with improved animation
function LoadingSpinner() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <RefreshCcw className="absolute inset-0 w-16 h-16 text-primary animate-spin" />
        </div>
        <p className="text-lg text-muted-foreground animate-pulse">Verifying payment details...</p>
      </motion.div>
    </div>
  );
}

// Component containing the core logic that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethodDetails, setPaymentMethodDetails] = useState('Unknown method');

  useEffect(() => {
    async function getPaymentDetails() {
      if (!searchParams) {
        console.log('Search params not available, redirecting.');
        redirect('/dashboard/payment-pricing');
        return;
      }

      try {
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId) {
          console.log('No payment_intent ID found, redirecting.');
          redirect('/dashboard/payment-pricing');
          return;
        }

        const response = await fetch(`/api/payment/get-intent?payment_intent=${paymentIntentId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch payment details' }));
          throw new Error(errorData.error || 'Failed to fetch payment details');
        }
        
        const data = await response.json();
        
        if (data.error) {
          setErrorMessage(data.error);
          setIsSuccess(false);
        } else {
          setPaymentIntent(data.paymentIntent);
          setIsSuccess(data.paymentIntent?.status === 'succeeded');
          
          const paymentMethod = data.paymentIntent?.payment_method;
          if (typeof paymentMethod === 'object' && paymentMethod !== null && paymentMethod.type === 'card' && paymentMethod.card) {
            setPaymentMethodDetails(`${paymentMethod.card.brand.toUpperCase()} •••• ${paymentMethod.card.last4}`);
          } else if (typeof paymentMethod === 'object' && paymentMethod !== null) {
            setPaymentMethodDetails(`${paymentMethod.type.toUpperCase()}`);
          }
        }
      } catch (error: any) {
        console.error("Error retrieving payment details:", error);
        setErrorMessage(error.message || "Could not retrieve payment details. Please contact support.");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    getPaymentDetails();
  }, [searchParams]);

  const formatAmount = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return 'N/A';
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSuccess ? 'success' : 'error'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={cn(
            "backdrop-blur-sm border-2 transition-all duration-500",
            isSuccess 
              ? "border-green-500/20 bg-green-50/30 dark:bg-green-950/20" 
              : "border-red-500/20 bg-red-50/30 dark:bg-red-950/20"
          )}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {isSuccess ? (
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )}
                </motion.div>
                <div className="space-y-1">
                  <CardTitle className={cn(
                    "text-2xl font-bold",
                    isSuccess ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  )}>
                    {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isSuccess
                      ? 'Your payment was successful! You will be redirected shortly...'
                      : errorMessage || `Your payment status is: ${paymentIntent?.status || 'Unknown'}. Please contact support.`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSuccess && paymentIntent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg bg-white/50 dark:bg-black/20 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Amount Paid:</div>
                      <div className="font-medium text-right">{formatAmount(paymentIntent.amount_received)}</div>
                      
                      <div className="text-muted-foreground">Payment Method:</div>
                      <div className="font-medium text-right">{paymentMethodDetails}</div>
                      
                      {paymentIntent.metadata?.plan && (
                        <>
                          <div className="text-muted-foreground">Plan:</div>
                          <div className="font-medium text-right">{paymentIntent.metadata.plan.toUpperCase()}</div>
                        </>
                      )}
                      
                      {paymentIntent.metadata?.appliedCouponCode && (
                        <>
                          <div className="text-muted-foreground">Coupon Applied:</div>
                          <div className="font-medium text-right">
                            {paymentIntent.metadata.appliedCouponCode}
                            <span className="ml-1 text-green-600">
                              (-{paymentIntent.metadata.discountPercentage}%)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="text-xs font-mono text-muted-foreground">
                        Transaction ID: {paymentIntent.id}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isSuccess && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
                  <AlertTitle className="text-red-800 dark:text-red-300">Important Notice</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-400">
                    If you believe this is an error, please contact support with your Payment Intent ID:
                    <code className="ml-2 text-xs font-mono bg-red-100 dark:bg-red-900/50 p-1 rounded">
                      {searchParams?.get('payment_intent')}
                    </code>
                  </AlertDescription>
                </Alert>
              )}

              {isSuccess && <TimedRedirect delay={10000} target='/dashboard/analytics' />}

              <div className="flex justify-center pt-4">
                <Link href={isSuccess ? "/dashboard/analytics" : "/dashboard/payment-pricing"} passHref>
                  <Button
                    variant={isSuccess ? "outline" : "default"}
                    size="lg"
                    className={cn(
                      "min-w-[200px] transition-all duration-300",
                      isSuccess 
                        ? "hover:bg-green-50 hover:text-green-600" 
                        : "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {isSuccess ? (
                      <span className="flex items-center gap-2">
                        Go to Analytics
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    ) : (
                      'Back to Pricing'
                    )}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Main Page component wrapping the content in Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 