# The Brand Trust Lab: Chapter 10 lecture site (source)

Instructor-led lecture, 26 screens, Vite + React + TypeScript + Tailwind. Fully offline: no Ably, no backend, no stored data.

## Navigation rule
Screens change with the **Back** / **Next** buttons (bottom-right) or the keyboard: **Right arrow / PageDown** next, **Left arrow / PageUp** back (works with presentation clickers), **F** full screen, **N** notes window, **R** reset the current screen. No wheel, swipe, timer, progress-bar or menu navigation exists in the code. Interactions inside a screen never advance the lecture. Back/Next keep each screen's state; **Reset** (top-right, where shown) restores one screen.

## Run locally
    cd brand-trust-lab-src
    npm install
    npm run dev          # http://localhost:5173
    npm run build        # writes ../brand-trust-lab

Serve the built site from the repo root: `python -m http.server 8000`, then open `/brand-trust-lab/`.

## Deploy (same pattern as the other chapters)
Built output goes in `brand-trust-lab/`, source in `brand-trust-lab-src/`, both at repo root. Commit both and push to `main`; GitHub Pages serves https://risbhard.github.io/chapter11_12/brand-trust-lab/. Root `index.html`, `config.js` and the other chapter folders are not touched.

## Edit content (no app code needed)
- `src/content/hook.ts` trust signals on the AURA AUDIO / SOUND DEALZ comparison
- `src/content/brand.ts` Sections A and B (venn, positions, pillars, real brands)
- `src/content/audit.ts` Activity 1 answers (six issues)
- `src/content/durable.ts` MACE and BlackBerry
- `src/content/trust.ts` Section E (checkout signals, review replies, mentions)
- `src/content/measure.ts` Activity 2 responses, dashboard weeks, NPS presets, closing
- Instructor notes live next to each screen at the bottom of the `src/screens/*.tsx` files. The Notes button opens them in a second, read-only window.
- Screen order: `src/screens/index.ts`.

## Notes
- All brands in the hook, audit and dashboard are fictional; all dashboard and NPS numbers are illustrative.
- Definitions and real-brand examples (Olive Garden, Best Buy, Taco Bell, eBay, H&M, BlackBerry, Visa Secure, Norton Safe Web) follow the McGraw Hill Chapter 10 slides, paraphrased with no publisher images. MACE examples use the fictional Aura Audio. The BlackBerry 2013 rename date is from general knowledge, not the slides.


## Real-brand screenshots
Screens about real brands (13, 14, 15, 18, 19, 21) can show your own screenshots. Drop images into `public/shots/` using the file names listed in `public/shots/README.txt`, rebuild, and a **Screenshots** button (key **S**) appears on that screen. Arrow keys switch images; S or Esc closes. Screens without images look exactly as before. Fictional brands (Aura Audio, Sound Dealz, Volta & Co.) stay fictional and have no screenshots.
