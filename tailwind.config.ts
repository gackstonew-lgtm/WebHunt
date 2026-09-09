import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "#0251B8", // Exact Yardly Brand Blue
          foreground: "#FFFFFF",
          hover: "#013F92",
          50: "#e6f0fa",
          100: "#cce0f5",
          200: "#99c2eb",
          300: "#66a3e0",
          400: "#3385d6",
          500: "#0251B8",
          600: "#0251B8",
          700: "#013F92",
          800: "#012f6e",
          900: "#01204d",
          950: "#001029",
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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Map slate/neutral classes to Yardly green-black and green-charcoal neutrals
        slate: {
          50: "#EAF2EE",
          100: "#D3E3DA",
          200: "#B8D2C4",
          300: "#9FBEAE",
          400: "#8AA79A", // Muted text token (#8AA79A)
          500: "#638475",
          600: "#456254",
          700: "#2B4439",
          800: "rgba(120, 200, 170, 0.14)", // Green-tinted hairline border
          850: "#16302A",                   // Accent / hover surface
          900: "#111F1A",                   // Raised green-charcoal card
          950: "#0B1512",                   // Deep green-black background
        },
        // Brand Green family for positive indicators
        emerald: {
          400: "#5EBA8C",
          500: "#3FA372",
          600: "#2B7E55",
        },
        // Yardly specific semantic tokens
        yardly: {
          bg: "#0B1512",
          card: "#111F1A",
          surface: "#0F1A16",
          hover: "#16302A",
          text: "#EAF2EE",
          muted: "#8AA79A",
          blue: "#0251B8",
          green: "#3FA372",
          border: "rgba(120, 200, 170, 0.14)",
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
