/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nasa: {
          blue: '#0b3d91',
          red: '#fc3d21',
          white: '#ffffff',
          gray: '#e5e5e5',
          'dark-gray': '#5a6670',
          black: '#000000',
        },
        space: {
          'deep-space': '#000814',
          'cosmic-blue': '#001d3d',
          'star-gold': '#ffd60a',
          'nebula-purple': '#7209b7',
          'comet-blue': '#4cc9f0',
          'asteroid-orange': '#f77f00',
          'planet-green': '#2a9d8f',
          'ring-saturn': '#e9c46a',
        },
        panel: {
          bg: 'rgba(11, 61, 145, 0.85)',
          border: 'rgba(255, 214, 10, 0.3)',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        titillium: ['Titillium Web', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

