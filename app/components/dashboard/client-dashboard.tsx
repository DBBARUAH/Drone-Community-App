"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar } from "lucide-react"
import { OnboardingProgress } from "@/components/dashboard/onboarding-progress"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { ResourceCard } from "@/components/dashboard/resource-card"

export function ClientDashboard() {
  const [hasBookings, setHasBookings] = useState(false)

  // Onboarding steps for clients
  const clientSteps = [
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add your details and preferences to help us match you with the right photographers.",
      completed: true,
    },
    {
      id: "browse",
      title: "Browse photographers",
      description: "Explore our community of talented drone photographers and videographers.",
      completed: false,
    },
    {
      id: "save",
      title: "Save favorites",
      description: "Save photographers you like to your favorites for easy access.",
      completed: false,
    },
    {
      id: "book",
      title: "Make your first booking",
      description: "Book a session with a photographer for your project.",
      completed: false,
    },
  ]

  // Quick actions for clients
  const quickActions = [
    {
      title: "Find Photographers",
      description: "Browse our network of professional drone photographers based on location, specialty, and ratings.",
      icon: Search,
      actionText: "Search Now",
      actionLink: "/dashboard/find-photographers",
    },
    {
      title: "Explore Locations",
      description: "Discover popular locations for drone photography and videography in your area.",
      icon: MapPin,
      actionText: "View Locations",
      actionLink: "/dashboard/locations",
    },
    {
      title: "Schedule a Consultation",
      description: "Book a free consultation call to discuss your project needs with an expert.",
      icon: Calendar,
      actionText: "Schedule Call",
      actionLink: "/dashboard/schedule-consultation",
    },
  ]

  // Resources for clients
  const resources = [
    {
      title: "Drone Photography Guide",
      description: "Learn what to expect from a drone photography session and how to prepare.",
      link: "/resources/drone-photography-guide",
      linkText: "Read guide",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Real Estate Aerial Tips",
      description: "Discover how aerial photography can enhance your real estate listings.",
      link: "/resources/real-estate-aerial-tips",
      linkText: "View tips",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Event Coverage Ideas",
      description: "Creative ways to incorporate drone footage into your event coverage.",
      link: "/resources/event-coverage-ideas",
      linkText: "Explore ideas",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="getting-started">
        <TabsList>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          {hasBookings && <TabsTrigger value="bookings">My Bookings</TabsTrigger>}
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle>Welcome to Travellers Beats!</CardTitle>
              <CardDescription>
                Your journey into aerial photography and videography starts here. Let's get you set up to find the
                perfect drone photographer for your needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingProgress steps={clientSteps} userType="client" />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  actionText={action.actionText}
                  actionLink={action.actionLink}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Helpful Resources</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.title}
                  title={resource.title}
                  description={resource.description}
                  link={resource.link}
                  linkText={resource.linkText}
                  imageUrl={resource.imageUrl}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {hasBookings && (
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>Manage your upcoming and past drone photography sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  You don't have any bookings yet. Start by browsing photographers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

