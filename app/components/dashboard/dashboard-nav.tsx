"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, CreditCard, Image, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"

interface DashboardNavProps {
  className?: string
  userRole?: string
}

export function DashboardNav({ className, userRole = "client" }: DashboardNavProps) {
  const pathname = usePathname()

  const baseNavItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Community",
      href: "/dashboard/community",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  // Add portfolio item only for photographers
  const navItems = userRole === "photographer" 
    ? [
        ...baseNavItems.slice(0, 2), // Insert Portfolio after Bookings
        {
          title: "Portfolio",
          href: "/dashboard/portfolio",
          icon: Image,
        },
        ...baseNavItems.slice(2)
      ] 
    : baseNavItems;

  return (
    <nav className={cn("flex flex-col space-y-1 py-4 font-sans", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent font-sans",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <item.icon className="h-4 w-4" />
          <span className="font-sans">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

