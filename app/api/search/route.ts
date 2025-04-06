import { NextRequest, NextResponse } from "next/server"

// Search result type definition
type SearchResultType = "profile" | "booking" | "portfolio" | "location" | "document"

interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  url: string
}

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL params
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    
    if (!query) {
      return NextResponse.json(
        { results: [] },
        { status: 200 }
      )
    }

    // NOTE: In a real application, you would search your database here
    // This is just a mock implementation for demonstration purposes
    
    // Simple mock data for demonstration
    const allResults: SearchResult[] = [
      {
        id: "1",
        type: "profile",
        title: "Your Profile",
        subtitle: "Edit your personal information",
        url: "/dashboard/profile"
      },
      {
        id: "2",
        type: "booking",
        title: "Upcoming Shoots",
        subtitle: "Calendar and scheduling",
        url: "/dashboard/bookings"
      },
      {
        id: "3",
        type: "booking",
        title: "Past Bookings",
        subtitle: "View your booking history",
        url: "/dashboard/bookings/history"
      },
      {
        id: "4",
        type: "portfolio",
        title: "Portfolio Builder",
        subtitle: "Showcase your work",
        url: "/dashboard/portfolio"
      },
      {
        id: "5",
        type: "portfolio",
        title: "Create New Portfolio",
        subtitle: "Start a new portfolio project",
        url: "/dashboard/portfolio/new"
      },
      {
        id: "6",
        type: "location",
        title: "Favorite Locations",
        subtitle: "Saved shooting locations",
        url: "/dashboard/locations"
      },
      {
        id: "7",
        type: "location",
        title: "Discover Locations",
        subtitle: "Find new shooting spots",
        url: "/dashboard/locations/discover"
      },
      {
        id: "8",
        type: "document",
        title: "Contracts & Documents",
        subtitle: "Manage your paperwork",
        url: "/dashboard/documents"
      },
      {
        id: "9",
        type: "document",
        title: "Contract Templates",
        subtitle: "Standard legal documents",
        url: "/dashboard/documents/templates"
      }
    ]
    
    // Filter results based on query
    const results = allResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) || 
      (result.subtitle && result.subtitle.toLowerCase().includes(query.toLowerCase()))
    )
    
    // Limit results to 5 items
    const limitedResults = results.slice(0, 5)
    
    return NextResponse.json({ results: limitedResults }, { status: 200 })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 