"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import RequirePhotographer from "@/components/auth/require-photographer"
import { PortfolioBuilder } from "@/components/dashboard/portfolio/portfolio-builder"

export default function CreatePortfolioPage() {
  return (
    <RequirePhotographer>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading portfolio builder...</span>
        </div>
      }>
        <div className="space-y-6">
          <PortfolioBuilder />
        </div>
      </Suspense>
    </RequirePhotographer>
  )
}

