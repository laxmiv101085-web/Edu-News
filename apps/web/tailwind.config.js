const tokens = require("./design/tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        neutral: tokens.colors.neutral,
        accent: tokens.colors.accent,
        bg: tokens.colors.semantic.bg,
        surface: tokens.colors.semantic.surface,
        border: tokens.colors.semantic.border,
        "text-primary": tokens.colors.semantic.textPrimary,
        "text-muted": tokens.colors.semantic.textMuted,
        success: tokens.colors.semantic.success,
        warning: tokens.colors.semantic.warning,
        danger: tokens.colors.semantic.danger,
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui"],
      },
      spacing: tokens.spacing,
      borderRadius: {
        none: "0px",
        DEFAULT: tokens.radius.md,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
        "2xl": tokens.radius["2xl"],
        "3xl": tokens.radius["3xl"],
        sm: tokens.radius.sm,
        full: tokens.radius.round,
      },
      boxShadow: {
        soft: tokens.elevation.soft,
        medium: tokens.elevation.medium,
        deep: tokens.elevation.deep,
      },
      keyframes: {
        "card-float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-fade": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        float: "card-float 6s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
        "slide-fade": "slide-fade 0.4s ease forwards",
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
};
