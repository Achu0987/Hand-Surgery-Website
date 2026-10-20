# Traverso Hand: website prototype

Prototype of a patient-first site for Dr. Purnell Traverso, hand and wrist surgeon, Coral Springs, FL.

The home page is a scroll-driven 3D story built on real anatomy. As you scroll:

1. The hand assembles from particles.
2. A scanner peels the skin away.
3. Eleven chapters walk through muscles, bones and seven common conditions.

Each chapter runs a live demonstration on the hand: a nerve signal fading in the carpal tunnel, a finger catching and snapping, a thumb pinching, and so on. Holographic labels track the named structures, and a connector links each highlighted word in the text to the structure it names.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint:copy      # copy rules: no em dashes, en dashes, emoji or avoided words
npm run lint:contrast  # every token pairing against WCAG 2.2 AA
npm run copy:deck      # writes docs/copy/COPY-DECK.md for approval
```

Draft copy shows (dotted underline) in `npm run dev` only. For a review deploy, build with `NEXT_PUBLIC_COPY_PREVIEW=drafts`. A plain production build shows only approved copy. See `docs/REVIEW-NOTES.md` for open questions.

```bash
```

## Stack

- Next.js 16 (App Router), React 19, **JavaScript** (no TypeScript)
- **Three.js** (plain), loaded lazily after first paint
- GSAP ScrollTrigger and Lenis for scroll-driven motion
- Tailwind CSS 4, MDX for condition guides

## Where things are

| Path | What it is |
| --- | --- |
| `components/three/handEngine.js` | Three.js engine: loads skin and anatomy, fits the skin rig to the real skeleton, skins soft tissue, finger curls, scanner, exploded view, demonstrations, particles, callout projection |
| `components/story/HandStory.jsx` | Pinned scroll story, HUD callouts and word-to-structure connectors |
| `lib/story.js` | Chapter copy (proposed and draft), poses, callouts |
| `lib/poses.js` | Plain-number scene poses that blend while you scroll |
| `scripts/build-skin.mjs` | Builds the smoothed, re-weighted skin |
| `scripts/build-anatomy.mjs` | Builds the web version of the anatomy model |
| `screenshots/` | Desktop (1440px) and phone (390px) captures |

## 3D assets and licenses

- **Anatomy:** Open3DModel "Hand, complete", from the Open3D project at AnatomyTOOL.org, based on BodyParts3D and Z-Anatomy. License: **CC BY-SA 4.0**. Bones, muscles, tendons, nerves, arteries, veins and selected ligaments are simplified and Draco-compressed (709 KB). The derived file `public/models/anatomy/hand-anatomy.glb` stays under CC BY-SA 4.0. Attribution is in the site footer.
- **Skin:** `generic-hand` from `@webxr-input-profiles/assets`, **MIT license**, copyright 2019 Amazon. It is smoothed by `scripts/build-skin.mjs` and re-rigged at runtime. The license is in `public/models/generic-hand/`.
- **Drawn by code:** the ganglion is an illustration, labeled as such on the page. Everything else on screen is source anatomy.

See `NOTES.md` for decisions, scope and open questions.
