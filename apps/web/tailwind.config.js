/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5fbff",
          100: "#e6f7ff",
          200: "#bfeaff",
          300: "#99ddff",
          400: "#66c7ff",
          500: "#3392ff",
          600: "#0a6eed",
          700: "#0456c2",
          800: "#034296",
          900: "#012b63",
        },
        accent: {
          50:  "#fff8fb",
          100: "#ffeff6",
          300: "#ffb3ea",
          500: "#ff6fd1",
          700: "#da2b9a",
        },
      },
      boxShadow: {
        soft: "0 6px 24px rgba(12, 19, 50, 0.08)",
        glow: "0 8px 30px rgba(51,146,255,0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in-up": "fadeInUp .6s ease both",
      },
    },
  },
  plugins: [],
};

