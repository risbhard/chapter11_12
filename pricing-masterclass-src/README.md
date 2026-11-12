# Pricing Masterclass — Lecture 1 (source)

    npm install
    npm run dev      # serves ../config.js at /config.js in dev, like GitHub Pages does
    npm test         # finance formula tests
    npm run build    # outputs dist/ — copy its contents into ../pricing-masterclass/ to publish

- Keys: ← → / PageUp / PageDown navigate, F = full screen. Presenter view = notes in a second window.
- Challenge page: QR code for student submissions + results wall (Ably via the repo's existing config.js; falls back to same-browser mode).
- Answer key: keep `answer-key*.json` local (gitignored). Load it in Presenter view.
- Brolan photo: `public/assets/clearx-hero.jpg`; video IDs/links: `src/config/assets.ts`.
- Add Lecture 2 by creating `src/modules/lecture2/` and registering it in `src/modules/index.ts`.
