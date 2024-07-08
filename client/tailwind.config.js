/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green": "#47CA4C",
        "greenDark": "#3CAD40"
      }
    },
  },
  plugins: [],
  darkMode: "selector"
}

