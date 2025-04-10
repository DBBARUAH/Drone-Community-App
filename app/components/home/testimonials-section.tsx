"use client"

import { TestimonialsMarquee } from "@/components/ui/testimonials-with-marquee"

const testimonials = [
  {
    author: {
      name: "John Smith",
      handle: "@dronemaster",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
    },
    text: "The platform has been a game-changer for my drone photography business. The community is incredibly supportive, and I've landed several high-profile gigs through the network.",
    href: "https://twitter.com/dronemaster"
  },
  {
    author: {
      name: "Sarah Chen",
      handle: "@luxuryrealestate",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Found the perfect drone photographer for our luxury real estate listings. The aerial shots have significantly increased property engagement and views. Highly recommend this platform!",
    href: "https://twitter.com/luxuryrealestate"
  },
  {
    author: {
      name: "Marcus Rodriguez",
      handle: "@aerialcinema",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Found amazing clients through the platform. The networking opportunities here are unmatched - from real estate aerial shoots to wedding cinematography. My drone business has grown 3x since joining.",
    href: "https://twitter.com/aerialcinema"
  },
  {
    author: {
      name: "Lisa Zhang",
      handle: "@venuesvista",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "As an event venue owner, the aerial shots of our location have been game-changing for marketing. The drone photographers here understand exactly what businesses need."
  },
  {
    author: {
      name: "Alex Thompson",
      handle: "@dronepro",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Started with real estate shoots, now I'm doing everything from luxury car commercials to wedding venues and personal property tours. Love how diverse the client opportunities are on this platform!",
    href: "https://twitter.com/dronepro"
  },
  {
    author: {
      name: "Maya Patel",
      handle: "@skycaptures",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "From capturing beachfront properties to automotive showcases and personal events - the variety of gigs is amazing! Each week brings new exciting projects and clients through the platform.",
    href: "https://twitter.com/skycaptures"
  }
]

export function CommunityTestimonials() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[40%] h-[50%] bg-primary/5 rounded-full blur-[120px] opacity-70 dark:opacity-30" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[50%] bg-primary/10 rounded-full blur-[120px] opacity-60 dark:opacity-20" />
      </div>
      
      <TestimonialsMarquee
        title="TRUSTED BY THE COMMUNITY"
        description="Discover how creators and businesses are leveraging aerial perspectives across real estate, automotive, and event photography."
        testimonials={testimonials}
        className="relative z-10"
      />
    </div>
  )
}