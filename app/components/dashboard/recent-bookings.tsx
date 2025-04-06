'use client'

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@heroui/react"
import { Calendar, CheckCircle, AlertCircle } from "lucide-react"

interface BookingProps {
  userRole?: "client" | "photographer"
  type?: "upcoming" | "past" | "requests"
}

export function RecentBookings({ userRole = "client", type = "upcoming" }: BookingProps) {
  const [bookings, setBookings] = useState([
    {
      id: "1",
      client: "Alex Johnson",
      photographer: "Maria Rodriguez",
      service: "Real Estate Aerial Photography",
      date: "2023-11-28",
      status: "Upcoming",
      amount: "$350.00",
    },
    {
      id: "2",
      client: "Sarah Williams",
      photographer: "David Chen",
      service: "Wedding Venue Aerial Tour",
      date: "2023-11-25",
      status: "Upcoming",
      amount: "$450.00",
    },
    {
      id: "3",
      client: "Michael Brown",
      photographer: "James Wilson",
      service: "Construction Site Progress",
      date: "2023-03-22",
      status: "Completed",
      amount: "$300.00",
    },
    {
      id: "4",
      client: "Emily Davis",
      photographer: "Sophia Garcia",
      service: "Luxury Property Showcase",
      date: "2023-03-18",
      status: "Completed",
      amount: "$550.00",
    },
  ])

  // Filter bookings based on type
  const filteredBookings = bookings.filter(booking => {
    if (type === "upcoming") return booking.status === "Upcoming";
    if (type === "past") return booking.status === "Completed";
    return booking.status === "Pending"; // For requests
  });

  // If no bookings match the filter
  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {type} bookings found.</p>
        {type === "upcoming" && (
          <Button className="mt-4" color="primary" variant="flat">
            {userRole === "client" ? "Find a Photographer" : "Update Availability"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={`/placeholder-user-${booking.id}.jpg`} 
              alt={userRole === "client" ? booking.photographer : booking.client} 
            />
            <AvatarFallback>
              {userRole === "client" 
                ? booking.photographer.split(" ").map(n => n[0]).join("")
                : booking.client.split(" ").map(n => n[0]).join("")
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {userRole === "client" ? booking.photographer : booking.client}
            </p>
            <p className="text-sm text-muted-foreground">{booking.service}</p>
            <div className="flex items-center text-xs text-muted-foreground gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
              <span className="ml-2 flex items-center gap-1">
                {booking.status === "Completed" 
                  ? <CheckCircle className="h-3 w-3 text-green-500" /> 
                  : <AlertCircle className="h-3 w-3 text-amber-500" />
                }
                {booking.status}
              </span>
            </div>
          </div>
          <div className="text-sm text-right">
            <p className="font-medium">{booking.amount}</p>
            <Button size="sm" color="primary" variant="flat" className="mt-2">
              {type === "upcoming" 
                ? "View Details" 
                : type === "past" 
                  ? "View Receipt" 
                  : "Respond"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

