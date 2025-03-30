"use client"
import { Bell, Search } from "lucide-react"

import { Logo } from "@/components/ui/logo"
import { Button, Input } from "@nextui-org/react"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background font-sans">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo />
        </div>
        <div className="hidden md:flex items-center gap-4 md:gap-6 font-sans">
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Search..."
              startContent={<Search className="h-4 w-4 text-foreground-400" />}
              className="w-full font-sans"
            />
          </div>
          <ThemeToggle />
          <Button isIconOnly variant="flat" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}

