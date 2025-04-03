"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isPhotographer } = useAuth()

  useEffect(() => {
    // Check if user is authenticated and redirect if needed
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/signin")
      } else if (isPhotographer) {
        // If user is a photographer, redirect to photographer dashboard
        router.push("/dashboard/photographer")
      }
    }
  }, [isLoading, isAuthenticated, isPhotographer, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden pt-6">{children}</main>
      </div>
    </div>
  )
}

