"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [canAnimate, setCanAnimate] = useState(true)
  
  // Initialize with simple animation states instead of hooks
  const [iconPositions, setIconPositions] = useState(
    icons.map(() => ({ x: 0, y: 0, scale: 0.8, opacity: 0, rotate: 0 }))
  )
  
  // Initialize animation controls and setup
  useEffect(() => {
    // Simple heuristic to disable animations on lower-end devices
    const checkPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const hasLowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4
      setCanAnimate(!(isMobile && hasLowMemory))
    }
    checkPerformance()
    
    // Use a short timeout to ensure component is fully mounted before any measurements
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        setIsLoaded(true)
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle animations separately, only after dimensions are ready
  useEffect(() => {
    if (!isLoaded || !canAnimate || !dimensions.width) return;
    
    // Only start animations when component is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const timers: NodeJS.Timeout[] = [];
        
        icons.forEach((_, index) => {
          // Create a staggered effect with longer delays
          const timer = setTimeout(() => {
            startBoundedAnimation(index);
          }, index * 250);
          
          timers.push(timer);
        });
        
        return () => timers.forEach(timer => clearTimeout(timer));
      }
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [isLoaded, canAnimate, dimensions, icons.length]);
  
  // Handle resize with throttling
  useEffect(() => {
    if (!containerRef.current) return;
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect()
          setDimensions({ width, height })
        }
      }, 200);
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);
  
  // Animation function that updates state instead of using Framer hooks
  const startBoundedAnimation = (index: number) => {
    if (
      isHovering === index || 
      !isLoaded || 
      !canAnimate || 
      !dimensions.width
    ) return
    
    // Create wider horizontal boundaries but with less movement
    const widthFactor = 1.6;
    const maxWidth = dimensions.width * 0.25 * widthFactor
    const maxHeight = dimensions.height * 0.1
    
    // Vertical offset
    const verticalOffset = -dimensions.height * 0.15
    
    // Simplified position calculation
    let x, y;
    
    if (index === 0) {
      x = -maxWidth * 0.5
      y = verticalOffset
    } 
    else if (index === icons.length - 1) {
      x = maxWidth * 0.5
      y = verticalOffset
    }
    else {
      x = 0
      y = verticalOffset * 0.8
    }
    
    // Add small random variation
    x += maxWidth * (Math.random() * 0.2 - 0.1)
    y += maxHeight * (Math.random() * 0.2 - 0.1)
    
    const scale = 0.95 + Math.random() * 0.1
    const rotation = Math.random() * 4 - 2
    
    try {
      // Update the state with new position
      setIconPositions(prev => {
        const newPositions = [...prev];
        newPositions[index] = {
          x, 
          y, 
          scale, 
          rotate: rotation, 
          opacity: 1
        };
        return newPositions;
      });
      
      // Schedule the next animation
      setTimeout(() => {
        if (isLoaded && canAnimate) {
          startBoundedAnimation(index);
        }
      }, (3 + Math.random()) * 1000);
    } catch (err) {
      // Safely handle any animation errors
      console.debug("Animation error suppressed");
    }
  }
  
  const handleMouseEnter = (index: number) => {
    if (!canAnimate) return;
    setIsHovering(index);
    
    try {
      setIconPositions(prev => {
        const newPositions = [...prev];
        newPositions[index] = {
          ...newPositions[index],
          scale: 1.1
        };
        return newPositions;
      });
    } catch (err) {
      // Safely handle any errors
    }
  }
  
  const handleMouseLeave = (index: number) => {
    if (!canAnimate) return;
    setIsHovering(null);
    
    startBoundedAnimation(index);
  }

  // Get initial static positions for icons in a line
  const getInitialPosition = (index: number) => {
    const spacing = 70;
    const totalWidth = (icons.length - 1) * spacing;
    return {
      x: (index * spacing) - (totalWidth / 2),
      y: 0,
    }
  }

  // Simplified z-index
  const getZIndex = (index: number) => {
    return isHovering === index ? 50 : 10;
  }

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`} 
      ref={containerRef}
      style={{ 
        height: '120px',
        paddingTop: '15px',
        marginTop: '-5px',
        borderRadius: '12px',
        background: 'rgba(var(--primary), 0.03)'
      }}
    >
      {canAnimate && isLoaded ? (
        // Animated version for capable devices
        <div className="relative w-full h-full">
          {icons.map((icon, index) => {
            const position = iconPositions[index];
            return (
              <motion.a
                key={icon.name}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.name}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full"
                animate={position}
                initial={{ 
                  x: getInitialPosition(index).x, 
                  y: getInitialPosition(index).y, 
                  scale: 0.8, 
                  opacity: 0, 
                  rotate: 0 
                }}
                transition={{ 
                  type: "tween",
                  duration: 1.5,
                  ease: "easeInOut"
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
            );
          })}
        </div>
      ) : (
        // Static version for low-performance devices or while loading
        <div className="flex items-center justify-center gap-10 h-full">
          {icons.map((icon) => (
            <a
              key={`static-${icon.name}`}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:scale-110 transition-transform duration-200"
              style={{ background: `linear-gradient(135deg, ${icon.color}, ${icon.color}cc)` }}
            >
              <span className="text-white" dangerouslySetInnerHTML={{ __html: icon.icon }} />
            </a>
          ))}
        </div>
      )}
    </div>
  )
} 