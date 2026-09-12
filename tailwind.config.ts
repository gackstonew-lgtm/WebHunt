import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          '"Plus Jakarta Sans"',
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        'lg': '10px',
        'xl': '14px',
        '2xl': '18px',
        '3xl': '22px',
        'pill': '9999px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          subtle: "var(--surface-subtle)",
          secondary: "var(--surface-secondary)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          inner: "var(--card-inner)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        // Arcade FX / Phantom Institutional Slate scale
        slate: {
          50: "#F5F5F7",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#989BA3",  // Arcade FX dark muted text
          500: "#7D8EAA",  // Arcade FX dark tertiary text
          600: "#475569",
          700: "#334155",
          800: "#18191D",  // Arcade FX elevated surface
          850: "#141518",
          900: "#111214",  // Arcade FX dark surface
          950: "#08090B",  // Arcade FX dark canvas background
        },
        // Subtle restrained status colors
        emerald: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        // Arcade FX Design Tokens
        arcade: {
          canvas: "#08090B",
          surface: "#111214",
          elevated: "#18191D",
          platinum: "#EEEEEE",
          silver: "#989BA3",
          lightBg: "#F5F5F7",
          lightSurface: "#FFFFFF",
          lightSecondary: "#F0F0F3",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
        subtle: "var(--border-subtle)",
        strong: "var(--border-strong)",
      },
    },
  },
  plugins: [],
};
export default config;
