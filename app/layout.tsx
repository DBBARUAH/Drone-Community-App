// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://travellersbeats.com'),
  title: {
    default: 'Travellers Beats',
    template: '%s | Travellers Beats'
  },
  description: 'Drone Photography and Videography Community',
  openGraph: {
    title: 'Travellers Beats',
    description: 'Drone Photography and Videography Community',
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
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}