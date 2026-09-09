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
        paper: "#F6F4F1",
        stone: {
          DEFAULT: "#E4DED2",
          50: "#FAF8F5",
          100: "#F6F4F1",
          200: "#E4DED2",
          300: "#D2C9B9",
          400: "#A8A196",
          500: "#7E786E",
          600: "#57524A",
          700: "#36332E",
          800: "#1E1C19",
          900: "#0D0D0D",
        },
        coral: {
          DEFAULT: "#F95C4B",
          50: "#FFF1F0",
          100: "#FFE1DE",
          200: "#FFC4BE",
          300: "#FFA095",
          400: "#FF7565",
          500: "#F95C4B",
          600: "#E04838",
          700: "#B83224",
          800: "#912317",
          900: "#6B170E",
          950: "#3B0803",
        },
        primary: {
          DEFAULT: "#F95C4B", // Exact WebHunt Coral
          foreground: "#FFFFFF",
          hover: "#E04838",
          50: "#FFF1F0",
          100: "#FFE1DE",
          200: "#FFC4BE",
          300: "#FFA095",
          400: "#FF7565",
          500: "#F95C4B",
          600: "#E04838",
          700: "#B83224",
          800: "#912317",
          900: "#6B170E",
          950: "#3B0803",
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
        // Map slate/neutral classes to WebHunt monochromatic pure dark surfaces
        slate: {
          50: "#F6F4F1",
          100: "#E4DED2",
          200: "#D2C9B9",
          300: "#A8A196",
          400: "#A8A196", // Muted text token (#A8A196)
          500: "#7E786E",
          600: "#57524A",
          700: "#36332E",
          800: "rgba(228, 222, 210, 0.12)", // Hairline stone border
          850: "#161616",                   // Elevated hover surface
          900: "#0D0D0D",                   // Raised dark card
          950: "#000000",                   // Deep black background
        },
        // Semantic green for phone / verified status
        emerald: {
          400: "#5EBA8C",
          500: "#3FA372",
          600: "#2B7E55",
        },
        // WebHunt specific tokens
        webhunt: {
          bg: "#000000",
          card: "#0D0D0D",
          surface: "#080808",
          hover: "#161616",
          paper: "#F6F4F1",
          stone: "#E4DED2",
          muted: "#A8A196",
          coral: "#F95C4B",
          coralHover: "#E04838",
          border: "rgba(228, 222, 210, 0.12)",
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
