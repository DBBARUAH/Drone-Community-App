"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image, Edit, PlusCircle, Upload, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { OnboardingProgress } from "@/components/dashboard/onboarding-progress"
import RequirePhotographer from "@/components/auth/require-photographer"

export default function PortfolioPage() {
  return (
    <RequirePhotographer>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading portfolio...</span>
        </div>
      }>
        <PortfolioContent />
      </Suspense>
    </RequirePhotographer>
  )
}

function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false)
  const [hasPortfolioItems, setHasPortfolioItems] = useState(false)

  // Onboarding steps for photographers (copied from photographer-dashboard.tsx)
  const photographerSteps = [
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add your bio, equipment details, and specialties to attract clients.",
      completed: true,
    },
    {
      id: "portfolio",
      title: "Upload portfolio items",
      description: "Showcase your best drone photography and videography work.",
      completed: false,
    },
    {
      id: "services",
      title: "Set up your services",
      description: "Define your service offerings, pricing, and availability.",
      completed: false,
    },
    {
      id: "verification",
      title: "Complete verification",
      description: "Verify your identity and drone pilot credentials.",
      completed: false,
    },
  ]

  // Sample portfolio data (this would come from an API in a real app)
  const portfolioItems = [
    {
      id: "1",
      title: "Coastal Drone Photography",
      description: "Aerial views of the California coastline",
      imageUrl: "/placeholder.svg?height=200&width=400",
      views: 124,
      category: "landscapes",
    },
    {
      id: "2",
      title: "Real Estate Package",
      description: "Luxury property showcase with aerial views",
      imageUrl: "/placeholder.svg?height=200&width=400",
      views: 85,
      category: "real-estate",
    },
  ]

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, we would check if the user has completed their profile setup
      setHasCompleteProfile(false) // Setting to false to show the onboarding card
      // In a real app, we would check if the user has portfolio items
      setHasPortfolioItems(portfolioItems.length > 0)
    }, 500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">
            Showcase your drone photography and videography work to potential clients.
          </p>
        </div>
        {hasCompleteProfile && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button asChild size="sm" className="flex items-center gap-1">
              <Link href="/dashboard/portfolio/create">
                <PlusCircle className="h-4 w-4" />
                Create New
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Show onboarding card if profile is not complete */}
      {!hasCompleteProfile && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
          <CardHeader>
            <CardTitle>Complete Your Portfolio Setup</CardTitle>
            <CardDescription>
              You're now part of our community of drone photographers and videographers. Let's set up your profile to
              attract clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingProgress steps={photographerSteps} userType="photographer" />
          </CardContent>
        </Card>
      )}

      {/* Only show portfolio content if profile is complete */}
      {hasCompleteProfile && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="landscapes">Landscapes</TabsTrigger>
            <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-10">
                  <div className="flex justify-center">
                    <div className="animate-pulse h-5 w-36 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ) : hasPortfolioItems ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfolioItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <CardDescription>{item.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">{item.views} views</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Portfolio Items Yet</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Start building your portfolio by uploading your best drone photography work.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/portfolio/create">Upload Your First Item</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Other tabs with portfolio categories - only shown if profile is complete */}
          <TabsContent value="landscapes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolioItems
                .filter(item => item.category === "landscapes")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <CardDescription>{item.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">{item.views} views</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="real-estate" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolioItems
                .filter(item => item.category === "real-estate")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <CardDescription>{item.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">{item.views} views</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardContent className="py-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Event Photography Yet</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Add event photography to your portfolio to showcase your skills in this category.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/portfolio/create">Add Event Photography</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 