"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimationControls, AnimatePresence } from "framer-motion"

interface SocialIconProps {
  name: string
  icon: string
  href: string
  color: string
}

interface SocialIconCloudProps {
  icons: SocialIconProps[]
  className?: string
}

export function SocialIconCloud({ icons, className }: SocialIconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const controls = icons.map(() => useAnimationControls())
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Generate initial positions and set up animations
  useEffect(() => {
    if (!containerRef.current) return
    
    const { width, height } = containerRef.current.getBoundingClientRect()
    setDimensions({ width, height })
    setIsLoaded(true)
    
    // Initialize each icon's animation with different starting positions
    icons.forEach((_, index) => {
      // Add slight delay for each icon to create a staggered effect
      setTimeout(() => {
        startBoundedAnimation(index)
      }, index * 150)
    })
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [icons.length, containerRef.current])
  
  // Function to animate a single icon with a bounded floating motion
  const startBoundedAnimation = (index: number) => {
    if (isHovering === index || !isLoaded) return
    
    // Create wider horizontal boundaries
    const widthFactor = 1.8; // Wider movement horizontally
    const maxWidth = dimensions.width * 0.3 * widthFactor
    const maxHeight = dimensions.height * 0.15 // Less vertical movement
    
    // Vertical offset to move icons up (negative value moves up)
    const verticalOffset = -dimensions.height * 0.25 // Increased vertical offset
    
    // Calculate positions with horizontal emphasis
    let x, y;
    
    // For first icon, keep near center left
    if (index === 0) {
      x = -maxWidth * (0.4 + Math.random() * 0.3)
      y = maxHeight * (Math.random() * 0.5 - 0.25) + verticalOffset
    } 
    // For last icon, keep near center right
    else if (index === icons.length - 1) {
      x = maxWidth * (0.4 + Math.random() * 0.3)
      y = maxHeight * (Math.random() * 0.5 - 0.25) + verticalOffset
    }
    // For middle icon, keep near center
    else {
      x = maxWidth * (Math.random() * 0.5 - 0.25)
      y = maxHeight * (Math.random() * 0.6 - 0.3) + verticalOffset
    }
    
    const scale = 0.9 + Math.random() * 0.15
    const rotation = Math.random() * 10 - 5 // Reduced rotation
    
    // Create a slower, more gentle floating motion
    controls[index].start({
      x,
      y,
      scale,
      rotate: rotation,
      opacity: 1,
      transition: { 
        type: "tween",
        duration: 2.5 + Math.random() * 1.5,
        ease: "easeInOut"
      }
    }).then(() => {
      // Create a continuous floating effect by calling the next animation
      if (isLoaded) {
        startBoundedAnimation(index)
      }
    })
  }
  
  const handleMouseEnter = (index: number) => {
    setIsHovering(index)
    
    // Pause the continuous animation by setting a fixed position
    controls[index].start({
      scale: 1.2,
      zIndex: 50,
      transition: { 
        type: "spring",
        duration: 0.3,
        damping: 15
      }
    })
  }
  
  const handleMouseLeave = (index: number) => {
    setIsHovering(null)
    
    // Resume the continuous animation
    startBoundedAnimation(index)
  }

  // Get initial static positions for icons in a circle
  const getInitialPosition = (index: number) => {
    const angle = (index / icons.length) * Math.PI * 2
    const radius = 10 // Smaller initial radius
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  // Translate 3D effect for a subtle depth
  const getZIndex = (index: number) => {
    return isHovering === index ? 50 : 10 + (index % 3)
  }

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`} 
      ref={containerRef}
      style={{ 
        height: '120px', // Further reduced height
        paddingTop: '15px', // Increased top padding to move content up
        marginTop: '-5px', // Negative margin to pull the whole container up
        perspective: '800px',
        transformStyle: 'preserve-3d',
        border: '1px solid rgba(var(--primary), 0.08)',
        borderRadius: '12px',
        background: 'rgba(var(--primary), 0.03)'
      }}
    >
      {/* Subtle box edges to create a container effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30" 
        style={{ 
          boxShadow: 'inset 0 0 20px rgba(var(--primary), 0.05)',
          borderRadius: '12px'
        }} 
      />
      
      <AnimatePresence>
        {icons.map((icon, index) => {
          const initialPos = getInitialPosition(index)
          return (
            <motion.a
              key={icon.name}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full"
              animate={controls[index]}
              initial={{ 
                x: initialPos.x, 
                y: initialPos.y, 
                scale: 0.8, 
                opacity: 0, 
                rotate: 0 
              }}
              style={{ zIndex: getZIndex(index) }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              whileHover={{ 
                boxShadow: `0 10px 25px ${icon.color}40`,
              }}
            >
              <motion.div 
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${icon.color}20, ${icon.color}40)`,
                  boxShadow: `0 4px 12px ${icon.color}30`
                }}
                whileHover={{
                  background: `radial-gradient(circle at 30% 30%, ${icon.color}30, ${icon.color}60)`,
                }}
              >
                <motion.span 
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${icon.color}, ${icon.color}cc)`,
                    boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 8px ${icon.color}40` 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), 0 3px 10px ${icon.color}60` 
                  }}
                >
                  <span className="text-white" dangerouslySetInnerHTML={{ __html: icon.icon }} />
                </motion.span>
              </motion.div>
            </motion.a>
          )
        })}
      </AnimatePresence>
      
      {/* Static fallback icons in case animation fails */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          {icons.map((icon) => (
            <a
              key={`static-${icon.name}`}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `radial-gradient(circle at 30% 30%, ${icon.color}20, ${icon.color}40)` }}
            >
              <span 
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: icon.color }}
              >
                <span className="text-white" dangerouslySetInnerHTML={{ __html: icon.icon }} />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
} 