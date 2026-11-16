# Pricing Masterclass: Lectures 1 and 2 (source)

    npm install
    npm run dev      # serves ../config.js at /config.js in dev, like GitHub Pages does
    npm test         # finance formula tests
    npm run build    # outputs dist/ — copy its contents into ../pricing-masterclass/ to publish

- Keys: ← → / PageUp / PageDown navigate, F = full screen. Presenter view = notes in a second window.
- Challenge page: QR code for student submissions + results wall (Ably via the repo's existing config.js; falls back to same-browser mode).
- Answer key: keep `answer-key*.json` local (gitignored). Load it in Presenter view.
- Brolan photo: `public/assets/clearx-hero.jpg`; video IDs/links: `src/config/assets.ts`.
- Lecture 2 (`src/modules/lecture2/`, route `#/lecture-2`): 13 short, concept-and-example slides on the psychology of price (value, objectives, competition, skimming vs penetration, prestige, odd-even, anchoring, price lining, launch tactics, ethics). No calculations and no class activities, so teams have time for their simulation. Nothing there reveals the Lecture 1 challenge answers.
- Chalk sound: a chalk tap + soft grainy drag, synthesised in code (`src/lib/chalk.ts`, tested in `chalk.test.ts`), triggered by `<Scribble/>`; M toggles it.
- Add another lecture by creating `src/modules/lectureN/` and registering it in `src/modules/index.ts`.
