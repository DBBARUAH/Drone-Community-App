'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AuthErrorBoundaryProps {
  children: React.ReactNode
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [errorInfo, setErrorInfo] = useState<string>('')
  const pathname = usePathname()

  useEffect(() => {
    // Reset error state when pathname changes (user navigates away)
    setHasError(false)
    setErrorInfo('')
  }, [pathname])

  useEffect(() => {
    // Handle Auth0 specific errors by listening to unhandled promise rejections
    const handleAuthError = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Check if this is an Auth0 error
      if (
        event.reason?.message?.includes('secret') ||
        event.reason?.message?.includes('Auth0') ||
        event.reason?.name === 'Auth0Error'
      ) {
        console.log('Auth0 error detected, showing fallback UI')
        setHasError(true)
        setErrorInfo(event.reason?.message || 'Authentication error')
        
        // Prevent the default error handling
        event.preventDefault()
      }
    }

    // Add event listener for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleAuthError)
    
    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleAuthError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              There was a problem with the authentication service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You can continue browsing the site as a guest, or try again later.
              {errorInfo && (
                <span className="block mt-2 text-sm text-muted-foreground">
                  Error details: {errorInfo}
                </span>
              )}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 