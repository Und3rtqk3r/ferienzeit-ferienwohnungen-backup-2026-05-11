import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        // Warme Naturpalette — ruhiger Spreewald-Ton
        parchment: "#F5F1E8",     // Hintergrund
        cream: "#FBF9F4",         // heller Hintergrund
        ink: "#1C2620",           // Haupttext (tiefes Waldgrün-Schwarz)
        moss: {
          50: "#EEF0EA",
          100: "#D9DECF",
          200: "#B4BFA3",
          300: "#8A9876",
          400: "#6B7D58",
          500: "#5A6B4F",         // Akzent
          600: "#48593F",
          700: "#3A4734",
          800: "#2C3A2A",
          900: "#1F2A1D",
        },
        sand: {
          50: "#FAF5EB",
          100: "#F0E6D2",
          200: "#E2D3B0",
          300: "#CDB582",
          400: "#B6955A",
          500: "#8B6F47",         // warme Akzentfarbe
          600: "#6E5836",
          700: "#544229",
        },
        stone: {
          muted: "#A9A391",
          soft: "#DCD6C6",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-figtree)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(28, 38, 32, 0.04), 0 12px 30px rgba(28, 38, 32, 0.06)",
        card: "0 1px 2px rgba(28, 38, 32, 0.04), 0 8px 24px rgba(28, 38, 32, 0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out both",
        "fade-in": "fadeIn 1s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
