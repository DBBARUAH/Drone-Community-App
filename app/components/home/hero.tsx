// app/components/home/hero.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, Camera, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import styles from "@/styles/hero.module.css"
import { useAuth } from "@/hooks/useAuth"
import { SocialIconCloud } from "@/components/ui/social-icon-cloud"

export default function Hero() {
  const router = useRouter()
  const { isAuthenticated, isClient, isPhotographer, setUserRole } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [isBrowser, setIsBrowser] = useState(false)
  const controls = useAnimation()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [animationLoaded, setAnimationLoaded] = useState(false)
  
  const videos = [
    "/videos/homepagevideo_1.mp4",
    // Add more videos for carousel effect if available
  ]

  // Social media icons for the cloud
  const socialIcons = [
    {
      name: "Instagram",
      href: "https://instagram.com/travellers.beats",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0.3"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
      color: "#E1306C"
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@travellersbeat",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
      color: "#FF0000"
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@travellers.beats",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
      color: "#000000"
    }
  ]

  useEffect(() => {
    setIsBrowser(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener("scroll", handleScroll)
    controls.start("visible")
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [controls])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationLoaded(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Video carousel effect
  useEffect(() => {
    if (videos.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }, 12000) // Change video every 12 seconds
    
    return () => clearInterval(interval)
  }, [videos.length])

  // Handle Find Photographer (client role)
  const handleFindPhotographer = () => {
    if (isAuthenticated) {
      // If already authenticated
      if (isClient) {
        // If already a client, go to client dashboard
        router.push('/dashboard/client')
      } else if (isPhotographer) {
        // If photographer, ask if they want to switch roles or go to their dashboard
        setUserRole('client')
        router.push('/dashboard/client')
      }
    } else {
      // If not authenticated, go to auth page with client role preselected
      router.push('/auth/signin?role=client')
    }
  }

  // Handle Join as Photographer
  const handleJoinAsPhotographer = () => {
    if (isAuthenticated) {
      // If already authenticated
      if (isPhotographer) {
        // If already a photographer, go to photographer dashboard
        router.push('/dashboard/photographer')
      } else if (isClient) {
        // If client, ask if they want to switch roles or go to their dashboard
        setUserRole('photographer')
        router.push('/dashboard/photographer')
      }
    } else {
      // If not authenticated, go to auth page with photographer role preselected
      router.push('/auth/signin?role=photographer')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  }

  const floatingVariants = {
    initial: { y: 0 },
    float: {
      y: [-8, 0, -8],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    },
  }

  // Fixed gradient style that won't change with theme
  const textGradientStyle = {
    backgroundImage: "linear-gradient(135deg, #ffd700 0%, #ffb347 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    color: "#ffd700", // Fallback color for browsers that don't support gradients
  }

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-black pt-28">
      {/* Decorative elements */}
      <div className={styles.noisePattern}></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] z-0"></div>
      
      {/* Video Background with animated transition */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
              src={videos[currentVideoIndex]}
            />
            {/* Reduced opacity of the overlay to make video more visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/60"></div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Main content - centered vertically with justify-center */}
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center justify-center min-h-[85vh] max-w-7xl mx-auto md:pt-0 pt-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto space-y-8 -mt-16"
        >
          {/* Main heading with gradient */}
          <motion.h1 
            variants={itemVariants}
            className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="block text-white">ELEVATE YOUR</span>
            <span style={textGradientStyle} className="block">AERIAL VISION</span>
          </motion.h1>
          
          {/* Subtitle with staggered animation - made smaller and italic */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base lg:text-lg text-gray-200/90 font-playfair leading-relaxed max-w-3xl mx-auto mb-6 italic"
          >
            Connect with passionate drone creators, explore signature presets,
            and inspire through your aerial artistry
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
          >
            <ShimmerButton 
              shimmerColor="rgba(255, 215, 0, 0.2)"
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-semibold"
              variant="primary"
              onClick={handleFindPhotographer}
            >
              <Camera className="mr-2 h-5 w-5" />
              Find Photographers
            </ShimmerButton>
            
            <ShimmerButton 
              shimmerColor="rgba(255, 255, 255, 0.1)"
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-semibold"
              variant="secondary"
              onClick={handleJoinAsPhotographer}
            >
              <Users className="mr-2 h-5 w-5" />
              Join as Photographer
            </ShimmerButton>
          </motion.div>
          
          {/* Social media icons with SocialIconCloud instead of static icons */}
          <motion.div 
            variants={itemVariants}
            className="w-full relative mx-auto mt-12 h-32"
          >
            <SocialIconCloud icons={socialIcons} />
            
            {/* Fallback static icons in case the animation doesn't work */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8 transition-opacity duration-700 ${animationLoaded ? 'opacity-0' : 'opacity-100'}`}>
              {socialIcons.map((icon) => (
                <a
                  key={`fallback-${icon.name}`}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${icon.color}, ${icon.color}cc)` }}
                >
                  <span className="text-white" dangerouslySetInnerHTML={{ __html: icon.icon }} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        variants={floatingVariants}
        initial="initial"
        animate="float"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
      >
        <ChevronDown className="w-10 h-10 text-white/80 animate-pulse" />
      </motion.div>
    </section>
  )
}
