"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useForm } from "react-hook-form"
import { CheckCircle2, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { SocialIconCloud } from "@/components/ui/social-icon-cloud"

type FormValues = {
  name: string
  email: string
  message: string
  interests: string
}

// Social media icons for the cloud - using larger icons and updated colors
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

export default function ContactUs() {
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [animationLoaded, setAnimationLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    setIsMounted(true)
    // Only start animations after component is mounted
    if (isMounted) {
      controls.start("visible")
    }
  }, [isMounted, controls])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationLoaded(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      interests: "learning",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/xgegjwqk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
        form.reset()

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <section id="contactus" className="w-full py-24 bg-gradient-to-b from-background/90 to-background">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col items-center text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="section-header no-after">
            CONNECT WITH US
          </motion.h2>
          <div className="page-title-underline"></div>
          <motion.p
            variants={itemVariants}
            className="page-description"
          >
            Whether you're looking to enhance your aerial photography skills or connect with professionals for aerial
            services, this is the place for you. Sign up to connect with a community of enthusiasts and professionals.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Left Column: Text and Social Links */}
          <motion.div
            initial="hidden"
            animate={controls}
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="flex flex-col justify-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="bg-card/50 border-border overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground tracking-tight mb-3">
                      Join Our Aerial Community
                    </h3>
                    <p className="text-muted-foreground mb-8 font-playfair text-sm md:text-[0.95rem] leading-relaxed max-w-md mx-auto">
                      Become part of a growing network of drone creators, professionals, and clients seeking exceptional aerial content.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground/90 font-playfair text-sm md:text-[0.95rem] leading-relaxed">
                        Get discovered by clients seeking aerial services
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground/90 font-playfair text-sm md:text-[0.95rem] leading-relaxed">
                        Find and hire top drone professionals for your projects
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground/90 font-playfair text-sm md:text-[0.95rem] leading-relaxed">
                        Access premium LUTs and editing resources
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground/90 font-playfair text-sm md:text-[0.95rem] leading-relaxed">
                        Showcase your portfolio to a global audience
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-primary mb-1 tracking-tight">
                  Follow Our Journey
                </h3>
                <p className="text-muted-foreground mb-1 text-sm max-w-md mx-auto">
                  Stay updated with our latest aerial adventures
                </p>
                <div className="w-full relative mx-auto max-w-md mt-0">
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
                        className="flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${icon.color}, ${icon.color}cc)` }}
                      >
                        <span className="text-white" dangerouslySetInnerHTML={{ __html: icon.icon }} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial="hidden"
            animate={controls}
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="relative"
          >
            <motion.div
              variants={itemVariants}
              className={cn(
                "relative z-10 rounded-xl overflow-hidden backdrop-blur-sm border border-border",
                "bg-card/95 shadow-xl",
              )}
            >
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-3">
                    Share Your Aerial Vision
                  </h3>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Your Name"
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-md h-11"
                                {...field}
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Your Email"
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-md h-11"
                                {...field}
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Anything you would like to share"
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] rounded-md"
                                {...field}
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-playfair">Your Interests:</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-input border-border text-foreground font-playfair rounded-md h-11">
                                  <SelectValue placeholder="Select your interests" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-popover border-border text-foreground">
                                <SelectItem value="learning" className="font-playfair">Learning Drone Photography/Videography</SelectItem>
                                <SelectItem value="editing" className="font-playfair">Exploring LUTs and Editing Resources</SelectItem>
                                <SelectItem value="connecting" className="font-playfair">Connecting with Drone Enthusiasts</SelectItem>
                                <SelectItem value="hiring" className="font-playfair">Hiring Professional Drone Services</SelectItem>
                                <SelectItem value="others" className="font-playfair">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium",
                          "transition-all duration-300 transform hover:scale-[1.02]",
                          "flex items-center justify-center gap-2 h-12 rounded-md",
                        )}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        ) : isSuccess ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Message Sent!</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Connect With Us</span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

