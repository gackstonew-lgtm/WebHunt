/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yardly: {
          bg: "#050505",           // Primary page background (Fading Black Canvas)
          bgDark: "#000000",       // Deepest Pure Black
          bgCard: "#121212",       // Sleek Fading Black Card Surface
          bgElevated: "#1A1A1A",   // Elevated surface / hover surface
          forestLight: "#242424",  // Subtle container surface / pill hover
          primary: "#0251B8",      // Primary Royal Blue (Logo Cobalt Blue)
          primaryLuminous: "#2D7DFF", // Dark mode luminous blue
          primaryHover: "#4D96FF", // Luminous blue hover accent
          primaryDark: "#014196",  // Deep royal blue
          accent: "#DE0F1F",       // Secondary Crimson Red (Logo Automotive Red)
          accentLuminous: "#FF3B4E", // Dark mode luminous red
          accentHover: "#FF5E6E",  // Luminous red hover accent
          highlight: "#FF808F",    // Soft red highlight
          text: "#F2F7F3",         // Primary text (Warm off-white)
          muted: "#8EA79C",        // Secondary text (Muted green-gray)
          mutedDark: "#5B7569",    // Subdued metadata text
          border: "rgba(255, 255, 255, 0.08)", // Subtle translucent micro-border
          borderGlow: "rgba(45, 125, 255, 0.3)", // Glowing blue border
          borderGlowRed: "rgba(255, 59, 78, 0.3)", // Glowing red border
          success: "#2D7DFF",
          warning: "#F59E0B",
          danger: "#DE0F1F",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
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
        'unitpay-hero': 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #121212 100%)',
        'forest-gradient': 'linear-gradient(180deg, #050505 0%, #000000 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0251B8 0%, #DE0F1F 100%)',
        'brand-gradient-dark': 'linear-gradient(135deg, #2D7DFF 0%, #FF3B4E 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0251B8 0%, #2D7DFF 100%)',
        'red-gradient': 'linear-gradient(135deg, #DE0F1F 0%, #FF3B4E 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
