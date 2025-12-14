/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ca8a04', // Q7 Gold/Yellowish
        'primary-dark': '#a16207',
        'secondary': '#111827',
        'accent': '#34d399',
        'neutral': '#f3f4f6',
        'base-100': '#ffffff',
        'base-200': '#e5e7eb',
      },
    },
  },
  plugins: [],
}