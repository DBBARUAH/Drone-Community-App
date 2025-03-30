import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  actionText: string
  actionLink: string
}

export function QuickActionCard({ title, description, icon: Icon, actionText, actionLink }: QuickActionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={actionLink}>{actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

