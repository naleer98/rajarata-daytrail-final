/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using the 'dark' class on HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rajarata: {
          50: '#fbf8f2',
          100: '#f5efe0',
          500: '#b45309',
          600: '#92400e',
          700: '#78350f',
          800: '#451a03',
          900: '#2b1002',
        },
      },
    },
  },
  plugins: [],
}