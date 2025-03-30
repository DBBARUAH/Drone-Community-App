'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react'
import { FontProvider } from '@/components/font'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <FontProvider>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </FontProvider>
    </NextThemesProvider>
  )
} 