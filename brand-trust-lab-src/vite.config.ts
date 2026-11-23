import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fully offline lecture: no Ably, no backend. Build output sits beside this folder, like the other chapters.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: '../brand-trust-lab', emptyOutDir: true, chunkSizeWarningLimit: 1200 },
})
