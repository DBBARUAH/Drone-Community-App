// app/layout.tsx
import type { Metadata } from "next";
import "@/globals.css"; // Make sure this file includes @tailwind directives
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/providers/AuthProvider"; // Adjust the path if needed

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // note the leading slash
  },
  title: "Travellers Beats",
  description: "Drone Photography and Videography Community",
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