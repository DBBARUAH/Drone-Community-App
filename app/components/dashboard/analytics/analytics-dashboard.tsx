"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewAnalytics } from "@/components/dashboard/analytics/overview-analytics"
import { PremiumAnalytics } from "@/components/dashboard/analytics/premium-analytics"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AnalyticsDashboardProps {
  isPremium?: boolean
  isProfileComplete?: boolean
  isPortfolioComplete?: boolean
}

export function AnalyticsDashboard({
  isPremium = false,
  isProfileComplete = false,
  isPortfolioComplete = false,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance and optimize your photography business</p>
        </div>

        <div className="flex items-center gap-2">
          {isPremium ? (
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-black font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          ) : (
            <Badge variant="outline" className="font-normal">
              Free Plan
            </Badge>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {isPremium
                    ? "You have access to all premium analytics features"
                    : "Upgrade to Premium for advanced analytics features"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">
            Insights
            {!isPremium && <Sparkles className="h-3 w-3 ml-1 text-amber-400" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewAnalytics
            isPremium={isPremium}
            isProfileComplete={isProfileComplete}
            isPortfolioComplete={isPortfolioComplete}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <PremiumAnalytics isPremium={isPremium} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
