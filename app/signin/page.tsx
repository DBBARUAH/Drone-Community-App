"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

// Component to handle searchParams related logic
function SignInForm() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams?.get('role') || 'client') as 'client' | 'photographer';
  const hideOtherRoles = searchParams?.get('hideOtherRoles') === 'true';
  const [role, setRole] = useState<'client' | 'photographer'>(initialRole);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Handle redirect in useEffect instead of during render
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
    
    // Add auth-pages class to body when component mounts
    document.body.classList.add('auth-pages');
    return () => {
      document.body.classList.remove('auth-pages');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle social login with specific provider
  const handleSocialLogin = (connection: string) => {
    console.log(`Selected role for signin: ${role}`)
    
    // Save the role to localStorage (as a backup)
    localStorage.setItem('userRole', role);
    
    // Construct URL with role parameter FIRST to ensure it's not missed
    const authUrl = `/api/auth/login?role=${role}&connection=${connection}&returnTo=/dashboard`
    console.log(`Redirecting to: ${authUrl}`)
    
    // Redirect to Auth0 login with role as a parameter and connection to specify social provider
    window.location.href = authUrl;
  };

  // Handle regular Auth0 login (shows Auth0 login page with all options)
  const handleRegularLogin = () => {
    console.log(`Selected role for signin: ${role}`)
    
    // Save the role to localStorage (as a backup)
    localStorage.setItem('userRole', role);
    
    // Construct URL with role parameter FIRST to ensure it's not missed
    const authUrl = `/api/auth/login?role=${role}&returnTo=/dashboard`
    console.log(`Redirecting to: ${authUrl}`)
    
    // Redirect to Auth0 login with just role parameter
    window.location.href = authUrl;
  };

  // Show loading state or the sign-in form
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  // Custom heading based on role
  const getSignInHeading = () => {
    if (hideOtherRoles) {
      if (role === 'client') {
        return "Sign In as Client";
      } else {
        return "Sign In as Photographer";
      }
    }
    return "Sign In";
  };

  // Custom description based on role
  const getSignInDescription = () => {
    if (hideOtherRoles) {
      if (role === 'client') {
        return "Find and connect with aerial photographers";
      } else {
        return "Join our community of aerial creators";
      }
    }
    return "Choose your role and sign in method";
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{getSignInHeading()}</CardTitle>
          <CardDescription>{getSignInDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hideOtherRoles ? (
            <RadioGroup
              defaultValue={role}
              onValueChange={(value) => setRole(value as 'client' | 'photographer')}
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="client" id="client" />
                <label htmlFor="client">I'm a Client</label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="photographer" id="photographer" />
                <label htmlFor="photographer">I'm a Photographer</label>
              </div>
            </RadioGroup>
          ) : (
            <div className="border rounded-md p-4 bg-muted/30">
              {role === 'client' ? (
                <div className="flex items-center justify-between">
                  <span>Signing in as Client</span>
                  <Link 
                    href="/signin" 
                    className="text-xs text-primary hover:underline"
                  >
                    Change role
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>Signing in as Photographer</span>
                  <Link 
                    href="/signin" 
                    className="text-xs text-primary hover:underline"
                  >
                    Change role
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2 pt-2">
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('google-oauth2')}
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
              Continue with Google
            </Button>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('apple')}
            >
              <svg width="20" height="20" viewBox="0 0 100 100">
                <path d="M65.87,50.3c-0.08-8.11,6.63-12.07,6.94-12.25c-3.8-5.56-9.68-6.31-11.77-6.38c-4.97-0.51-9.77,2.97-12.3,2.97 c-2.56,0-6.46-2.92-10.62-2.83c-5.44,0.08-10.51,3.22-13.31,8.13c-5.74,9.96-1.46,24.66,4.07,32.72c2.73,3.91,5.94,8.29,10.15,8.14 c4.09-0.17,5.63-2.62,10.57-2.62c4.89,0,6.31,2.62,10.59,2.53c4.39-0.08,7.16-3.94,9.81-7.88c3.13-4.48,4.41-8.9,4.47-9.13 C74.32,63.53,65.97,60.11,65.87,50.3z" fill="black"/>
                <path d="M59.02,30.35c2.22-2.73,3.73-6.48,3.32-10.26c-3.21,0.14-7.17,2.16-9.47,4.84c-2.04,2.39-3.86,6.27-3.38,9.95 C53.01,35.17,56.72,33.09,59.02,30.35z" fill="black"/>
              </svg>
              Continue with Apple
            </Button>
          </div>
          
          <div className="flex items-center gap-2 py-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          
          <Button 
            className="w-full"
            onClick={handleRegularLogin}
          >
            Continue with Email
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            href={hideOtherRoles ? `/signup?role=${role}&hideOtherRoles=true` : "/signup"} 
            className="text-primary hover:underline ml-1"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

// Main component with Suspense
export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>}>
      <SignInForm />
    </Suspense>
  );
}

