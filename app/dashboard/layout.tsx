"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Since we need to track role across page changes, we'll use localStorage to persist the role
  const [userRole, setUserRole] = useState("client")
  
  useEffect(() => {
    // Get saved role from localStorage
    const savedRole = localStorage.getItem("userRole") || "client"
    setUserRole(savedRole)
    
    // Listen for role changes from dashboard page
    const handleRoleChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        setUserRole(e.newValue || "client")
      }
    }
    
    window.addEventListener("storage", handleRoleChange)
    return () => window.removeEventListener("storage", handleRoleChange)
  }, [])

  return (
    <NextUIProvider>
      <div className="dashboard flex min-h-screen flex-col bg-background text-foreground font-sans" style={{ fontFamily: "var(--font-inter)" }}>
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <DashboardNav userRole={userRole} />
          </aside>
          <main className="flex w-full flex-col overflow-hidden pt-6">{children}</main>
        </div>
      </div>
    </NextUIProvider>
  )
}

