"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image, FileText, Users, Lightbulb } from "lucide-react"
import { OnboardingProgress } from "@/components/dashboard/onboarding-progress"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { ResourceCard } from "@/components/dashboard/resource-card"

export function PhotographerDashboard() {
  const [hasBookings, setHasBookings] = useState(false)

  // Onboarding steps for photographers
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

  // Quick actions for photographers
  const quickActions = [
    {
      title: "Build Your Portfolio",
      description:
        "Upload and organize your best drone photography and videography work to showcase to potential clients.",
      icon: Image,
      actionText: "Add Portfolio Items",
      actionLink: "/dashboard/portfolio/create",
    },
    {
      title: "Create Service Packages",
      description: "Define your service offerings with clear descriptions, pricing, and deliverables.",
      icon: FileText,
      actionText: "Set Up Services",
      actionLink: "/dashboard/services/create",
    },
    {
      title: "Join the Community",
      description: "Connect with other drone photographers, share tips, and collaborate on projects.",
      icon: Users,
      actionText: "Explore Community",
      actionLink: "/dashboard/community",
    },
  ]

  // Resources for photographers
  const resources = [
    {
      title: "Drone Business Guide",
      description: "Learn how to build and grow your drone photography business successfully.",
      link: "/resources/drone-business-guide",
      linkText: "Read guide",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Pricing Strategies",
      description: "Tips for pricing your drone photography services competitively and profitably.",
      link: "/resources/pricing-strategies",
      linkText: "View strategies",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Editing Techniques",
      description: "Advanced editing techniques to make your aerial footage stand out.",
      link: "/resources/editing-techniques",
      linkText: "Learn techniques",
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
              <CardTitle>Welcome to Travellers Beats Creator Hub!</CardTitle>
              <CardDescription>
                You're now part of our community of drone photographers and videographers. Let's set up your profile to
                attract clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingProgress steps={photographerSteps} userType="photographer" />
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

          {/* Tips for Success */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Tips for Success</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Complete Your Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Profiles with complete information and high-quality portfolio images receive 3x more client inquiries.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Showcase Your Specialties</h4>
                <p className="text-sm text-muted-foreground">
                  Be specific about your areas of expertise (real estate, events, mapping, etc.) to attract the right
                  clients.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Respond Quickly</h4>
                <p className="text-sm text-muted-foreground">
                  Photographers who respond to inquiries within 2 hours are 50% more likely to secure bookings.
                </p>
              </div>
            </CardContent>
          </Card>
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
                  You don't have any bookings yet. Complete your profile to start attracting clients.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

