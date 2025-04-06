"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { HeroUIProvider } from "@heroui/react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use the Auth0 roles from useAuth hook
  const { isAuthenticated, isClient, isPhotographer, user, isLoading } = useAuth()
  const [userRole, setUserRole] = useState("client")
  
  useEffect(() => {
    // First check Auth0 roles from user token
    if (!isLoading && isAuthenticated) {
      if (isPhotographer) {
        setUserRole("photographer")
      } else {
        setUserRole("client")
      }
    } 
    // Fallback to localStorage if needed
    else {
    const savedRole = localStorage.getItem("userRole") || "client"
    setUserRole(savedRole)
    }
  }, [isLoading, isAuthenticated, isClient, isPhotographer])

  // Add dashboard-fonts class to body when component mounts
  useEffect(() => {
    document.body.classList.add('dashboard-fonts')
    return () => {
      document.body.classList.remove('dashboard-fonts')
    }
  }, [])

  return (
    <HeroUIProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="antialiased">
          <DashboardHeader />
          <div className="pt-16">
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
              <aside className="fixed top-[4.5rem] z-30 -ml-2 hidden h-[calc(100vh-4.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block">
                <DashboardNav userRole={userRole} />
              </aside>
              <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </HeroUIProvider>
  )
}

