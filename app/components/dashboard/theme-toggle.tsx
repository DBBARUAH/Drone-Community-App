"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@nextui-org/react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // After component is mounted, we can show the correct icon
  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and initial client render, render a placeholder or one consistent icon
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        radius="full"
        size="sm"
        aria-label="Toggle theme"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }
  
  return (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-foreground/80 hover:text-foreground transition-colors"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
} 