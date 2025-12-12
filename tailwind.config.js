/** @type {import('tailwindcss').Config} */
export default {
  // 1. Habilitar el modo oscuro basado en una clase en el tag <html>
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}, ./index.css"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
