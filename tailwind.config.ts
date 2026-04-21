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
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        ink: {
          bg: "#07070a",
          base: "#0d0d12",
          elevated: "#141419",
          overlay: "#1c1c24",
          border: "rgba(255,255,255,0.07)",
          "border-md": "rgba(255,255,255,0.12)",
          "border-strong": "rgba(255,255,255,0.2)",
          primary: "#f4f1eb",
          secondary: "#a09a8e",
          muted: "#5e5a55",
        },
        amber: {
          DEFAULT: "#e8a045",
          dim: "rgba(232,160,69,0.12)",
          bright: "#f5b865",
        },
        violet: {
          DEFAULT: "#9d7cff",
          dim: "rgba(157,124,255,0.12)",
          bright: "#b89dff",
        },
        seed: "#6bcb77",
        growing: "#e8a045",
        published: "#9d7cff",
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        "slide-up": "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
