/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: '#F5E6E8',
        gold: '#C9A96E',
        'gold-light': '#E8D5A8',
        ivory: '#FFFFF0',
      },
    },
  },
  plugins: [],
};
