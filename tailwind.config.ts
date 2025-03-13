import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const tailwindConfig: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/styles/**/*.{css}",
    "./globals.css",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      // maxWidth: {
      //   container: "1280px",
      // },
      animation: {
        // 'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        // 'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
          marquee: 'marquee var(--duration) linear infinite',
      },
      keyframes: {
        // 'spin-around': {
        //   '0%': { transform: 'translateZ(0) rotate(0)' },
        //   '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
        //   '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
        //   '100%': { transform: 'translateZ(0) rotate(360deg)' },
        // },
        // 'shimmer-slide': {
        //   to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        // },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
      },
      colors: {
        background: "#000000",       // or whatever main background you want
        foreground: "#ffffff",       // or your main text color
        "muted-foreground": "#fafafa",  // for secondary or muted text
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default tailwindConfig;