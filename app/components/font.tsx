'use client'

import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Define Inter font with all weights
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export function FontProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  useEffect(() => {
    // Apply specific font styles for dashboard
    if (isDashboard) {
      document.documentElement.classList.add('dashboard-fonts')
      
      // This ensures NextUI components inherit Inter font
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --font-sans: var(--font-inter);
        }
        body, button, input, select, textarea, h1, h2, h3, h4, h5, h6, p, span, div, a {
          font-family: var(--font-inter) !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.documentElement.classList.remove('dashboard-fonts')
        document.head.removeChild(style)
      }
    }
  }, [isDashboard])

  return (
    <div className={inter.variable}>
      {children}
    </div>
  )
} 