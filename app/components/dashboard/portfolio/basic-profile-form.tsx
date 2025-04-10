"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { updateBasicProfile, BasicProfileFormData } from "@/actions/profile"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  title: z.string().min(2, "Professional title is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number is required").optional(),
  location: z.string().min(2, "Location is required").optional(),
})

interface BasicProfileFormProps {
  onComplete: () => void
  profileId: string
}

export function BasicProfileForm({ onComplete, profileId }: BasicProfileFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      // Map form values to the shape expected by updateBasicProfile
      const profileData: BasicProfileFormData = {
        title: values.title,
        location: values.location,
        contactEmail: values.email,
        phone: values.phone,
        // website and bio are not in this form, pass undefined or current values if needed
        website: undefined, // Or fetch current value if necessary
        bio: undefined,     // Or fetch current value if necessary
      }
      
      // Handle fullName separately (e.g., update User model)
      // const userName = values.fullName;
      // await updateUser({ userId: /* get user id */, name: userName });
      
      const result = await updateBasicProfile(profileId, profileData)
      
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your basic profile information has been saved successfully.",
        })
        onComplete()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Basic Profile</h3>
        <p className="text-sm text-muted-foreground">Add your personal and contact information.</p>
      </div>

      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback className="text-lg">
              {form.watch("fullName") ? form.watch("fullName")?.charAt(0)?.toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="relative">
            <Button variant="outline" size="sm" className="relative overflow-hidden">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Drone Photographer & Videographer" {...field} />
                    </FormControl>
                    <FormDescription>This will appear under your name on your profile</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Austin, TX" {...field} />
                    </FormControl>
                    <FormDescription>City and state where you primarily operate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

