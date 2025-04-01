"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, User, Mail, Info, Check, X, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, isPhotographer, isLoading } = useAuth()

  // Check if email is from a social provider
  const isSocialEmail =
    user?.sub?.startsWith("google-oauth2|") ||
    user?.sub?.startsWith("facebook|") ||
    user?.sub?.startsWith("github|") ||
    user?.sub?.startsWith("apple|")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  // Update form values when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
      })
    }
  }, [user, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement profile update logic
    console.log(values)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="flex flex-row items-center gap-4 p-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.picture || "/placeholder-user.jpg"} alt={user?.name || "User"} />
              <AvatarFallback>
                {user?.name
                  ? user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {isPhotographer ? (
                    <>
                      <Camera className="h-4 w-4 mr-1" />
                      Photographer
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-1" />
                      Client
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} className="pl-9" disabled={!isEditing} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Email
                        {isSocialEmail && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Social login email cannot be changed</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} className="pl-9" disabled={!isEditing || isSocialEmail} />
                        </div>
                      </FormControl>
                      {isEditing && !isSocialEmail && (
                        <FormDescription>Changing email will require verification</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isPhotographer && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Photographer Details</h3>
                    {/* Add photographer-specific fields here */}
                    <p className="text-sm text-muted-foreground">
                      Additional photographer details can be managed in your portfolio settings.
                    </p>
                  </div>
                )}

                {isEditing && (
                  <div className="flex items-center gap-2 pt-4">
                    <Button type="submit">
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        form.reset({
                          name: user?.name || "",
                          email: user?.email || "",
                        })
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

