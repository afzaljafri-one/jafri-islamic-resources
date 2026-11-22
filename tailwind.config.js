/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030814',
          900: '#071124',
          850: '#0b1933',
          800: '#102242',
          700: '#18325e',
          600: '#23447c',
        },
        gold: {
          300: '#f4df8a',
          400: '#e5c963',
          500: '#d4af37', // Regal Islamic Gold
          600: '#b89426',
          700: '#947417',
          glow: 'rgba(212, 175, 55, 0.15)',
        },
        parchment: {
          50: '#fdfcf9',
          100: '#f8f5ee',
          200: '#efe9dc',
          300: '#e2d8c3',
        },
        emerald: {
          850: '#0b382b',
          900: '#072b21',
        },
      },
      fontFamily: {
        quran: ['"Amiri Quran"', '"Amiri"', 'serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 1px 3px rgba(212, 175, 55, 0.2)',
        'gold-md': '0 4px 14px rgba(212, 175, 55, 0.18)',
        'gold-lg': '0 8px 24px rgba(212, 175, 55, 0.22)',
      },
    },
  },
  plugins: [],
};
