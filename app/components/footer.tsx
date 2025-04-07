// Footer.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Instagram, Youtube, ExternalLink, ChevronRight } from "lucide-react";

// Custom TikTok icon since it's not available in lucide-react
function TikTokIcon({ size = 20, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4c5 0 5 6 8 7" />
    </svg>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 md:py-12 border-t border-border/30 transition-colors">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center md:items-stretch md:grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start space-y-6 w-full max-w-sm">
            <div className="text-center md:text-left w-full">
              <h3 className="text-xl font-oswald font-bold text-foreground/90 mb-3 uppercase">TRAVELLERS BEATS</h3>
              <p className="text-sm text-foreground/70 font-playfair leading-relaxed">
                Connecting drone enthusiasts across the globe through shared passion, knowledge and experiences.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start space-x-6 w-full">
              <a 
                href="https://instagram.com/travellers.beats" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://youtube.com/@travellersbeat" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="https://www.tiktok.com/@travellers.beats" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon size={24} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div className="flex flex-col items-center md:items-start space-y-6 w-full max-w-sm">
            <h3 className="text-xl font-oswald font-bold text-foreground/90 pb-2 border-b border-border/20 uppercase w-full text-center md:text-left">
              Explore
            </h3>
            <nav className="flex flex-col items-center md:items-start space-y-4 w-full">
              <Link 
                href="/#aboutus" 
                className="group flex items-center text-sm text-foreground/70 hover:text-primary transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="font-playfair">About Us</span>
              </Link>
              <Link 
                href="/#contactus" 
                className="group flex items-center text-sm text-foreground/70 hover:text-primary transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="font-playfair">Contact</span>
              </Link>
              <Link 
                href="/blog" 
                className="group flex items-center text-sm text-foreground/70 hover:text-primary transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="font-playfair">Blog</span>
              </Link>
              <Link 
                href="/privacy" 
                className="group flex items-center text-sm text-foreground/70 hover:text-primary transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="font-playfair">Privacy Policy</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-border/10">
          <p className="text-center text-xs md:text-sm text-foreground/50 font-playfair">
            © {currentYear} Travellers Beats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
