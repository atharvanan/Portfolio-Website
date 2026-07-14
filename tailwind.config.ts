import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        muted: "#86868b",
        hair: "#d2d2d7",
        surface: "#f5f5f7",
        accent: "#0071e3",
        "accent-hover": "#0077ed",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest2: "-0.03em",
        tightest3: "-0.04em",
      },
      maxWidth: {
        content: "1024px",
        "content-wide": "1280px",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.28, 0.11, 0.32, 1) forwards",
        "fade-in-scale": "fade-in-scale 0.8s cubic-bezier(0.28, 0.11, 0.32, 1) forwards",
        "slide-in-left": "slide-in-left 0.8s cubic-bezier(0.28, 0.11, 0.32, 1) forwards",
        "slide-in-right": "slide-in-right 0.8s cubic-bezier(0.28, 0.11, 0.32, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
