/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f2f8fc',
          100: '#e6f1fa',
          200: '#c5e0f4',
          300: '#9ec9ec',
          400: '#67a8df',
          500: '#3c88d1',
          900: '#223f62',
          800: '#254f7d',
          700: '#295c96',
          600: '#2f6fb7',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
