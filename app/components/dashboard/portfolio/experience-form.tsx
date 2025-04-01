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

const formSchema = z.object({
  yearsExperience: z.string().min(1, "Please select years of experience").optional(),
  specialties: z.string().min(2, "Please list your specialties").optional(),
  serviceArea: z.string().min(2, "Please specify your service area").optional(),
})

interface ExperienceFormProps {
  onComplete: () => void
}

export function ExperienceForm({ onComplete }: ExperienceFormProps) {
  const [projectHighlights, setProjectHighlights] = useState<
    {
      id: string
      title: string
      client: string
      description: string
      year: string
      category: string
    }[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsExperience: "",
      specialties: "",
      serviceArea: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, projectHighlights)
    onComplete()
  }

  const addProject = () => {
    setProjectHighlights([
      ...projectHighlights,
      {
        id: Date.now().toString(),
        title: "",
        client: "",
        description: "",
        year: new Date().getFullYear().toString(),
        category: "",
      },
    ])
  }

  const removeProject = (id: string) => {
    setProjectHighlights(projectHighlights.filter((project) => project.id !== id))
  }

  const updateProject = (id: string, field: string, value: string) => {
    setProjectHighlights(
      projectHighlights.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Experience</h3>
        <p className="text-sm text-muted-foreground">Share your drone photography and videography experience.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Austin and surrounding areas (50 mile radius)" {...field} />
                  </FormControl>
                  <FormDescription>Specify the geographic area where you provide services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Real estate photography, wedding videography, construction progress monitoring, 3D mapping"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>List your areas of expertise, separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Highlights Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Project Highlights</h4>
              <Button type="button" variant="outline" size="sm" onClick={addProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            {projectHighlights.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No project highlights added. Click the button above to add your notable projects.
              </p>
            ) : (
              <div className="space-y-4">
                {projectHighlights.map((project, index) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Project {index + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                          <Input
                            id={`project-title-${project.id}`}
                            placeholder="e.g., Luxury Beachfront Property"
                            value={project.title}
                            onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`project-client-${project.id}`}>Client/Company</Label>
                          <Input
                            id={`project-client-${project.id}`}
                            placeholder="e.g., Coastal Realty Group"
                            value={project.client}
                            onChange={(e) => updateProject(project.id, "client", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <div>
                          <Label htmlFor={`project-year-${project.id}`}>Year</Label>
                          <Input
                            id={`project-year-${project.id}`}
                            type="number"
                            placeholder="2023"
                            value={project.year}
                            onChange={(e) => updateProject(project.id, "year", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`project-category-${project.id}`}>Category</Label>
                          <Select
                            value={project.category}
                            onValueChange={(value) => updateProject(project.id, "category", value)}
                          >
                            <SelectTrigger id={`project-category-${project.id}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="wedding">Wedding/Events</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="mapping">Mapping/Surveying</SelectItem>
                              <SelectItem value="travel">Travel/Tourism</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`project-description-${project.id}`}>Project Description</Label>
                        <Textarea
                          id={`project-description-${project.id}`}
                          placeholder="Briefly describe the project, your role, and the outcome"
                          className="min-h-[80px]"
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

