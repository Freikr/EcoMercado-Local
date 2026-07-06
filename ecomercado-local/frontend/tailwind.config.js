/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        ecoGreen: '#2e7d32',
        ecoBrown: '#8d6e63',
      }
    },
  },
  plugins: [],
}