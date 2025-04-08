"use client"

import { useState, useEffect } from "react"
import { AnalyticsDashboard } from "@/components/dashboard/analytics/analytics-dashboard"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isPortfolioComplete, setIsPortfolioComplete] = useState(false)

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Check if developer premium access is enabled
    const devPremiumAccess = localStorage.getItem("devPremiumAccess") === "true"

    // Simulate API call to get user subscription status
    const fetchUserData = async () => {
      // Mock data - in a real app, this would come from your API
      setIsPremium(devPremiumAccess) // Use the developer access flag
      setIsProfileComplete(true) // Set to false to show the profile completion alert
      setIsPortfolioComplete(false) // Set to false to show the portfolio completion alert

      // Show toast if developer mode is active
      if (devPremiumAccess) {
        toast({
          title: "Developer Premium Mode Active",
          description: "You're viewing premium analytics features in developer mode.",
          duration: 3000,
        })
      }
    }

    if (!isLoading) {
      fetchUserData()
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AnalyticsDashboard
      isPremium={isPremium}
      isProfileComplete={isProfileComplete}
      isPortfolioComplete={isPortfolioComplete}
    />
  )
}
