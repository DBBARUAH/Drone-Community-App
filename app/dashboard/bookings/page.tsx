'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "lucide-react"

export default function BookingsPage() {
  const [userRole, setUserRole] = useState<"client" | "photographer">("client")
  
  // In a real app, you would fetch the user role from your auth system
  // This is a placeholder implementation
  useEffect(() => {
    // Simulate fetching user data
    // Replace with actual user data fetch
    const fetchUserRole = async () => {
      // Mock implementation - in reality, fetch from your API
      const role = localStorage.getItem('userRole') || 'client'
      setUserRole(role as "client" | "photographer")
    }
    
    fetchUserRole()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
          {userRole === "photographer" && (
            <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                {userRole === "client" 
                  ? "Your scheduled drone photography sessions" 
                  : "Your upcoming drone photography assignments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
              <CardDescription>
                {userRole === "client" 
                  ? "Your completed drone photography sessions" 
                  : "Your completed drone photography assignments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings />
            </CardContent>
          </Card>
        </TabsContent>
        
        {userRole === "photographer" && (
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>
                  New booking requests that need your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentBookings />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 