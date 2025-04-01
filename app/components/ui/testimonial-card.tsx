import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        // 3D Border Effect with aerial photography theme colors
        "relative before:absolute before:inset-0 before:-z-10",
        "before:rounded-xl before:p-[2px]",
        "before:bg-gradient-to-r before:from-neutral-900/50 before:via-neutral-900/50 before:to-neutral-800/50",
        "after:absolute after:inset-[1px] after:-z-10 after:rounded-xl",
        "after:bg-gradient-to-br after:from-black/90 after:to-neutral-900/90",
        
        // Main Card Styling
        "flex flex-col rounded-xl",
        "bg-gradient-to-br from-black/95 via-neutral-900/95 to-black/95",
        "backdrop-blur-xl backdrop-saturate-200",
        "p-6 text-start",
        
        // Fixed dimensions and text handling
        "h-[260px] w-[320px]",
        "flex flex-col gap-3",
        
        // Dark theme glow
        "shadow-lg shadow-black/20",
        "hover:shadow-xl hover:shadow-black/30",
        
        // Enhanced 3D hover effect
        "hover:scale-[1.08] hover:-translate-y-2 hover:rotate-[0.5deg]",
        "hover:before:from-neutral-800/50 hover:before:via-neutral-800/50 hover:before:to-neutral-700/50",
        
        // Card transitions
        "transition-all duration-300 ease-out",
        "transform-gpu perspective-[1000px]",
        className
      )}
    >
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 ring-2 ring-sky-500/50 ring-offset-4 ring-offset-[#0f172a] shadow-xl">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-white/80 text-sm font-medium">
            {author.name}
          </h3>
          <p className="text-xs text-white/50 font-light tracking-wide">
            {author.handle}
          </p>
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="text-white/90 text-sm leading-relaxed line-clamp-6 text-justify hyphens-auto font-playfair">
        {text}
      </p>
    </Card>
  )
}