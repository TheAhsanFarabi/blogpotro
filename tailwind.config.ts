import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#FAF7F2",
          50: "#FFFDF9",
          100: "#FAF7F2",
          200: "#F4EFE6",
          300: "#EAE3D5",
          400: "#DBD2C0",
          dark: "#18181B",
        },
        ink: {
          DEFAULT: "#18181B",
          primary: "#18181B",
          secondary: "#52525B",
          muted: "#8C857B",
          border: "#18181B",
          "border-soft": "#E2DACB",
          bg: "#FAF7F2",
          base: "#FFFFFF",
          elevated: "#F5F0E6",
          overlay: "#EBE3D3",
        },
        pastel: {
          amber: {
            DEFAULT: "#F59E0B",
            light: "#FEF3C7",
            solid: "#FDE68A",
            dark: "#92400E",
          },
          violet: {
            DEFAULT: "#8B5CF6",
            light: "#F3E8FF",
            solid: "#DDD6FE",
            dark: "#5B21B6",
          },
          mint: {
            DEFAULT: "#10B981",
            light: "#ECFDF5",
            solid: "#A7F3D0",
            dark: "#065F46",
          },
          rose: {
            DEFAULT: "#F43F5E",
            light: "#FFF1F2",
            solid: "#FECDD3",
            dark: "#9F1239",
          },
          sky: {
            DEFAULT: "#0284C7",
            light: "#F0F9FF",
            solid: "#BAE6FD",
            dark: "#0369A1",
          },
          cream: {
            DEFAULT: "#FEF9C3",
            light: "#FEFCE8",
            solid: "#FEF08A",
            dark: "#854D0E",
          },
        },
        amber: {
          DEFAULT: "#F59E0B",
          dim: "#FEF3C7",
          bright: "#D97706",
          solid: "#FDE68A",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          dim: "#F3E8FF",
          bright: "#7C3AED",
          solid: "#DDD6FE",
        },
        seed: "#10B981",
        growing: "#F59E0B",
        published: "#8B5CF6",
      },
      boxShadow: {
        "neo-xs": "1.5px 1.5px 0px #18181B",
        "neo-sm": "2px 2px 0px #18181B",
        neo: "3px 3px 0px #18181B",
        "neo-md": "4px 4px 0px #18181B",
        "neo-lg": "6px 6px 0px #18181B",
        "neo-xl": "8px 8px 0px #18181B",
        "neo-mint": "3px 3px 0px #065F46",
        "neo-amber": "3px 3px 0px #92400E",
        "neo-violet": "3px 3px 0px #5B21B6",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: { "0%,100%": { opacity: "0.7" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
