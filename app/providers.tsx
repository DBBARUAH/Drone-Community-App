'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ThemeProvider } from 'next-themes'
import { HeroUIProvider } from "@heroui/react"
import { AuthErrorBoundary } from '@/components/auth/error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <HeroUIProvider>
          <AuthErrorBoundary>
            {children}
          </AuthErrorBoundary>
        </HeroUIProvider>
      </ThemeProvider>
    </UserProvider>
  )
} 