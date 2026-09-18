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
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
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
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        }
      },
      borderColor: {
        DEFAULT: "var(--border)",
        subtle: "var(--border-subtle)",
        strong: "var(--border-strong)",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        'glass-hover': '0 16px 40px -8px rgba(45, 125, 255, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.8)',
        'floating': '0 20px 40px -15px rgba(0, 0, 0, 0.9)',
        'glow': '0 0 25px rgba(45, 125, 255, 0.25)',
        'glow-red': '0 0 25px rgba(255, 59, 78, 0.25)',
        'glow-lg': '0 0 40px rgba(45, 125, 255, 0.35)',
        'brand-btn': '0 4px 20px rgba(45, 125, 255, 0.25)',
        'red-btn': '0 4px 20px rgba(255, 59, 78, 0.25)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0251B8 0%, #2D7DFF 100%)',
        'red-gradient': 'linear-gradient(135deg, #DE0F1F 0%, #FF3B4E 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
