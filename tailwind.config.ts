import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FBF7EC",
          100: "#F5ECCE",
          200: "#EBDA9E",
          300: "#E0C76D",
          400: "#C6A84E",
          500: "#A88A32",
          600: "#856C27",
          700: "#63501D",
          800: "#423613",
          900: "#211B0A",
        },
        charcoal: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#b0b0b0",
          300: "#808080",
          400: "#606060",
          500: "#404040",
          600: "#303030",
          700: "#222222",
          800: "#1a1a1a",
          900: "#111111",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "grain": "grain 8s steps(10) infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C6A84E 0%, #E0C76D 50%, #A88A32 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
