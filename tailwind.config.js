/** @type {import('tailwindcss').Config} */
export default {
  // 1. Habilitar el modo oscuro basado en una clase en el tag <html>
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#122C43", // Azul oscuro
        "brand-accent": "#FECD29", // Amarillo/Dorado

        "ui-white": "#FFFFFF",
        "ui-off-white": "#F8F9FA",

        "ui-text-primary": "#1A1A1A", // Negro suave
        "ui-text-secondary": "#555555", // Gris oscuro

        "ui-gray-medium": "#A0A0A0",
        "ui-gray-light": "#E0E0E0",

        "feedback-success": "#00B894",
        "feedback-error": "#D63031",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};