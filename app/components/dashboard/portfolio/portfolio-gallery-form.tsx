"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  portfolioDescription: z.string().min(10, "Please provide a description of your portfolio").optional(),
})

interface PortfolioGalleryFormProps {
  onComplete: () => void
  profileId: string
}

export function PortfolioGalleryForm({ onComplete, profileId }: PortfolioGalleryFormProps) {
  const [categories, setCategories] = useState<
    {
      id: string
      name: string
      description: string
    }[]
  >([
    { id: "real-estate", name: "Real Estate", description: "Aerial photography and videography for properties" },
    { id: "events", name: "Events", description: "Weddings, concerts, and special occasions" },
  ])

  const [portfolioItems, setPortfolioItems] = useState<
    {
      id: string
      title: string
      description: string
      categoryId: string
      mediaType: "image" | "video"
      mediaUrl: string
      location: string
      featured: boolean
    }[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolioDescription: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, categories, portfolioItems)
    onComplete()
  }

  // Category handlers
  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
      },
    ])
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
    // Also remove portfolio items in this category
    setPortfolioItems(portfolioItems.filter((item) => item.categoryId !== id))
  }

  const updateCategory = (id: string, field: string, value: string) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)))
  }

  // Portfolio item handlers
  const addPortfolioItem = (categoryId: string) => {
    setPortfolioItems([
      ...portfolioItems,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        categoryId,
        mediaType: "image",
        mediaUrl: "",
        location: "",
        featured: false,
      },
    ])
  }

  const removePortfolioItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
  }

  const updatePortfolioItem = (id: string, field: string, value: any) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updatePortfolioItem(id, "mediaUrl", e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Portfolio Gallery</h3>
        <p className="text-sm text-muted-foreground">Showcase your best work organized by categories.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="portfolioDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide an overview of your portfolio and the type of work you showcase"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This will be displayed at the top of your portfolio gallery</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categories and Portfolio Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Portfolio Categories</h4>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No categories added. Click the button above to create portfolio categories.
              </p>
            ) : (
              <Tabs defaultValue={categories[0].id} className="w-full">
                <TabsList className="w-full justify-start overflow-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
                      {category.name || "Unnamed Category"}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Category Details</h5>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeCategory(category.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <FormLabel>Category Name</FormLabel>
                            <Input
                              placeholder="e.g., Real Estate, Events, Commercial"
                              value={category.name}
                              onChange={(e) => updateCategory(category.id, "name", e.target.value)}
                            />
                          </div>

                          <div>
                            <FormLabel>Category Description</FormLabel>
                            <Textarea
                              placeholder="Describe this category of work"
                              className="min-h-[80px]"
                              value={category.description}
                              onChange={(e) => updateCategory(category.id, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Portfolio Items</h5>
                      <Button type="button" variant="outline" size="sm" onClick={() => addPortfolioItem(category.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    {portfolioItems.filter((item) => item.categoryId === category.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No portfolio items in this category. Click the button above to add your work.
                      </p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {portfolioItems
                          .filter((item) => item.categoryId === category.id)
                          .map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="relative h-48 bg-muted">
                                {item.mediaUrl ? (
                                  <>
                                    {item.mediaType === "image" ? (
                                      <img
                                        src={item.mediaUrl || "/placeholder.svg"}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <video src={item.mediaUrl} className="w-full h-full object-cover" controls />
                                    )}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 h-6 w-6"
                                      onClick={() => updatePortfolioItem(item.id, "mediaUrl", "")}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <Button type="button" variant="outline" className="relative overflow-hidden">
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload {item.mediaType === "image" ? "Image" : "Video"}
                                      <input
                                        type="file"
                                        accept={item.mediaType === "image" ? "image/*" : "video/*"}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileUpload(item.id, e)}
                                      />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex gap-2">
                                    <Badge variant={item.featured ? "default" : "outline"}>
                                      {item.featured ? "Featured" : "Regular"}
                                    </Badge>
                                    <Badge variant="secondary">{item.mediaType === "image" ? "Image" : "Video"}</Badge>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePortfolioItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>

                                <div className="space-y-3 mt-2">
                                  <div>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                      placeholder="e.g., Luxury Beachfront Property"
                                      value={item.title}
                                      onChange={(e) => updatePortfolioItem(item.id, "title", e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                      placeholder="Describe this portfolio item"
                                      className="min-h-[60px]"
                                      value={item.description}
                                      onChange={(e) => updatePortfolioItem(item.id, "description", e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <FormLabel>Location</FormLabel>
                                    <Input
                                      placeholder="e.g., Austin, TX"
                                      value={item.location}
                                      onChange={(e) => updatePortfolioItem(item.id, "location", e.target.value)}
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`featured-${item.id}`}
                                      checked={item.featured}
                                      onChange={(e) => updatePortfolioItem(item.id, "featured", e.target.checked)}
                                    />
                                    <label htmlFor={`featured-${item.id}`} className="text-sm">
                                      Feature this item (will be highlighted in your portfolio)
                                    </label>
                                  </div>

                                  <div>
                                    <FormLabel>Media Type</FormLabel>
                                    <Select
                                      value={item.mediaType}
                                      onValueChange={(value: "image" | "video") =>
                                        updatePortfolioItem(item.id, "mediaType", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select media type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="image">Image</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
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

