"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Play, Pause, ExternalLink, MapPin, User, Shuffle, Filter, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

// Define the types for our gallery items
export interface GalleryItemType {
  id: string
  title: string
  photographer: string
  location: string
  category: string
  media: {
    type: "image" | "video"
    src: string
    thumbnail?: string
  }
  featured?: boolean
  size?: "small" | "medium" | "large"
}

// Sample gallery data with varying sizes
const galleryItems: GalleryItemType[] = [
  {
    id: "2",
    title: "Downtown Austin Skyline",
    photographer: "Sarah Williams",
    location: "Austin, TX",
    category: "Urban",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?q=80&w=1769&auto=format&fit=crop",
    },
    size: "medium",
  },
  {
    id: "3",
    title: "South Padre Island Coastline",
    photographer: "David Chen",
    location: "South Padre Island, TX",
    category: "Landscapes",
    media: {
      type: "video",
      src: "/videos/card1_beachshot.mp4",
      thumbnail: "/thumbnails/card1_beachshot.jpg",
    },
    featured: true,
    size: "medium",
  },
  {
    id: "4",
    title: "Malibu Beachfront Estate",
    photographer: "Emily Davis",
    location: "Malibu, CA",
    category: "Real Estate",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1770&auto=format&fit=crop",
    },
    size: "small",
  },
  {
    id: "5",
    title: "Mozart Coffee Lakeside Austin",
    photographer: "Michael Brown",
    location: "Austin, TX",
    category: "Events",
    media: {
      type: "video",
      src: "/videos/client2_mozarts.mp4",
      thumbnail: "/thumbnails/client2_mozarts.jpg",
    },
    featured: true,
    size: "medium",
  },
  {
    id: "8",
    title: "Beverly Hills Mansion",
    photographer: "Thomas Moore",
    location: "Beverly Hills, CA",
    category: "Real Estate",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=1770&auto=format&fit=crop",
    },
    featured: true,
    size: "medium",
  },
  {
    id: "9",
    title: "Longhorn Stadium Game Day",
    photographer: "Olivia Garcia",
    location: "Austin, TX",
    category: "Events",
    media: {
      type: "video",
      src: "/videos/client1_UT_stadium.mp4",
      thumbnail: "/thumbnails/client1_UT_stadium.jpg",
    },
    featured: true,
    size: "large",
  },
  {
    id: "12",
    title: "TEN Automotive Event",
    photographer: "Daniel Taylor",
    location: "Austin, TX",
    category: "Events",
    media: {
      type: "video",
      src: "/videos/client3_TEN.mp4",
      thumbnail: "/thumbnails/client3_TEN.jpg",
    },
    size: "medium",
  },
  {
    id: "14",
    title: "Austin Night Skyline",
    photographer: "Ahmed Hassan",
    location: "Austin, TX",
    category: "Urban",
    media: {
      type: "video",
      src: "/videos/14-5-24.mp4",
      thumbnail: "/thumbnails/14-5-24.jpg",
    },
    featured: true,
    size: "large",
  },
  {
    id: "15",
    title: "Hollywood Hills Mansion",
    photographer: "Carlos Rodriguez",
    location: "Los Angeles, CA",
    category: "Real Estate",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1775&auto=format&fit=crop",
    },
    size: "medium",
  },
  {
    id: "16",
    title: "Austin City Promotion",
    photographer: "Zoe Thompson",
    location: "Austin, TX",
    category: "Urban",
    media: {
      type: "video",
      src: "/videos/card2_austin.mp4",
      thumbnail: "/thumbnails/card2_austin.jpg",
    },
    size: "medium",
  },
  {
    id: "18",
    title: "Austin Downtown Survey",
    photographer: "Leila Wong",
    location: "Austin, TX",
    category: "Urban",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?q=80&w=1770&auto=format&fit=crop",
    },
    featured: true,
    size: "medium",
  },
  {
    id: "19",
    title: "Quebec City Vista",
    photographer: "Jean Tremblay",
    location: "Quebec City, Canada",
    category: "Landscapes",
    media: {
      type: "video",
      src: "/videos/card3_quebec.mp4",
      thumbnail: "/thumbnails/card3_quebec.jpg",
    },
    size: "medium",
  }
]

// Available categories for filtering
const categories = ["Featured", "Landscapes", "Real Estate", "Events", "Urban", "Mapping"]

export function PremiumAerialGallery() {
  const [selectedCategory, setSelectedCategory] = useState("Featured")
  const [filteredItems, setFilteredItems] = useState(() => 
    galleryItems.filter(item => item.featured || item.category === "Landscapes").slice(0, 6)
  )
  const [visibleItems, setVisibleItems] = useState(6) // Reduced from 8 to 6
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Mark component as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])
  
  // Replace with simple state for background transforms
  const [bgTransform, setBgTransform] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 })

  // Effect for mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5
      setMousePosition({ x, y })
      
      // Update background transform values directly
      setBgTransform({
        x1: x * -30,
        y1: y * -30,
        x2: x * 40,
        y2: y * 40
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Filter items when category changes
  useEffect(() => {
    setIsLoading(true)
    
    // Use setTimeout to prevent UI freeze during filtering
    setTimeout(() => {
      if (selectedCategory === "Featured") {
        setFilteredItems(galleryItems.filter(item => item.featured || item.category === "Landscapes").slice(0, 6));
      } else {
        setFilteredItems(galleryItems.filter((item) => item.category === selectedCategory));
      }
      setVisibleItems(6) // Reset to show fewer items initially
      setActiveItem(null)
      setIsLoading(false)
    }, 10);
  }, [selectedCategory])

  // Shuffle items
  const shuffleItems = () => {
    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5)
    setFilteredItems(shuffled)
    setActiveItem(null)
  }

  // Load more items with smoother transition
  const loadMore = () => {
    setIsLoading(true)
    // Delayed loading to keep UI responsive
    setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 3, filteredItems.length))
      setIsLoading(false)
    }, 100)
  }

  // Use a consistent theme for server rendering to avoid hydration mismatch
  // Only use actual theme after component has mounted client-side
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative py-24 md:py-32 overflow-hidden transition-colors duration-500",
        isDark ? "bg-black text-white" : "bg-gradient-to-b from-gray-100 to-white text-gray-900",
      )}
    >
      {/* Parallax background */}
      <motion.div
        className={cn("absolute inset-0 w-full h-full", isDark ? "opacity-30" : "opacity-15")}
        style={{
          y,
          backgroundImage: 'url("/placeholder.svg?height=1200&width=1920")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay gradient */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          isDark
            ? "bg-gradient-to-b from-black/80 via-black/60 to-black/90"
            : "bg-gradient-to-b from-white/90 via-white/70 to-gray-100/80",
        )}
      />

      {/* Interactive background elements */}
      <div
        className={cn(
          "absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px]",
          isDark ? "bg-gold/20" : "bg-gold/15",
        )}
        style={{
          transform: `translate3d(${bgTransform.x1}px, ${bgTransform.y1}px, 0px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      <div
        className={cn(
          "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px]",
          isDark ? "bg-gold-dark/20" : "bg-gold-dark/15",
        )}
        style={{
          transform: `translate3d(${bgTransform.x2}px, ${bgTransform.y2}px, 0px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      <div className="container relative z-10">
        {/* Section header with parallax effect */}
        <motion.div className="max-w-4xl mx-auto text-center mb-16 md:mb-24" style={{ opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-4">
              <div
                className={cn(
                  "flex items-center justify-center space-x-1 px-3 py-1 rounded-full backdrop-blur-sm",
                  isDark 
                    ? "bg-gold/10 border border-gold/20" 
                    : "bg-gold/40 border border-gold/60 shadow-sm"
                )}
              >
                <span className={cn(
                  "block rounded-full bg-gold animate-pulse",
                  isDark ? "w-2 h-2" : "w-2.5 h-2.5"
                )} />
                <span className={cn(
                  "text-sm font-medium", 
                  isDark 
                    ? "text-gold" 
                    : "text-black font-bold"
                )}>
                  Community Showcase
                </span>
              </div>
            </div>

            <h2
              className={cn(
                "text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              <span className="block">Inspiring</span>
              <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">Aerial Art</span>
            </h2>

            <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-white/70" : "text-gray-700")}>
              Explore breathtaking drone photography and videography from our talented community of creators
            </p>
          </motion.div>
        </motion.div>

        {/* Filter controls with animated reveal */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Mobile filter button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline"
                className={cn(
                  "border-gold/40 backdrop-blur-md hover:bg-gold/20",
                  isDark ? "bg-black/50 text-white" : "bg-white/80 text-black font-medium shadow-sm",
                )}
                disabled={isLoading}
              >
                <Filter className={cn("h-4 w-4 mr-2", isDark ? "text-gold" : "text-gold-dark")} />
                {selectedCategory}
              </Button>
              
              {isFilterOpen && (
                <div
                  className={cn(
                    "absolute top-full left-0 right-0 mt-2 p-4 backdrop-blur-md rounded-xl border border-gold/20 z-50",
                    isDark ? "bg-black/90" : "bg-white/95 shadow-lg",
                  )}
                  style={{
                    opacity: 1, 
                    transform: 'translateY(0)', 
                    transition: 'opacity 0.2s ease, transform 0.2s ease'
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={cn("text-sm font-medium", isDark ? "text-gold" : "text-black")}>Categories</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7",
                        isDark ? "text-white/70 hover:text-white" : "text-gray-900 hover:text-black",
                      )}
                      onClick={() => setIsFilterOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsFilterOpen(false)
                        }}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "justify-start rounded-lg",
                          selectedCategory === category
                            ? "bg-gold/30 text-black hover:bg-gold/40"
                            : isDark
                              ? "hover:bg-white/10 text-white/70"
                              : "hover:bg-gray-200 text-black/80",
                        )}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop filter pills */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => !isLoading && setSelectedCategory(category)}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    selectedCategory === category
                      ? isDark
                        ? "text-black"
                        : "text-black"
                      : isDark
                        ? "text-white/70 hover:text-white"
                        : "text-black hover:text-black",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="categoryPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-gold-dark"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </motion.button>
              ))}
            </div>

            {/* Shuffle button */}
            <Button
              onClick={shuffleItems}
              variant="outline"
              size="icon"
              disabled={isLoading}
              className={cn(
                "rounded-full border-gold/40 backdrop-blur-md hover:bg-gold/20",
                isDark ? "bg-black/50 text-white" : "bg-white/80 text-black shadow-sm",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              <Shuffle className={cn("h-4 w-4", isDark ? "text-gold" : "text-gold-dark")} />
            </Button>
          </div>
        </motion.div>

        {/* Dynamic masonry gallery */}
        <div ref={galleryRef} className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
            </div>
          )}
          
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 relative"
            style={{
              opacity: 1,
              transition: 'opacity 0.8s ease',
            }}
          >
            {filteredItems.slice(0, visibleItems).map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onActivate={() => setActiveItem(item.id === activeItem ? null : item.id)}
                mousePosition={mousePosition}
                isDark={isDark}
              />
            ))}
          </div>

          {/* Load more button */}
          {visibleItems < filteredItems.length && (
            <div
              className="flex justify-center mt-12"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <Button
                onClick={loadMore}
                variant="outline"
                disabled={isLoading}
                className={cn(
                  "group border-gold/40 backdrop-blur-md hover:bg-gold/20",
                  isDark ? "bg-black/50 text-white" : "bg-white/80 text-black font-medium shadow-sm",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <Plus className={cn("mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300", isDark ? "text-gold" : "text-gold-dark")} />
                <span>Load More</span>
              </Button>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <Button className="relative overflow-hidden group w-full sm:w-auto">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold to-gold-dark opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-black font-medium">Browse More Aerial Art</span>
          </Button>

          <Button
            variant="outline"
            className={cn(
              "border-gold/40 backdrop-blur-md hover:bg-gold/20 w-full sm:w-auto",
              isDark ? "bg-black/50 text-white" : "bg-white/80 text-black font-medium shadow-sm",
            )}
          >
            Submit Your Work
          </Button>
        </div>
      </div>
    </section>
  )
}

interface GalleryCardProps {
  item: GalleryItemType
  isActive: boolean
  onActivate: () => void
  mousePosition: { x: number; y: number }
  isDark: boolean
}

function GalleryCard({ item, isActive, onActivate, mousePosition, isDark }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Pure CSS approach for 3D rotation
  const [cardTransform, setCardTransform] = useState({ 
    rotateX: 0, 
    rotateY: 0,
    scale: 1
  })
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const percentX = (e.clientX - centerX) / (rect.width / 2)
      const percentY = (e.clientY - centerY) / (rect.height / 2)

      setCardTransform({ 
        rotateX: -percentY * 10, // Inverted for natural feel
        rotateY: percentX * 10,
        scale: 1.02
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isHovered])

  // Reset rotation when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCardTransform({ rotateX: 0, rotateY: 0, scale: 1 })
    }
  }, [isHovered])

  // Load videos on mount
  useEffect(() => {
    if (item.media.type === "video" && videoRef.current && !isVideoLoaded) {
      videoRef.current.src = item.media.src
      videoRef.current.load()
      videoRef.current.muted = true
      setIsVideoLoaded(true)
    }
  }, [item.media.type, item.media.src, isVideoLoaded])

  // Play/pause video on hover
  useEffect(() => {
    if (item.media.type === "video" && videoRef.current && isVideoLoaded) {
      if (isHovered && !isVideoPlaying) {
        videoRef.current.play()
          .then(() => setIsVideoPlaying(true))
          .catch(error => console.error("Video play failed:", error));
      } else if (!isHovered && isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      }
    }
  }, [isHovered, isVideoLoaded, isVideoPlaying, item.media.type]);

  // Manual play/pause with button click
  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (videoRef.current && isVideoLoaded) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play()
          .then(() => setIsVideoPlaying(true))
          .catch(error => console.error("Video play failed:", error));
      }
    }
  }

  // Determine grid span based on item size
  const getGridSpan = () => {
    if (item.size === "large") {
      return "sm:col-span-2 sm:row-span-2"
    } else if (item.size === "medium") {
      return "sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1"
    }
    return ""
  }

  // Determine aspect ratio based on item size
  const getAspectRatio = () => {
    if (item.size === "large") {
      return "aspect-[4/3] sm:aspect-[16/9]"
    } else if (item.size === "medium") {
      return "aspect-square"
    }
    return "aspect-[3/4]"
  }

  return (
    <div
      ref={cardRef}
      className={cn("group relative overflow-hidden rounded-xl", getGridSpan(), isActive ? "z-20" : "z-10")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onActivate}
      style={{
        opacity: 1,
        transform: 'scale(1)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Card with 3D effect */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl",
          getAspectRatio(),
          isDark ? "border border-white/10" : "border border-gray-200 shadow-md",
          "shadow-lg",
          isActive ? "shadow-2xl" : "",
        )}
        style={{
          transform: `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale(${cardTransform.scale})`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Media container */}
        <div className="absolute inset-0 w-full h-full">
          {item.media.type === "video" ? (
            <>
              {/* Show thumbnail when video is not playing */}
              {!isVideoPlaying && (
                <Image
                  src={item.media.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              {/* Video element is always present but becomes visible only when playing */}
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover",
                  isVideoPlaying ? "z-20" : "z-0"
                )}
                playsInline
                loop
                muted
                onEnded={() => setIsVideoPlaying(false)}
              />
              {/* Play button overlay - always visible for videos */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center z-40",
                  isDark ? "bg-black/30" : "bg-black/30",
                  isHovered || isActive ? "bg-black/40" : "bg-black/10", // Background changes on hover but button remains visible
                )}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-gold/20 backdrop-blur-sm hover:bg-gold/40 shadow-sm border-white/10"
                  onClick={handlePlayVideo}
                >
                  {isVideoPlaying ? <Pause className="h-4 w-4 text-white/80" /> : <Play className="h-4 w-4 text-white/80" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Image
                src={item.media.src || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
                  isHovered || isActive ? "opacity-100" : "opacity-70",
                )}
              />
            </>
          )}
        </div>

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge className="bg-gradient-to-r from-gold to-gold-dark text-black font-medium px-3 py-1 shadow-md">
                Featured
              </Badge>
            </motion.div>
          </div>
        )}

        {/* External link button */}
        <motion.div
          className={cn(
            "absolute top-3 right-3 z-20 transition-opacity duration-300",
            isHovered || isActive ? "opacity-100" : "opacity-0",
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              window.open(item.media.src, "_blank")
            }}
          >
            <ExternalLink className="h-4 w-4 text-white" />
          </Button>
        </motion.div>

        {/* Content overlay */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 z-20 transition-all duration-500",
            isHovered || isActive ? "translate-y-0" : "translate-y-4 opacity-80",
          )}
        >
          <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{item.title}</h3>

          <div
            className={cn(
              "flex flex-col gap-2 transition-all duration-500",
              isHovered || isActive ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex items-center text-white/90 text-sm">
              <User className="h-3 w-3 mr-1" />
              <span>{item.photographer}</span>
            </div>

            <div className="flex items-center text-white/90 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{item.location}</span>
            </div>

            <Badge variant="outline" className="w-fit bg-black/30 text-gold border-gold/20 backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-300",
            "bg-gradient-to-tr from-gold/0 via-gold/0 to-gold/20",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* Expanded state overlay */}
      {isActive && (
        <div
          className={cn("fixed inset-0 backdrop-blur-sm z-[-1]", isDark ? "bg-black/80" : "bg-white/80")}
          style={{
            opacity: 1,
            transition: 'opacity 0.3s ease',
          }}
          onClick={onActivate}
        />
      )}
    </div>
  )
}

