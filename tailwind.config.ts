import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Scouts brand colors
        scouts: {
          purple: '#7413dc',
          navy: '#003982',
          teal: '#00a794',
          pink: '#f394c0',
          red: '#e22027',
          green: '#23a950',
          yellow: '#ffe627',
        },
        // Semantic colors based on Scouts brand
        primary: {
          DEFAULT: '#7413dc',
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4a9ff',
          400: '#a877ff',
          500: '#8f45ff',
          600: '#7413dc',
          700: '#6310c2',
          800: '#520e9e',
          900: '#440c82',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito-sans)', 'Nunito Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
