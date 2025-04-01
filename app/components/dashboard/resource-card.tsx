import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"

interface ResourceCardProps {
  title: string
  description: string
  link: string
  linkText: string
  imageUrl: string
}

export function ResourceCard({ title, description, link, linkText, imageUrl }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-32 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={link} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          {linkText} <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}

