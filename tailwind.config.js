/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/styles/**/*.css',
    "./globals.css",
    "./lib/**/*.{js,ts}",
    './app/blog/content/**/*.mdx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
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
        'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        'marquee-slower': 'marquee var(--duration) linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
      },
      keyframes: {
        'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
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
        background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
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
        chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
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
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        heading: ['var(--font-oswald)', 'Oswald', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    nextui({
      addCommonColors: true,
      defaultTheme: "dashboard",
      defaultExtendTheme: "dashboard",
      layout: {
        spacingUnit: 4, // in px
        disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
        dividerWeight: "1px", // h-divider the default height applied to the divider component
      },
      themes: {
        light: {
          layout: {
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
          },
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#e6f1fe",
              100: "#cce3fd",
              200: "#99c7fb",
              300: "#66aaf9",
              400: "#338ef7",
              500: "#0072F5",
              600: "#005bc4",
              700: "#004493",
              800: "#002e62",
              900: "#001731",
              DEFAULT: "#0072F5",
              foreground: "#FFFFFF",
            },
            focus: "#0072F5",
          },
        },
        dark: {
          layout: {
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
          },
          colors: {
            background: "#000000",
            foreground: "#ECEDEE",
            primary: {
              50: "#e6f1fe",
              100: "#cce3fd",
              200: "#99c7fb",
              300: "#66aaf9",
              400: "#338ef7", 
              500: "#0072F5",
              600: "#005bc4",
              700: "#004493",
              800: "#002e62",
              900: "#001731",
              DEFAULT: "#0072F5",
              foreground: "#FFFFFF",
            },
            focus: "#0072F5",
          },
        },
        // Custom theme for dashboard
        dashboard: {
          extend: "dark",
          layout: {
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
          },
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            primary: {
              50: "#e6f1fe",
              100: "#cce3fd",
              200: "#99c7fb",
              300: "#66aaf9",
              400: "#338ef7",
              500: "#0072F5",
              600: "#005bc4",
              700: "#004493",
              800: "#002e62",
              900: "#001731",
              DEFAULT: "#0072F5",
              foreground: "#FFFFFF",
            },
            focus: "#0072F5",
            default: {
              100: "#222222",
              200: "#333333",
              300: "#444444",
              400: "#555555",
              500: "#666666",
              600: "#777777",
              700: "#888888",
              800: "#999999",
              900: "#AAAAAA",
            }
          },
        },
      },
    }),
  ],
}; 