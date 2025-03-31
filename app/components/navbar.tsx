"use client"

import { useState } from "react"
import Link from "next/link"
import { LogOut, Menu, User, Camera } from "lucide-react"

import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, isLoading, isPhotographer } = useAuth()

  // Handle Auth0 logout
  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="/#aboutus" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
          </nav>

          {/* Authentication Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              // Loading state
              <Button variant="ghost" disabled>
                <span className="animate-pulse">Loading...</span>
              </Button>
            ) : isAuthenticated && user ? (
              <UserMenu user={user} isPhotographer={isPhotographer} onLogout={handleLogout} />
            ) : (
              <Button variant="default" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-10">
                <Link
                  href="/"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/services"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/blog"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/#aboutus"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>

                {/* Authentication Buttons - Mobile */}
                {isLoading ? (
                  <div className="py-4 text-center animate-pulse">Loading...</div>
                ) : isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 py-3 border-y">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.picture || "/placeholder-user.jpg"} alt={user.name || "User"} />
                        <AvatarFallback>
                          {user.name
                            ? user.name.split(" ").map((n: string) => n[0]).join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email || "user@example.com"}</p>
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
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <span className="font-sans">Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button variant="default" asChild className="w-full mt-4">
                    <Link href="/signin" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

// User menu component for authenticated users
function UserMenu({
  user,
  isPhotographer,
  onLogout,
}: {
  user: any;
  isPhotographer: boolean;
  onLogout: () => void
}) {
  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture || "/placeholder-user.jpg"} alt={user.name || "User"} />
            <AvatarFallback>
              {user.name
                ? user.name.split(" ").map((n: string) => n[0]).join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-sans" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email || "user@example.com"}</p>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="font-sans">
          <Link href="/dashboard" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="font-sans">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

