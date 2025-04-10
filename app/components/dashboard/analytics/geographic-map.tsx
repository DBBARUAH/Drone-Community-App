"use client"

import { MapPin } from "lucide-react"

interface GeographicMapProps {
  isLoading?: boolean
}

export function GeographicMap({ isLoading = false }: GeographicMapProps) {
  if (isLoading) {
    return <div className="h-[200px] bg-muted animate-pulse rounded-md"></div>
  }

  // This is a simplified map visualization
  // In a real application, you would use a mapping library like react-simple-maps or Mapbox
  return (
    <div className="h-[200px] bg-muted/30 rounded-md relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Interactive map visualization</div>
      </div>

      {/* Simplified map markers */}
      <div className="absolute top-1/4 left-1/3 animate-pulse">
        <MapPin className="h-4 w-4 text-primary" />
      </div>
      <div className="absolute top-1/2 left-1/2 animate-pulse">
        <MapPin className="h-5 w-5 text-primary" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-pulse">
        <MapPin className="h-3 w-3 text-primary" />
      </div>
    </div>
  )
}
