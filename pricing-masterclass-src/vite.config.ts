import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** dev only: serve the repo's shared ../config.js (Ably key) at /config.js, as GitHub Pages does in production */
const sharedConfig = () => ({
  name: 'shared-config',
  configureServer(server: any) {
    server.middlewares.use('/config.js', (_req: any, res: any) => {
      const f = resolve(__dirname, '../config.js')
      res.setHeader('Content-Type', 'application/javascript')
      res.end(existsSync(f) ? readFileSync(f) : '')
    })
  },
})

export default defineConfig({
  base: './',
  plugins: [react(), sharedConfig()],
  build: { chunkSizeWarningLimit: 1200 },
})
