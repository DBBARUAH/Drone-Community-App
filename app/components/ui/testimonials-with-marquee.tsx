import { cn } from "@/lib/utils"
import { TestimonialCard } from "@/components/ui/testimonial-card"

// Import the type instead of redeclaring it
import type { TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsMarqueeProps {
  title: string;
  description: string;
  testimonials: Array<{
    author: TestimonialAuthor;
    text: string;
    href?: string;
  }>;
  className?: string; // Add back the className prop
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsMarqueeProps) {
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-32",
      "px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6 px-4">
          <h2 className="mb-4">{title}</h2>
          <p className="section-description max-w-3xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:30s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-slower flex-row group-hover:[animation-play-state:paused]">
              {testimonials.map((testimonial, i) => (
                <div key={`wrapper-${i}`} className="p-4 rounded-lg">
                  <TestimonialCard 
                    key={`card-${i}`}
                    className="bg-neutral-950"
                    {...testimonial}
                  />
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-slower flex-row group-hover:[animation-play-state:paused]">
              {testimonials.map((testimonial, i) => (
                <div key={`wrapper-clone-${i}`} className="p-4 rounded-lg">
                  <TestimonialCard 
                    key={`card-clone-${i}`}
                    className="bg-neutral-950"
                    {...testimonial}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}