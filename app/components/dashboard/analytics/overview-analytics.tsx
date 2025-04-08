"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, Users, Eye, Calendar, DollarSign, AlertTriangle, Lock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { AnalyticsCard } from "@/components/dashboard/analytics/analytics-card"
import { VisitorChart } from "@/components/dashboard/analytics/visitor-chart"
import { BookingChart } from "@/components/dashboard/analytics/booking-chart"
import { GeographicMap } from "@/components/dashboard/analytics/geographic-map"
import { UpgradePrompt } from "@/components/dashboard/analytics/upgrade-prompt"
import { AnalyticsTip } from "@/components/dashboard/analytics/analytics-tip"

interface OverviewAnalyticsProps {
  isPremium?: boolean
  isProfileComplete?: boolean
  isPortfolioComplete?: boolean
}

export function OverviewAnalytics({
  isPremium = false,
  isProfileComplete = false,
  isPortfolioComplete = false,
}: OverviewAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showTips, setShowTips] = useState(true)

  // Mock data for analytics
  const analyticsData = {
    profileViews: 243,
    uniqueVisitors: 187,
    totalBookings: 8,
    conversionRate: 4.3,
    revenue: 2450,
    responseTime: 2.4, // hours
    messagesExchanged: 56,
    newLeads: 12,
    portfolioClicks: 178,
    topLocations: [
      { city: "Austin", state: "TX", count: 45 },
      { city: "Houston", state: "TX", count: 32 },
      { city: "Dallas", state: "TX", count: 28 },
      { city: "San Antonio", state: "TX", count: 19 },
    ],
  }

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Determine if we should show the profile completion alert
  const showProfileAlert = !isProfileComplete || !isPortfolioComplete

  return (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      {showProfileAlert && (
        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Complete your profile to unlock insights
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            {!isProfileComplete && !isPortfolioComplete ? (
              <>
                Your profile and portfolio are incomplete. Complete them to get more accurate analytics and attract more
                clients.
                <div className="mt-2">
                  <Button asChild size="sm" variant="outline" className="mr-2 border-amber-300 dark:border-amber-700">
                    <Link href="/dashboard/profile">Complete Profile</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-amber-300 dark:border-amber-700">
                    <Link href="/dashboard/portfolio/create">Create Portfolio</Link>
                  </Button>
                </div>
              </>
            ) : !isProfileComplete ? (
              <>
                Your profile is incomplete. Complete it to get more accurate analytics and attract more clients.
                <div className="mt-2">
                  <Button asChild size="sm" variant="outline" className="border-amber-300 dark:border-amber-700">
                    <Link href="/dashboard/profile">Complete Profile</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                Your portfolio is incomplete. Add your best work to attract more clients.
                <div className="mt-2">
                  <Button asChild size="sm" variant="outline" className="border-amber-300 dark:border-amber-700">
                    <Link href="/dashboard/portfolio/create">Create Portfolio</Link>
                  </Button>
                </div>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Top Bar Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Profile Views"
          value={analyticsData.profileViews.toString()}
          description="Last 30 days"
          icon={Eye}
          trend={+15}
          isLoading={isLoading}
        />

        <AnalyticsCard
          title="Unique Visitors"
          value={analyticsData.uniqueVisitors.toString()}
          description="Last 30 days"
          icon={Users}
          trend={+12}
          isLoading={isLoading}
        />

        <AnalyticsCard
          title="Total Bookings"
          value={analyticsData.totalBookings.toString()}
          description="Last 30 days"
          icon={Calendar}
          trend={+3}
          isLoading={isLoading}
        />

        <AnalyticsCard
          title="Revenue"
          value={`$${analyticsData.revenue}`}
          description="Last 30 days"
          icon={DollarSign}
          trend={+22}
          isLoading={isLoading}
          isPremium={!isPremium}
        />
      </div>

      {/* Analytics Tips */}
      {showTips && (
        <AnalyticsTip
          title="Improve your profile visibility"
          description="Adding more portfolio items can increase your profile views by up to 40%."
          onDismiss={() => setShowTips(false)}
        />
      )}

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Visitor & Booking Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Visitor Trends</CardTitle>
                <Badge variant="outline" className="font-normal">
                  Last 30 days
                </Badge>
              </div>
              <CardDescription>Profile views and unique visitors over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <VisitorChart isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Booking Activity</CardTitle>
                <Badge variant="outline" className="font-normal">
                  Last 30 days
                </Badge>
              </div>
              <CardDescription>Bookings and conversion rate over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <BookingChart isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Engagement Stats & Geographic Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Client Engagement</CardTitle>
              <CardDescription>Your interaction metrics with potential clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-16 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-16 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-16 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Response Time</span>
                      <span className="font-medium">{analyticsData.responseTime} hours</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: Under 2 hours</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Messages Exchanged</span>
                      <span className="font-medium">{analyticsData.messagesExchanged}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">New Leads</span>
                      <span className="font-medium">{analyticsData.newLeads}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-muted-foreground">+3 from last week</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Geographic Insights</CardTitle>
              <CardDescription>Where your visitors are located</CardDescription>
            </CardHeader>
            <CardContent>
              <GeographicMap isLoading={isLoading} />

              {!isLoading && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Top Locations</p>
                  <div className="space-y-2">
                    {analyticsData.topLocations.map((location, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {location.city}, {location.state}
                        </span>
                        <span className="text-muted-foreground">{location.count} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {!isPremium && (
                <Button variant="ghost" size="sm" className="w-full" disabled>
                  <Lock className="h-3 w-3 mr-1" />
                  Detailed location data requires premium
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Premium Upgrade Prompt */}
      {!isPremium && (
        <UpgradePrompt
          title="Unlock Premium Analytics"
          description="Get detailed insights, revenue forecasting, and competitor benchmarking with Premium Analytics."
          features={[
            "Detailed revenue breakdown and forecasting",
            "Advanced client demographics and behavior analysis",
            "Engagement funnel and conversion optimization",
            "Competitor benchmarking and market positioning",
          ]}
        />
      )}
    </div>
  )
}
