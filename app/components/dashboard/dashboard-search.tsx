"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  FileText,
  User,
  Calendar,
  Camera,
  MapPin,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Loader2,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DialogTitle } from "@/components/ui/dialog"

// Define search result types
type SearchResultType =
  | "profile"
  | "booking"
  | "portfolio"
  | "location"
  | "document"
  | "message"
  | "settings"
  | "dashboard"

interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  url: string
}

// Search categories with their respective icons
const searchTypeIcons: Record<SearchResultType, React.ReactNode> = {
  profile: <User className="h-4 w-4" />,
  booking: <Calendar className="h-4 w-4" />,
  portfolio: <Camera className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  dashboard: <LayoutDashboard className="h-4 w-4" />,
}

// Mock data for development
const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    type: "profile",
    title: "Your Profile",
    subtitle: "Edit your personal information",
    url: "/dashboard/profile",
  },
  {
    id: "2",
    type: "booking",
    title: "Upcoming Shoots",
    subtitle: "Calendar and scheduling",
    url: "/dashboard/bookings",
  },
  {
    id: "3",
    type: "portfolio",
    title: "Portfolio Builder",
    subtitle: "Showcase your work",
    url: "/dashboard/portfolio/create",
  },
  {
    id: "4",
    type: "location",
    title: "Favorite Locations",
    subtitle: "Saved shooting locations",
    url: "/dashboard/locations",
  },
  {
    id: "5",
    type: "document",
    title: "Contracts & Documents",
    subtitle: "Manage your paperwork",
    url: "/dashboard/documents",
  },
  {
    id: "6",
    type: "message",
    title: "Messages",
    subtitle: "Chat with clients and photographers",
    url: "/dashboard/messages",
  },
  {
    id: "7",
    type: "settings",
    title: "Account Settings",
    subtitle: "Manage your account",
    url: "/dashboard/settings",
  },
  {
    id: "8",
    type: "dashboard",
    title: "Dashboard Overview",
    subtitle: "Main dashboard view",
    url: "/dashboard",
  },
]

interface DashboardSearchProps {
  onSelect?: () => void
  isMobile?: boolean
}

export function DashboardSearch({ onSelect, isMobile = false }: DashboardSearchProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Keyboard shortcut to open search (only on desktop)
  React.useEffect(() => {
    if (isMobile) return

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isMobile])

  // Perform search with debounce
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const delayDebounceFn = setTimeout(() => {
      setIsLoading(true)

      // Use mock data (this can be replaced with API call later)
      const filteredResults = MOCK_RESULTS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())),
      )

      setResults(filteredResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  // Group results by type
  const groupedResults = React.useMemo(() => {
    const grouped: Record<SearchResultType, SearchResult[]> = {
      profile: [],
      booking: [],
      portfolio: [],
      location: [],
      document: [],
      message: [],
      settings: [],
      dashboard: [],
    }

    results.forEach((result) => {
      grouped[result.type].push(result)
    })

    return Object.entries(grouped).filter(([_, items]) => items.length > 0)
  }, [results])

  const handleSelect = (url: string) => {
    router.push(url)
    setOpen(false)
    if (onSelect) onSelect()
  }

  // For mobile view, render just the search input
  if (isMobile) {
    return (
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dashboard..."
            className="pl-9 w-full"
          />
        </div>

        {query.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border rounded-md shadow-md max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Searching...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
            ) : (
              <div className="p-2">
                {groupedResults.map(([type, items]) => (
                  <div key={type} className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent"
                        onClick={() => handleSelect(item.url)}
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted mr-2">
                          {searchTypeIcons[item.type]}
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span>{item.title}</span>
                          {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {item.type}
                        </Badge>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Desktop view with command dialog
  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">
          <Search className="mr-2 h-4 w-4" />
          Search dashboard...
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
      >
        <DialogTitle className="sr-only">
          Search Dashboard
        </DialogTitle>
        <CommandInput 
          placeholder="Search dashboard..." 
          value={query} 
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>

          {groupedResults.map(([type, items]) => (
            <CommandGroup key={type} heading={type.charAt(0).toUpperCase() + type.slice(1)}>
              {items.map((item) => (
                <CommandItem 
                  key={item.id} 
                  onSelect={() => handleSelect(item.url)} 
                  className="flex items-center py-2"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted mr-2">
                    {searchTypeIcons[item.type]}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span>{item.title}</span>
                    {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {item.type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

