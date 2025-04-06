'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ThemeProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react'
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
        <NextUIProvider>
          <AuthErrorBoundary>
            {children}
          </AuthErrorBoundary>
        </NextUIProvider>
      </ThemeProvider>
    </UserProvider>
  )
} 