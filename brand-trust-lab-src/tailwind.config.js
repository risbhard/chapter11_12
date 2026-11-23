/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#F6F0E4', deep: '#EDE4D2', line: '#D9CDB6' },
        ink: { DEFAULT: '#221F1B', soft: '#4A443C', mute: '#7A7165' },
        copper: { DEFAULT: '#B0602A', deep: '#8A4A1F', soft: '#E9C9AE' },
        amber: { DEFAULT: '#D9A441' },
        sage: { DEFAULT: '#4F7A5A', soft: '#D5E2D3' },
        brick: { DEFAULT: '#A8452F', soft: '#F0D2C8' },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk Variable"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
