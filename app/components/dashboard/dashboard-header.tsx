"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Search, Home } from "lucide-react"

import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { DashboardSearch } from "@/components/dashboard/dashboard-search"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function DashboardHeader() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 border-b bg-background font-sans",
        "z-50", // Consistent z-index for both mobile and desktop
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo className="hidden md:block" />
        </div>

        {/* Mobile Header - Right Side */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-16 h-auto">
              <div className="mx-auto w-full p-4">
                <DashboardSearch onSelect={() => setMobileSearchOpen(false)} isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild variant="ghost" size="icon" className="text-foreground" aria-label="Home">
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <NotificationBell count={3} />
          <UserNav />
        </div>

        {/* Desktop Header - Right Side */}
        <div className="hidden md:flex items-center gap-4 md:gap-6 font-sans">
          <DashboardSearch />
          <Button asChild variant="outline" className="gap-2" aria-label="Back to Home">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          <ThemeToggle />
          <NotificationBell count={3} />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

