/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF7F0',
          100: '#FFEAD9',
          200: '#FFD4B3',
          300: '#FFB380',
          400: '#FF8C4D',
          500: '#FF6B1A',
          600: '#E55A0A',
          700: '#B84500',
          800: '#8A3300',
          900: '#5C2200',
        },
        offwhite: '#FAFAF7',
        charcoal: '#1C1C1E',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
