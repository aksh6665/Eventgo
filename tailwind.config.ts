/** @type {import('tailwindcss').Config} */
import { withUt } from 'uploadthing/tw';

module.exports = withUt({
  darkMode: ['class', 'dark'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Adjust paths as per your project structure
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
});
