"use client"

import { EnhancedFeatureSection } from "@/components/home/enhanced-feature-section"

const droneFeatures = [
  {
    id: "hire-pros",
    title: "Hire Top Drone Pros",
    description:
      "Instantly connect with skilled drone photographers and videographers. Get stunning aerial visuals for real estate, events, marketing campaigns, and more.",
    media: {
      type: "video" as const,
      src: "/videos/feature-droneshot.mp4",
      alt: "Drone photography professionals",
    },
    badge: "Popular",
    cta: {
      text: "Find photographers",
      href: "/photographers",
    },
  },
  {
    id: "showcase-talent",
    title: "Showcase Your Talent",
    description:
      "Build a standout portfolio, reach new clients, and collaborate with fellow aerial creators. Whether you're an aspiring drone pilot or a seasoned pro, our platform helps you shine.",
    media: {
      type: "video" as const,
      src: "/videos/feature-droneartist.mp4",
      alt: "Drone artist showcasing work",
    },
    cta: {
      text: "Create portfolio",
      href: "/dashboard/portfolio/create",
    },
  },
  {
    id: "enhance-inspire",
    title: "Enhance & Inspire",
    description:
      "Dive into a trove of editing tools, presets, and insider tips. Network with passionate professionals, swap ideas, and elevate your craft in a supportive environment.",
    media: {
      type: "video" as const,
      src: "/videos/card1_beachshot.mp4",
      alt: "Drone beach photography",
    },
    cta: {
      text: "Explore resources",
      href: "/resources",
    },
  },
]

export function DroneFeatureSection() {
  return (
    <EnhancedFeatureSection
      title="Elevate Beyond the Ordinary"
      subtitle="Aerial Excellence"
      features={droneFeatures}
      autoPlayInterval={6000}
      darkMode={false}
    />
  )
}

