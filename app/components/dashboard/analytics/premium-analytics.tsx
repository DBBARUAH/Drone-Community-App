"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Sparkles, Filter, Download, Check } from "lucide-react"
import Link from "next/link"
import { RevenueTrendsChart } from "@/components/dashboard/analytics/revenue-trends-chart"
import { ClientDemographicsChart } from "@/components/dashboard/analytics/client-demographics-chart"
import { EngagementFunnelChart } from "@/components/dashboard/analytics/engagement-funnel-chart"
import { CompetitorBenchmarkChart } from "@/components/dashboard/analytics/competitor-benchmark-chart"
import { RepeatCustomerChart } from "@/components/dashboard/analytics/repeat-customer-chart"
import { PortfolioEngagementChart } from "@/components/dashboard/analytics/portfolio-engagement-chart"
import { TimeManagementChart } from "@/components/dashboard/analytics/time-management-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PremiumAnalyticsProps {
  isPremium?: boolean
}

export function PremiumAnalytics({ isPremium = false }: PremiumAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // If not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Premium Analytics Required</CardTitle>
              <CardDescription className="max-w-md">
                Unlock detailed insights, revenue forecasting, and competitor benchmarking with Premium Analytics.
              </CardDescription>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Revenue breakdown</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Client demographics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Engagement funnel</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Competitor benchmarking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Portfolio engagement</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm">Time management insights</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
                  <Link href="/dashboard/settings/subscription">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Link>
                </Button>
                <Button variant="outline">Start 1-Month Free Trial</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blurred preview of premium analytics */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 blur-sm pointer-events-none opacity-70">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-64 bg-muted/50 rounded-md"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Demographics</CardTitle>
              </CardHeader>
              <CardContent className="h-64 bg-muted/50 rounded-md"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Funnel</CardTitle>
              </CardHeader>
              <CardContent className="h-64 bg-muted/50 rounded-md"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Benchmarking</CardTitle>
              </CardHeader>
              <CardContent className="h-64 bg-muted/50 rounded-md"></CardContent>
            </Card>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-medium mb-2">Premium Content Locked</h3>
              <p className="text-sm text-muted-foreground mb-4">Upgrade to access these detailed analytics</p>
              <Button asChild size="sm">
                <Link href="/dashboard/settings/subscription">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time range selector and export controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Breakdown & Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Breakdown & Trends</CardTitle>
            <Badge variant="outline" className="font-normal">
              {timeRange === "7days"
                ? "Last 7 days"
                : timeRange === "30days"
                  ? "Last 30 days"
                  : timeRange === "90days"
                    ? "Last 90 days"
                    : "Last 12 months"}
            </Badge>
          </div>
          <CardDescription>Detailed analysis of your earnings and growth patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueTrendsChart isLoading={isLoading} timeRange={timeRange} />
        </CardContent>
      </Card>

      {/* Two-column layout for other analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Client Demographics</CardTitle>
            <CardDescription>Breakdown of your client base by location and business type</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientDemographicsChart isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Engagement Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Funnel</CardTitle>
            <CardDescription>Conversion journey from views to completed bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementFunnelChart isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Competitor Benchmarking */}
        <Card>
          <CardHeader>
            <CardTitle>Competitor Benchmarking</CardTitle>
            <CardDescription>How your metrics compare to platform averages</CardDescription>
          </CardHeader>
          <CardContent>
            <CompetitorBenchmarkChart isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Repeat Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Repeat Customer Metrics</CardTitle>
            <CardDescription>Analysis of returning clients and their value</CardDescription>
          </CardHeader>
          <CardContent>
            <RepeatCustomerChart isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Full-width sections */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Engagement Analysis</CardTitle>
          <CardDescription>Detailed performance metrics for each portfolio item</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioEngagementChart isLoading={isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Management & Scheduling Insights</CardTitle>
          <CardDescription>Optimize your schedule based on booking patterns and time spent</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeManagementChart isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
