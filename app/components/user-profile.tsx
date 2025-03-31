"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"

export function UserProfile() {
  const router = useRouter()
  const { user, isLoading, isClient, isPhotographer } = useAuth()
  
  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>
  
  if (!user) {
    router.push('/signin')
    return null
  }

  // Determine role text
  const roleText = isPhotographer ? 'Photographer' : 'Client'

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.picture || ''} alt={user.name || 'User'} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Account Type</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {roleText}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <div className="space-y-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your email and app notification settings
                </p>
              </div>
              {/* Add notification toggles here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button>
          <a href="/api/auth/logout">Sign Out</a>
        </Button>
      </CardFooter>
    </Card>
  )
} 