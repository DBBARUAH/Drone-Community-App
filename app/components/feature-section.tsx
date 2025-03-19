"use client"

import { FeatureSteps } from "@/components/ui/feature-steps"

const features = [
  {
    step: 'Step 1',
    title: 'Hire Top Drone Pros',
    content: 'Instantly connect with skilled drone photographers and videographers. Get stunning aerial visuals for real estate, events, marketing campaigns, and more—all in one curated marketplace.',
    video: '/videos/feature-droneshot.mp4'
  },
  {
    step: 'Step 2',
    title: 'Showcase Your Talent',
    content: "Build a standout portfolio, reach new clients, and collaborate with fellow aerial creators. Whether you're an aspiring drone pilot or a seasoned pro, our platform helps you shine.",
    video: '/videos/feature-droneartist.mp4'
  },
  {
    step: 'Step 3',
    title: 'Enhance & Inspire',
    content: 'Dive into a trove of editing tools, presets, and insider tips. Network with passionate professionals, swap ideas, and elevate your craft in a supportive, growth-focused environment.',
    video: '/videos/card1_beachshot.mp4'
  },
]

export function FeatureSection() {
  return (
    <section className="bg-background py-16">
      <FeatureSteps
        features={features}
        title="ELEVATE BEYOND THE ORDINARY"
        className="container mx-auto"
      />
    </section>
  )
} 