/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c2dbff',
          300: '#94beff',
          400: '#5e99ff',
          500: '#0b66ff',
          600: '#004fe0',
          700: '#003eb8',
          800: '#003594',
          900: '#052a75',
          950: '#031745',
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
