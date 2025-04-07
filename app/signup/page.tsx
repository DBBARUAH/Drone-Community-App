"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["client", "photographer"], {
    required_error: "Please select a role",
  }),
})

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('auth-pages');
    return () => {
      document.body.classList.remove('auth-pages');
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
  })

  const handleSocialSignup = (connection: string) => {
    setIsLoading(true)
    const role = form.getValues().role
    localStorage.setItem("userRole", role)
    const authUrl = `/api/auth/login?role=${role}&connection=${connection}&screen_hint=signup&returnTo=/dashboard`
    window.location.href = authUrl
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    localStorage.setItem("userRole", values.role)
    const authUrl = `/api/auth/login?role=${values.role}&screen_hint=signup&returnTo=/dashboard`
    window.location.href = authUrl
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen pt-[calc(4rem+2rem)] pb-8 px-4">
      <div className="container max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-sans font-semibold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground">Choose your role to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-4"
                        >
                          <div className="relative flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors">
                            <RadioGroupItem value="client" id="client" className="peer sr-only" />
                            <label
                              htmlFor="client"
                              className="flex items-center gap-3 w-full cursor-pointer peer-data-[state=checked]:font-medium"
                            >
                              <div className="rounded-full bg-primary/10 p-2">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium tracking-tight">Client</span>
                                <span className="text-sm text-muted-foreground">I want to hire drone photographers</span>
                              </div>
                            </label>
                          </div>
                          <div className="relative flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors">
                            <RadioGroupItem value="photographer" id="photographer" className="peer sr-only" />
                            <label
                              htmlFor="photographer"
                              className="flex items-center gap-3 w-full cursor-pointer peer-data-[state=checked]:font-medium"
                            >
                              <div className="rounded-full bg-primary/10 p-2">
                                <Camera className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium tracking-tight">Photographer</span>
                                <span className="text-sm text-muted-foreground">I offer drone photography services</span>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3 pt-3">
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 font-medium tracking-tight"
                    onClick={() => handleSocialSignup('google-oauth2')}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 font-medium tracking-tight"
                    onClick={() => handleSocialSignup('apple')}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 100 100">
                      <path d="M65.87,50.3c-0.08-8.11,6.63-12.07,6.94-12.25c-3.8-5.56-9.68-6.31-11.77-6.38c-4.97-0.51-9.77,2.97-12.3,2.97 c-2.56,0-6.46-2.92-10.62-2.83c-5.44,0.08-10.51,3.22-13.31,8.13c-5.74,9.96-1.46,24.66,4.07,32.72c2.73,3.91,5.94,8.29,10.15,8.14 c4.09-0.17,5.63-2.62,10.57-2.62c4.89,0,6.31,2.62,10.59,2.53c4.39-0.08,7.16-3.94,9.81-7.88c3.13-4.48,4.41-8.9,4.47-9.13 C74.32,63.53,65.97,60.11,65.87,50.3z" fill="currentColor"/>
                      <path d="M59.02,30.35c2.22-2.73,3.73-6.48,3.32-10.26c-3.21,0.14-7.17,2.16-9.47,4.84c-2.04,2.39-3.86,6.27-3.38,9.95 C53.01,35.17,56.72,33.09,59.02,30.35z" fill="currentColor"/>
                    </svg>
                    Sign up with Apple
                  </Button>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full font-medium tracking-tight"
                    disabled={isLoading}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-1 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/signin" 
                className="text-primary hover:text-primary/90 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

