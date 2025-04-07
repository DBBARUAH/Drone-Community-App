"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Camera, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { usePathname } from "next/navigation"

interface UserNavProps {
  showHomeLink?: boolean;
}

export function UserNav({ showHomeLink }: UserNavProps) {
  const { user, isAuthenticated, isLoading, isPhotographer, isClient } = useAuth()
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")
  
  // Debug log to confirm values
  console.log('DEBUG UserNav:', { pathname, isDashboard, location: typeof window !== 'undefined' ? window.location.pathname : 'server' })
  
  // Fallback for loading state
  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9 border border-primary/10">
          <AvatarFallback className="bg-muted">...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  // Fallback if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9 border border-primary/10">
          <AvatarFallback className="bg-muted">?</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border border-primary/10">
            <AvatarImage src={user.picture || "/placeholder-user.jpg"} alt={user.name || "User"} />
            <AvatarFallback className="text-xs font-medium">
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-sans" align="end" forceMount sideOffset={5}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || "user@example.com"}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                {isPhotographer ? (
                  <>
                    <Camera className="h-3 w-3" />
                    Photographer
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3" />
                    Client
                  </>
                )}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="!bg-emerald-600 hover:!bg-emerald-700 !text-white py-3">
            <Link href="/" className="w-full cursor-pointer flex items-center">
              <Home className="mr-2 h-5 w-5" />
              <span className="font-bold">Back to Home</span>
            </Link>
          </DropdownMenuItem>
          {!isDashboard && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="w-full cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="w-full cursor-pointer flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="w-full cursor-pointer flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="w-full cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

