import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"

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
  const { theme } = useTheme()
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        // 3D Border Effect with theme colors
        "relative before:absolute before:inset-0 before:-z-10",
        "before:rounded-xl before:p-[2px]",
        "before:bg-gradient-to-r before:from-border/50 before:via-border/50 before:to-border/30",
        "after:absolute after:inset-[1px] after:-z-10 after:rounded-xl",
        "after:bg-gradient-to-br after:from-card after:to-card/90",
        
        // Main Card Styling
        "flex flex-col rounded-xl",
        "bg-gradient-to-br from-card via-card/95 to-card",
        "backdrop-blur-xl backdrop-saturate-200",
        "p-6 text-start",
        
        // Fixed dimensions and text handling
        "h-[260px] w-[320px]",
        "flex flex-col gap-3",
        
        // Theme-aware shadows
        "shadow-lg shadow-black/10 dark:shadow-black/20",
        "hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/30",
        
        // Enhanced 3D hover effect
        "hover:scale-[1.08] hover:-translate-y-2 hover:rotate-[0.5deg]",
        "hover:before:from-border/40 hover:before:via-border/40 hover:before:to-border/20",
        
        // Card transitions
        "transition-all duration-300 ease-out",
        "transform-gpu perspective-[1000px]",
        className
      )}
    >
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 ring-2 ring-blue-600/50 ring-offset-2 ring-offset-card shadow-md">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-card-foreground text-sm font-medium">
            {author.name}
          </h3>
          <p className="text-xs text-muted-foreground font-light tracking-wide">
            {author.handle}
          </p>
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="card-description line-clamp-6">
        {text}
      </p>
    </Card>
  )
}