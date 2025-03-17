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
        "before:bg-gradient-to-r before:from-sky-500/50 before:via-indigo-500/50 before:to-purple-500/50",
        "after:absolute after:inset-[1px] after:-z-10 after:rounded-xl",
        "after:bg-gradient-to-br after:from-black/90 after:to-[#0f172a]/90",
        
        // Main Card Styling
        "flex flex-col rounded-xl",
        "bg-gradient-to-br from-[#0f1729]/95 via-[#0f172a]/95 to-[#0a0f1f]/95",
        "backdrop-blur-xl backdrop-saturate-200",
        "p-6 text-start",
        
        // Fixed dimensions and text handling
        "h-[260px] w-[320px]",
        "flex flex-col gap-3",
        
        // Aerial photography inspired glow
        "shadow-lg shadow-sky-500/10",
        "hover:shadow-xl hover:shadow-sky-500/20",
        
        // Enhanced 3D hover effect
        "hover:scale-[1.08] hover:-translate-y-2 hover:rotate-[0.5deg]",
        "hover:before:from-sky-400/50 hover:before:via-indigo-400/50 hover:before:to-purple-400/50",
        
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
          <h3 className="text-md font-semibold leading-none text-sky-100">
            {author.name}
          </h3>
          <p className="text-sm text-sky-300/80">
            {author.handle}
          </p>
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="text-sm leading-relaxed text-sky-100/90 line-clamp-6 text-justify hyphens-auto">
        {text}
      </p>
    </Card>
  )
}