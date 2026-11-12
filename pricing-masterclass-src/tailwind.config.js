/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0e1013', 900: '#14171c', 800: '#1b1f26', 700: '#262b34', 600: '#343a46' },
        paper: { DEFAULT: '#f3ebdd', dim: '#c9c1b3', mute: '#8f897d' },
        teal: { DEFAULT: '#47c2b5', deep: '#1f7a72' },
        gold: { DEFAULT: '#e6b655', deep: '#a77c25' },
        copper: { DEFAULT: '#d98258', deep: '#8c4a2c' },
        chalk: '#e9e4d8',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
