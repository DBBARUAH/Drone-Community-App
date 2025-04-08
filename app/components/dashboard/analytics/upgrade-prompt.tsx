"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/blog-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  title: string
  description: string
  features: string[]
}

export function UpgradePrompt({ title, description, features }: UpgradePromptProps) {
  return (
    <Card className="border-dashed bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto">
            <Link href="/dashboard/settings/subscription">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Start 1-Month Free Trial
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
