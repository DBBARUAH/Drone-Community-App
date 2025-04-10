"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ExperienceFormProps {
  onComplete: () => void
  profileId: string
}

interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
}

export function ExperienceForm({ onComplete, profileId }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit() {
    setIsSubmitting(true)
    console.log("Submitting experiences:", experiences)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false)
    onComplete()
  }

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: null,
        description: "",
      },
    ])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string | null) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Experience</h3>
        <p className="text-sm text-muted-foreground">Share your drone photography and videography experience.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Work Experience / Projects</h4>
            <Button type="button" variant="outline" size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No experiences added. Click the button above to add your work history or notable projects.
            </p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline">Experience {index + 1}</Badge>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`exp-title-${exp.id}`}>Title / Role</Label>
                        <Input
                          id={`exp-title-${exp.id}`}
                          placeholder="e.g., Lead Drone Pilot, Project Photographer"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exp-company-${exp.id}`}>Company / Client</Label>
                        <Input
                          id={`exp-company-${exp.id}`}
                          placeholder="e.g., Skyshot Productions, Coastal Realty"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                      <Input
                        id={`exp-location-${exp.id}`}
                        placeholder="e.g., Austin, TX, Remote"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4">
                      <div>
                        <Label htmlFor={`exp-startDate-${exp.id}`}>Start Date</Label>
                        <Input
                          id={`exp-startDate-${exp.id}`}
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exp-endDate-${exp.id}`}>End Date (Optional)</Label>
                        <Input
                          id={`exp-endDate-${exp.id}`}
                          type="date"
                          value={exp.endDate ?? ''}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value || null)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`exp-description-${exp.id}`}>Description</Label>
                      <Textarea
                        id={`exp-description-${exp.id}`}
                        placeholder="Describe your responsibilities, achievements, or the project details"
                        className="min-h-[80px]"
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}

