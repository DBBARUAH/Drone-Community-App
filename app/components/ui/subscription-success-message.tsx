"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import Confetti from "react-confetti"
import { useWindowSize } from "@react-hook/window-size"

interface SubscriptionSuccessMessageProps {
  planName: string
}

export function SubscriptionSuccessMessage({ planName }: SubscriptionSuccessMessageProps) {
  const [width, height] = useWindowSize()

  return (
    <>
      <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      <Card className="w-full max-w-lg mx-auto my-8 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-green-800 dark:text-green-300">Subscription Successful!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-400">
            Welcome to the {planName}! You now have access to all premium features.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Your premium access is active. You can now explore advanced analytics, detailed insights, and more.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard/analytics">
              Explore Premium Analytics
              <Sparkles className="h-4 w-4 ml-2" />
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  )
} 