"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, isClient, isPhotographer } = useAuth()

  useEffect(() => {
    // Redirect based on role when component mounts (client-side)
    if (!isLoading && isAuthenticated) {
      if (isPhotographer) {
        window.location.href = "/dashboard/photographer"
      } else {
        window.location.href = "/dashboard/client"
      }
    }
  }, [isLoading, isAuthenticated, isClient, isPhotographer])

  // For server-side redirect or initial render
  if (!isLoading) {
    if (!isAuthenticated) {
      redirect("/api/auth/login")
    } else if (isPhotographer) {
      redirect("/dashboard/photographer")
    } else {
      redirect("/dashboard/client")
    }
  }

  // Show loading state while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p>Loading your dashboard...</p>
    </div>
  )
}

