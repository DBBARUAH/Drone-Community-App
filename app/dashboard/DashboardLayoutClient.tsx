"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { usePathname } from "next/navigation"
import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { DashboardSearch } from "@/components/dashboard/dashboard-search"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { isPhotographer, setUserRole } = useAuth()
  const userRole = isPhotographer ? "photographer" : "client"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleRoleChange = (role: string) => {
    if (role === "photographer" || role === "client") {
      setUserRole(role)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <MobileNav />
            
            <div className="hidden md:flex">
              <DashboardSearch />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <RoleSwitcher onRoleChange={handleRoleChange} />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden h-[calc(100vh-4rem)] md:block border-r">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <DashboardNav userRole={userRole} />
          </ScrollArea>
        </aside>
        <main className="flex flex-col p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

