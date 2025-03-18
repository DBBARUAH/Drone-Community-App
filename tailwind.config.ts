import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const tailwindConfig: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/styles/**/*.css',
    "./globals.css",
    "./lib/**/*.{js,ts}",
    './app/blog/content/**/*.mdx',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxWidth: {
        container: "1280px",
      },
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        'marquee-slower': 'marquee var(--duration) linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
      },
      keyframes: {
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
      },
      colors: {
        background: "#000000",       // or whatever main background you want
        foreground: "#ffffff",       // or your main text color
        "muted-foreground": "#fafafa",  // for secondary or muted text
        border: "hsl(var(--border))",        // Added from JS config
        input: "hsl(var(--input))",          // Added from JS config
        ring: "hsl(var(--ring))",            // Added from JS config
        primary: {                           // Added from JS config
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {                         // Added from JS config
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {                       // Added from JS config
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {                             // Added from JS config
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {                            // Added from JS config
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {                           // Added from JS config
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {                              // Added from JS config
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {                        // Added from JS config
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {                          // Added from JS config
        DEFAULT: {
          css: {
            color: 'rgb(255, 255, 255, 0.9)',
            a: {
              color: 'rgb(255, 255, 255)',
              '&:hover': {
                color: 'rgb(255, 255, 255, 0.8)',
              },
            },
            h1: { color: 'rgb(255, 255, 255)' },
            h2: { color: 'rgb(255, 255, 255)' },
            h3: { color: 'rgb(255, 255, 255)' },
            h4: { color: 'rgb(255, 255, 255)' },
            strong: { color: 'rgb(255, 255, 255)' },
            blockquote: {
              color: 'rgb(255, 255, 255, 0.8)',
              borderLeftColor: 'rgb(255, 255, 255, 0.2)',
            },
            code: { color: 'rgb(255, 255, 255)' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: 'rgb(0, 0, 0, 0.5)' },
            hr: { borderColor: 'rgb(255, 255, 255, 0.2)' },
            ul: {
              li: {
                '&::marker': {
                  color: 'rgb(255, 255, 255, 0.6)',
                },
              },
            },
            table: {
              thead: {
                borderBottomColor: 'rgb(255, 255, 255, 0.2)',
                th: { color: 'rgb(255, 255, 255)' },
              },
              tbody: {
                tr: {
                  borderBottomColor: 'rgb(255, 255, 255, 0.1)',
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    require("@tailwindcss/typography"),
  ],
};

export default tailwindConfig;