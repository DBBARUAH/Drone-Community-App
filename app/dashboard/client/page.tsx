"use client"

import { useState, useEffect } from "react"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Camera, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ClientDashboardPage() {
  const { user, isAuthenticated, isLoading, isClient, isPhotographer } = useAuth()
  const [isNewUser, setIsNewUser] = useState(true)
  const router = useRouter()
  
  // State to track whether we came from the "Submit Your Work" button
  const [showUploadBanner, setShowUploadBanner] = useState(false)
  
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
      } else if (isAuthenticated && isPhotographer && !isClient) {
        router.push("/dashboard/photographer")
      }
    }

    // Check if we came from the "Submit Your Work" button by checking URL params
    const params = new URLSearchParams(window.location.search)
    if (params.get('fromSubmit') === 'true') {
      setShowUploadBanner(true)
      
      // Clear the URL parameter without full page reload
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      
      // Store in sessionStorage to persist across page renders but not browser sessions
      sessionStorage.setItem('showClientUploadBanner', 'true')
    }
    
    // Check sessionStorage on mount to restore banner state
    const shouldShowBanner = sessionStorage.getItem('showClientUploadBanner') === 'true'
    if (shouldShowBanner) {
      setShowUploadBanner(true)
    }

    // Cleanup function to remove banner state when navigating away
    return () => {
      sessionStorage.removeItem('showClientUploadBanner')
      setShowUploadBanner(false)
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
  
  if (isAuthenticated && isPhotographer && !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Redirecting to photographer dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio upload guidance banner */}
      {showUploadBanner && (
        <Alert className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 text-foreground relative group">
          <Camera className="h-5 w-5 text-gold" />
          <AlertTitle className="text-lg font-semibold mb-2">Want to showcase your drone photography?</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>You can submit your work to be displayed in our community gallery and featured section. Submit your best drone photography and videography to attract potential clients and gain recognition in our growing community.</p>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                asChild 
                className="bg-gradient-to-r from-gold to-gold-dark text-black hover:from-gold/90 hover:to-gold-dark/90"
              >
                <Link href="/api/auth/login?role=photographer&connection=google-oauth2&returnTo=/dashboard">
                  Sign up as a Photographer <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </AlertDescription>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => {
              setShowUploadBanner(false);
              sessionStorage.removeItem('showClientUploadBanner');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      )}
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Dashboard</h2>
          <p className="text-foreground-600">
            {isNewUser
              ? "Welcome to Travellers Beats! Let's get you started."
              : "Welcome back! Here's an overview of your account."}
          </p>
        </div>
      </div>

      <ClientDashboard />
    </div>
  )
} 