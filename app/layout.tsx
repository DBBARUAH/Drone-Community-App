// app/layout.tsx
import type React from "react"
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer";
import { Inter, Playfair_Display, Oswald } from 'next/font/google';
import { Providers } from './providers'
import { Analytics } from "@vercel/analytics/react"
// import { AuthProvider } from "@/providers/AuthProvider";

// Configure your fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  adjustFontFallback: false
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://travellersbeats.com'),
  title: {
    default: 'Travellers Beats',
    template: '%s | Travellers Beats Drone Community'
  },
  description: "Connect with passionate drone creators, explore our signature presets, inspire through your aerial artistry",
  openGraph: {
    title: 'Travellers Beats',
    description: 'Connect with passionate drone creators, explore our signature presets, inspire through your aerial artistry',
    siteName: 'Travellers Beats',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: { url: '/favicon.png' }
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <style>
          {`
            :root {
              --font-sans: var(--font-inter);
            }
          `}
        </style>
      </head>
      <body className="min-h-screen bg-background">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}