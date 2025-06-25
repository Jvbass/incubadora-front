// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que mire en todos los archivos dentro de src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }