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
      exactMatch: true,
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
    <nav className={cn("flex flex-col space-y-2 py-4 font-sans", className)}>
      {navItems.map((item) => {
        // For the dashboard overview page, only highlight if paths match exactly
        // For all other pages, check if current pathname starts with the nav item's href
        // This prevents the Dashboard (overview) from being highlighted when in other sections
        const isActive = item.exactMatch 
          ? pathname === item.href 
          : pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== "/dashboard");
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
              "font-sans tracking-tight"
            )}
          >
            <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "opacity-70")} />
            <span>{item.title}</span>
            
            {isActive && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

