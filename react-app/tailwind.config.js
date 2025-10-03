/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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
          600: '#2f6fb7',
          700: '#295c96',
          800: '#254f7d',
          900: '#223f62',
        },
        gold: {
          50: '#fff8e7',
          100: '#ffefc1',
          200: '#ffe08a',
          300: '#ffd157',
          400: '#f4b72f',
          500: '#d79b17',
          600: '#b27b11',
          700: '#8c5c0f',
          800: '#6e470f',
          900: '#583a10',
        },
        luxury: {
          forest: '#1f2d26',
          forestLight: '#2d3d34',
          mist: '#f5f3ef',
          sand: '#d9c6b0',
          sandLight: '#efe3d5',
          // Accent remapped to footer blue
          accent: '#223f62',
          accentDark: '#295c96',
          white: '#ffffff'
        }
      },
      fontFamily: {
        // Body: Poppins, Headings: Playfair Display (serif)
        display: ['"Playfair Display"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 8px 30px rgba(215, 155, 23, 0.35)',
  'card-xl': '0 20px 60px -20px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
