"use client"

import { Card, CardContent } from "@/components/ui/blog-card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface AnalyticsCardProps {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: number
  isLoading?: boolean
  isPremium?: boolean
}

export function AnalyticsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading = false,
  isPremium = false,
}: AnalyticsCardProps) {
  return (
    <Card className={cn("overflow-hidden", isPremium && "border-dashed")}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md"></div>
            ) : isPremium ? (
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>

          {Icon && !isPremium && (
            <div className="rounded-full p-2 bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>

        {!isLoading && !isPremium && trend !== undefined && (
          <div className="flex items-center mt-4">
            <div className={cn("text-xs font-medium flex items-center", trend > 0 ? "text-green-500" : "text-red-500")}>
              {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
            {description && <p className="text-xs text-muted-foreground ml-2">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
