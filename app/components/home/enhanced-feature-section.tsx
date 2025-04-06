"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Feature {
  id: string
  title: string
  description: string
  media: {
    type: "image" | "video"
    src: string
    thumbnail?: string
    alt?: string
  }
  badge?: string
  cta?: {
    text: string
    href: string
  }
}

interface EnhancedFeatureSectionProps {
  title: string
  subtitle?: string
  features: Feature[]
  className?: string
  autoPlayInterval?: number
  darkMode?: boolean
}

export function EnhancedFeatureSection({
  title,
  subtitle,
  features,
  className,
  autoPlayInterval = 5000,
  darkMode = false,
}: EnhancedFeatureSectionProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  // Auto-advance features when playing
  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setActiveFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval, isPlaying])

  // Reset progress when changing features manually
  useEffect(() => {
    setProgress(0)
  }, [activeFeature])

  // Pause autoplay when section is not in view
  useEffect(() => {
    if (!isInView) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-20 overflow-hidden",
        darkMode ? "bg-slate-900 text-white" : "bg-background text-foreground",
        className,
      )}
    >
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[70%] bg-primary/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[70%] bg-primary/20 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-medium border-primary/30 bg-primary/5">
              {subtitle || "Discover Our Features"}
            </Badge>
            <h2 className="section-header no-after">{title}</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Feature navigation */}
          <motion.div
            className="lg:col-span-5 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={cn(
                    "cursor-pointer rounded-xl p-5 transition-all duration-300",
                    index === activeFeature ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                  onClick={() => {
                    setActiveFeature(index)
                    setProgress(0)
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors",
                        index === activeFeature
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "text-lg sm:text-xl font-semibold transition-colors",
                            index === activeFeature ? "text-primary" : "",
                          )}
                        >
                          {feature.title}
                        </h3>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="feature-description">{feature.description}</p>
                      {feature.cta && (
                        <Button variant="link" className="p-0 h-auto text-primary" asChild>
                          <a href={feature.cta.href}>
                            {feature.cta.text}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for active feature */}
                  {index === activeFeature && (
                    <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm text-muted-foreground">{isPlaying ? "Auto-advancing" : "Paused"}</span>
              </div>

              <div className="flex items-center gap-1">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === activeFeature ? "bg-primary w-4" : "bg-muted hover:bg-primary/50",
                    )}
                    onClick={() => {
                      setActiveFeature(index)
                      setProgress(0)
                    }}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature media display */}
          <motion.div
            className="lg:col-span-7 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-muted">
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === activeFeature && (
                      <motion.div
                        key={feature.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {feature.media.type === "video" ? (
                          <div className="relative w-full h-full">
                            {/* Video with thumbnail as fallback */}
                            {feature.media.thumbnail && (
                              <Image
                                src={feature.media.thumbnail}
                                alt={feature.media.alt || feature.title}
                                fill
                                className="object-cover absolute inset-0 z-10"
                              />
                            )}
                            <video
                              src={feature.media.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover absolute inset-0 z-20"
                              onPlay={(e) => {
                                // When video plays, ensure it's visible above the thumbnail
                                e.currentTarget.style.zIndex = "20";
                              }}
                              onLoadedData={(e) => {
                                // When video is loaded, make it visible
                                e.currentTarget.style.zIndex = "20";
                              }}
                            />
                            {/* Play button overlay - ensuring top z-index */}
                            <div className="absolute inset-0 flex items-center justify-center z-40">
                              <motion.div 
                                initial={{ opacity: 0.7, scale: 0.9 }}
                                animate={{ opacity: 0.8, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="bg-black/20 rounded-full p-2 backdrop-blur-sm border border-white/20 shadow-sm"
                              >
                                <Play className="h-5 w-5 text-white/70" />
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={feature.media.src || "/placeholder.svg"}
                            alt={feature.media.alt || feature.title}
                            fill
                            className="object-cover"
                          />
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Feature title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white text-2xl font-bold mb-2">{feature.title}</h3>
                          {feature.cta && (
                            <Button variant="secondary" size="sm" asChild>
                              <a href={feature.cta.href}>
                                {feature.cta.text}
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

