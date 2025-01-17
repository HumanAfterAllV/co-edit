import type { Config } from 'tailwindcss';

const { fontFamily } = require('tailwindcss/defaultTheme');

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        xs: '360px',
      },
    },
    extend: {
      colors: {
        beige:{
          300: '#FFF9E5',
          500: '#F6ECCA',
          600: '#E4DBBA',
          700: "#DCC58C",
        },
        blue: {
          500: '#99B7DD',
          600: '#86A3C6 ',
        },
        orange:{
          500: '#EA7A54',
          600: '#D06749'
        },
        mint: {
          500: '#8ACBB7',
          600: '#78B29F '
        },
        dark: {
          100: '#010101',
          200: '#1A1A1A',
          300: '#0F1C34',
          350: '#555555',
          400: '#525252',
          500: '#2E2E2E',
        },
        neutro: {
          500: "#8A8A8A"
        },
        toxic: {
          500: "#50ffb0"
        },
        yellow: {
          100: "#e9ef1a",
          500: "#F8FE1F"
        },
        purple: {
          500: "#9C7BFE"
        }
      },
      fontFamily: {
        sans: ['var(--font-general-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        doc: 'url(/assets/images/doc.png)',
        modal: 'url(/assets/images/modal.png)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;