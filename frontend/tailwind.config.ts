import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            50:  '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
          },
          blue: {
            50:  '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
          },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #dbeafe 100%)',
        'card-gradient': 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)',
      },
    },
  },
  plugins: [],
}
export default config
