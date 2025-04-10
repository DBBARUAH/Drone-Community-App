"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function RequirePhotographer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isPhotographer, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isPhotographer) {
      toast.error("This feature is only available to photographers. Please switch your account role or upgrade to a photographer plan.")
      router.push("/dashboard")
    }
  }, [isLoading, isPhotographer, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if user is a photographer
  if (!isPhotographer) {
    return null
  }

  return <>{children}</>
} 