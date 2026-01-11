/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deloitte-green': '#86BC25',
        'deloitte-dark': '#2C2C2C',
        'deloitte-charcoal': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
