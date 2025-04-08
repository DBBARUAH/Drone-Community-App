"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Lightbulb, X } from "lucide-react"

interface AnalyticsTipProps {
  title: string
  description: string
  onDismiss: () => void
}

export function AnalyticsTip({ title, description, onDismiss }: AnalyticsTipProps) {
  return (
    <Alert className="bg-primary/5 border-primary/20">
      <Lightbulb className="h-5 w-5 text-primary" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-70 hover:opacity-100 transition-opacity"
        onClick={onDismiss}
      >
        <X className="h-3 w-3" />
      </Button>
    </Alert>
  )
}
