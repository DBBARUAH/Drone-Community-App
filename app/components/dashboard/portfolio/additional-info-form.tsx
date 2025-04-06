"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  bio: z.string().min(10, "Please provide a bio").optional(),
  businessName: z.string().optional(),
  businessWebsite: z.string().url().optional().or(z.literal("")),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessPhone: z.string().optional(),
})

interface AdditionalInfoFormProps {
  onComplete: () => void
  isLastStep?: boolean
}

export function AdditionalInfoForm({ onComplete, isLastStep = false }: AdditionalInfoFormProps) {
  const [socialLinks, setSocialLinks] = useState<
    {
      id: string
      platform: string
      url: string
    }[]
  >([])

  const [businessPolicies, setBusinessPolicies] = useState<
    {
      id: string
      title: string
      content: string
    }[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      businessName: "",
      businessWebsite: "",
      businessEmail: "",
      businessPhone: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, socialLinks, businessPolicies)
    onComplete()
  }

  // Social link handlers
  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        id: Date.now().toString(),
        platform: "",
        url: "",
      },
    ])
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id))
  }

  const updateSocialLink = (id: string, field: string, value: string) => {
    setSocialLinks(socialLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  // Business policy handlers
  const addBusinessPolicy = () => {
    setBusinessPolicies([
      ...businessPolicies,
      {
        id: Date.now().toString(),
        title: "",
        content: "",
      },
    ])
  }

  const removeBusinessPolicy = (id: string) => {
    setBusinessPolicies(businessPolicies.filter((policy) => policy.id !== id))
  }

  const updateBusinessPolicy = (id: string, field: string, value: string) => {
    setBusinessPolicies(businessPolicies.map((policy) => (policy.id === id ? { ...policy, [field]: value } : policy)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Additional Information</h3>
        <p className="text-sm text-muted-foreground">Add your bio, business details, and social media links.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell potential clients about yourself, your background, and your approach to drone photography"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This will be displayed prominently on your profile</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Business Information</h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Skyview Drone Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Social Media & External Links</h4>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            {socialLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No social media links added. Click the button above to add your profiles.
              </p>
            ) : (
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <Card key={link.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-medium">Link {index + 1}</h5>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSocialLink(link.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <FormLabel>Platform</FormLabel>
                          <Select
                            value={link.platform}
                            onValueChange={(value) => updateSocialLink(link.id, "platform", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="vimeo">Vimeo</SelectItem>
                              <SelectItem value="behance">Behance</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <FormLabel>URL</FormLabel>
                          <Input
                            placeholder="https://www.instagram.com/yourusername"
                            value={link.url}
                            onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Business Policies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Business Policies</h4>
              <Button type="button" variant="outline" size="sm" onClick={addBusinessPolicy}>
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>

            {businessPolicies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No business policies added. Click the button above to add policies like cancellation terms, delivery
                timeframes, etc.
              </p>
            ) : (
              <div className="space-y-4">
                {businessPolicies.map((policy, index) => (
                  <Card key={policy.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-medium">Policy {index + 1}</h5>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeBusinessPolicy(policy.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <FormLabel>Policy Title</FormLabel>
                          <Input
                            placeholder="e.g., Cancellation Policy, Delivery Timeline"
                            value={policy.title}
                            onChange={(e) => updateBusinessPolicy(policy.id, "title", e.target.value)}
                          />
                        </div>

                        <div>
                          <FormLabel>Policy Details</FormLabel>
                          <Textarea
                            placeholder="Describe your policy in detail"
                            className="min-h-[100px]"
                            value={policy.content}
                            onChange={(e) => updateBusinessPolicy(policy.id, "content", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">{isLastStep ? "Complete Profile" : "Save & Continue"}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

