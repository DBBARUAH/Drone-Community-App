"use client"

import { useState, useEffect } from "react"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { PhotographerDashboard } from "@/components/dashboard/photographer-dashboard"

export default function PhotographerDashboardPage() {
  const { user, isAuthenticated, isLoading, isClient, isPhotographer } = useAuth()
  const [isNewUser, setIsNewUser] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    // Check if user is new
    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard")
    if (hasVisitedBefore) {
      setIsNewUser(false)
    } else {
      localStorage.setItem("hasVisitedDashboard", "true")
    }
    
    // Handle redirects based on authentication and roles
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/api/auth/login")
      } else if (isAuthenticated && isClient && !isPhotographer) {
        router.push("/dashboard/client")
      }
    }
  }, [isLoading, isAuthenticated, isClient, isPhotographer, router])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }
  
  // During render, just show a message if we know we'll redirect
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Redirecting to login...</p>
      </div>
    )
  }
  
  if (isAuthenticated && isClient && !isPhotographer) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Redirecting to client dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Photographer Dashboard</h2>
          <p className="text-foreground-600">
            {isNewUser
              ? "Welcome to Travellers Beats! Let's get you started."
              : "Welcome back! Here's an overview of your account."}
          </p>
        </div>
      </div>

      <PhotographerDashboard />
    </div>
  )
} 