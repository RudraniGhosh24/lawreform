/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // lawreformer.com purple theme
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
          950: '#3b0764',
        },
        surface: {
          DEFAULT: '#faf8ff',
          card: '#ffffff',
          muted: '#f5f3ff',
        },
        text: {
          DEFAULT: '#1a1a2e',
          muted: '#6b7280',
          light: '#9ca3af',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9333ea, #7c3aed, #6d28d9)',
        'brand-gradient-r': 'linear-gradient(to right, #a855f7, #7c3aed)',
      },
    },
  },
  plugins: [],
}
