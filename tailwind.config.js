/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/styles/**/*.css',
    "./globals.css",
    "./lib/**/*.{js,ts}",
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
      animation: {
        'marquee-slower': 'marquee var(--duration) linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
      },
      keyframes: {
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
        background: "#000000",
        foreground: "#ffffff",
        "muted-foreground": "#fafafa",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}; 