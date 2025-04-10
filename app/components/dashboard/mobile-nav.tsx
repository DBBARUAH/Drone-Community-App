"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { useAuth } from "@/hooks/useAuth"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isPhotographer } = useAuth()
  const userRole = isPhotographer ? "photographer" : "client"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 top-16 h-[calc(100vh-4rem)] border-t">
        <div className="h-full py-6 px-4">
          <DashboardNav className="px-1" userRole={userRole} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

