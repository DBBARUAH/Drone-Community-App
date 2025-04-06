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
  className?: string;
}

export function TestimonialsMarquee({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsMarqueeProps) {
  return (
    <section className={cn(
      "bg-background text-foreground relative",
      "py-12 md:py-16",
      "px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center px-4">
          <h2 className="section-header no-after">
            {title}
          </h2>
          <div className="page-title-underline"></div>
          <p className="page-description">
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
                    {...testimonial}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background to-transparent sm:block" />
        </div>
      </div>
    </section>
  )
}