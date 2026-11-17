/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#070a12', 900: '#0b0f1a', 800: '#121828', 700: '#1b2236', 600: '#2a3350' },
        paper: { DEFAULT: '#eef2ff', dim: '#b9c1dc', mute: '#7d86a6' },
        signal: { DEFAULT: '#b8f05a', deep: '#6f9a1f' },
        pulse: { DEFAULT: '#ff6b5e', deep: '#a8372d' },
        ping: { DEFAULT: '#5cc8ff', deep: '#1d7fae' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
