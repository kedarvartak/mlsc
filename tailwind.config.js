/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      fontWeight: {
        black: 900,
      }
    },
  },
  plugins: [],
}