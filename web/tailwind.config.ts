import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ========================================
         SpurTalk Color Palette
         ======================================== */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Warning replaces destructive for psychological safety
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        attention: {
          DEFAULT: "hsl(var(--attention))",
          foreground: "hsl(var(--attention-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        // Keep destructive mapped to warning (amber, not red!)
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      
      /* ========================================
         Border Radius Scale
         ======================================== */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-xl)",
      },
      
      /* ========================================
         Typography
         ======================================== */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      
      fontSize: {
        "h1": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "h2": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "h3": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "subheader": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "body": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-small": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      
      /* ========================================
         Spacing (4px base unit)
         ======================================== */
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      
      /* ========================================
         Animation Keyframes
         ======================================== */
      keyframes: {
        "gentle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        "sparkle-burst": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.2) rotate(8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "bloom": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-slide": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      /* ========================================
         Animation Utilities
         ======================================== */
      animation: {
        "gentle-pulse": "gentle-pulse 1.5s ease-in-out infinite",
        "sparkle-burst": "sparkle-burst 500ms ease-out forwards",
        "bloom": "bloom 800ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-slide": "fade-slide 400ms ease-out forwards",
        "shimmer": "shimmer 1.5s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      
      /* ========================================
         Box Shadows
         ======================================== */
      boxShadow: {
        "subtle": "0 1px 3px rgba(0, 0, 0, 0.05)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "glow-primary": "0 0 20px hsl(174 62% 40% / 0.3)",
        "glow-success": "0 0 20px hsl(160 84% 39% / 0.3)",
      },
      
      /* ========================================
         Transitions
         ======================================== */
      transitionDuration: {
        "micro": "200ms",
        "standard": "400ms",
        "emphasis": "600ms",
      },
      
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
