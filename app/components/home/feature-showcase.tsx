"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import { ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Feature {
  id: string
  title: string
  description: string
  media: {
    type: "image" | "video"
    src: string
    alt?: string
  }
  cta?: {
    text: string
    href: string
  }
}

interface FeatureShowcaseProps {
  title: string
  subtitle?: string
  features: Feature[]
  className?: string
  autoPlayInterval?: number
  theme?: "light" | "dark" | "primary"
}

export function FeatureShowcase({
  title,
  subtitle,
  features,
  className,
  autoPlayInterval = 5000,
  theme = "light",
}: FeatureShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  // Auto-advance features
  useEffect(() => {
    if (!isInView) return

    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setActiveFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval, isInView])

  // Reset progress when changing features manually
  useEffect(() => {
    setProgress(0)
  }, [activeFeature])

  // Theme-based styling
  const themeStyles = {
    light: {
      bg: "bg-background",
      text: "text-foreground",
      accent: "bg-primary text-primary-foreground",
      muted: "text-muted-foreground",
      card: "bg-card hover:bg-card/80",
      border: "border-border",
      highlight: "bg-primary/10",
    },
    dark: {
      bg: "bg-slate-950",
      text: "text-slate-50",
      accent: "bg-primary text-primary-foreground",
      muted: "text-slate-400",
      card: "bg-slate-900 hover:bg-slate-900/90",
      border: "border-slate-800",
      highlight: "bg-primary/20",
    },
    primary: {
      bg: "bg-primary/5",
      text: "text-foreground",
      accent: "bg-primary text-primary-foreground",
      muted: "text-muted-foreground",
      card: "bg-background hover:bg-background/90",
      border: "border-primary/20",
      highlight: "bg-primary/10",
    },
  }

  const currentTheme = themeStyles[theme]

  return (
    <section ref={sectionRef} className={cn("py-16 md:py-24", currentTheme.bg, className)}>
      <div className="container px-4 mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {subtitle && (
            <p className={cn("text-sm font-medium uppercase tracking-wider mb-3", currentTheme.accent)}>{subtitle}</p>
          )}
          <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight", currentTheme.text)}>
            {title}
          </h2>
        </motion.div>

        {/* Feature display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Feature media */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div
              className={cn(
                "relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden border shadow-lg",
                currentTheme.border,
              )}
            >
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === activeFeature && (
                      <motion.div
                        key={feature.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {feature.media.type === "video" ? (
                          <video
                            src={feature.media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
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
                          <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
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

          {/* Feature navigation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={cn(
                    "cursor-pointer rounded-xl p-5 transition-all duration-300 border",
                    index === activeFeature
                      ? cn(currentTheme.highlight, currentTheme.border)
                      : cn("hover:bg-muted/10", currentTheme.border),
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
                        index === activeFeature ? currentTheme.accent : "bg-muted/20 text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className={cn("text-xl font-semibold transition-colors", currentTheme.text)}>
                        {feature.title}
                      </h3>
                      <p className={cn("text-sm leading-relaxed", currentTheme.muted)}>{feature.description}</p>
                      {feature.cta && (
                        <Button variant="link" className="p-0 h-auto text-primary" asChild>
                          <a href={feature.cta.href} className="flex items-center">
                            {feature.cta.text}
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for active feature */}
                  {index === activeFeature && (
                    <div className="mt-4 h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feature indicators */}
            <div className="flex items-center justify-center mt-6 gap-2">
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

