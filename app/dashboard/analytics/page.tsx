"use client"

import { Suspense } from "react"
import { Loader2 } from 'lucide-react'
import RequirePhotographer from "@/components/auth/require-photographer"
import AnalyticsClient from "./analytics-client"

export default function AnalyticsPage() {
  return (
    <RequirePhotographer>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading analytics...</span>
        </div>
      }>
        <AnalyticsClient />
      </Suspense>
    </RequirePhotographer>
  )
}
