"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative h-8 w-[72px] rounded-full bg-slate-200 dark:bg-slate-900">
        <div className="h-8 w-8" />
      </div>
    )
  }
  
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative h-8 w-[72px] rounded-full",
        "bg-slate-200 dark:bg-slate-900",
        "transition-all duration-300 ease-in-out",
        "hover:scale-105",
        "active:scale-95"
      )}
      aria-label="Toggle theme"
    >
      {/* Background icons */}
      <div className="flex h-full w-full items-center justify-between px-2">
        <Sun className={cn(
          "h-4 w-4 text-slate-600 dark:text-slate-400",
          "transition-all duration-300",
          theme === 'light' && "animate-spin-once"
        )} />
        <Moon className={cn(
          "h-4 w-4 text-slate-600 dark:text-slate-400",
          "transition-all duration-300",
          theme === 'dark' && "animate-spin-once"
        )} />
      </div>
      
      {/* Sliding thumb */}
      <div
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full",
          "bg-white dark:bg-slate-800",
          "shadow-sm dark:shadow-slate-950/50",
          "transition-all duration-300 ease-spring",
          theme === "dark" ? "translate-x-[40px]" : "translate-x-1",
          "hover:shadow-md"
        )}
      >
        {/* Active icon */}
        <div className="flex h-full w-full items-center justify-center">
          {theme === "light" ? (
            <Sun className="h-3 w-3 text-yellow-500" />
          ) : (
            <Moon className="h-3 w-3 text-blue-200" />
          )}
        </div>
      </div>
    </button>
  )
} 