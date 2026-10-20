# Decision note

This site follows the practice's DESIGN.md and COPY-BRIEF.md. Where those files could not be followed in full, the gap is listed in `docs/REVIEW-NOTES.md` as a question for the practice.

## How the site is built

- **Patient first.** The homepage opens on a white hero that asks how we can help and lists symptoms in the patient's own words. Provider and partner routes are visible but secondary.
- **Anatomy section.** This is the only scroll-linked visual on the site. A 3D hand built from real anatomical data follows the chapters as you scroll:
  - Structure labels sit in the margin, with leader lines. They never sit on top of the figure.
  - Every structure can be chosen from the figure or from a text list.
  - The figure is marked draft until it is clinically reviewed. The approved plate image has not been supplied yet.
- **Symptom pages.** Every page uses the same five headings. The layout is:
  - a white hero,
  - three columns on desktop, with jump links shown as chips on phones,
  - an anatomy card with its own structure list,
  - a sticky "Talk to the practice" aside,
  - and, at the end, the cyan Next step panel.
- **Booking form.** It asks only for a name, a phone number or email, and a preferred time.

## Design system

- **Tokens.** The seven colour tokens live in `app/styles/tokens.css`. Tailwind is locked to them, so default colours, shadows and letter spacing are off.
- **Type.** Geist, at weights 400 and 500 only.
- **Contrast.** Every pairing is checked by `npm run lint:contrast`, and all meet WCAG 2.2 AA.
- **Motion.**
  - Each section rises and fades in once, using transform and opacity only.
  - There is no parallax, pinning or scroll-scrubbing.
  - On symptom pages the 3D figure starts paused.
  - Reduced motion turns all motion off.
  - Every page reads fully without JavaScript.

## Copy

- **Approved and draft copy are kept apart.** Approved text is in `lib/copy/approved.js`. Drafts are in `lib/copy/draft.js`.
- **Every line of visible copy is resolved through `lib/copy`.**
- **Drafts only appear in review builds.** They show in `npm run dev`, or in a build made with `NEXT_PUBLIC_COPY_PREVIEW=drafts`, marked with a dotted underline. A plain production build shows a TODO marker until a line is approved.
- **Missing facts stay as TODO markers.** They are never invented.
- **Copy deck.** `npm run copy:deck` writes `docs/copy/COPY-DECK.md` for Ray and Dr. Traverso to approve.
- **Copy check.** `npm run lint:copy` blocks em dashes, en dashes, emoji and the words the brief tells us to avoid.

## Accessibility and performance

- The canvas is decorative, and the page text carries the information.
- The figure markers are real buttons, and the structure lists use native disclosure elements.
- three.js loads lazily, after first paint. Assets are about 0.9 MB in total and Draco-compressed.

## Still to do

1. Answers to the questions in `docs/REVIEW-NOTES.md`: CLAUDE.md, the brand reference, the eighth symptom, icons, the final logo, the anatomy plate, centres and urgent-care wording.
2. Ray to approve the copy, and Dr. Traverso to complete the clinical review.
3. Tests on real phones and with screen readers (VoiceOver, TalkBack).
4. A form backend.

## Superseded files, safe to delete

- `content/conditions/*.mdx`: the earlier drafts, kept for comparison.
- `components/motion/SplitWords.jsx` and `components/motion/SmoothScroll.jsx`: no longer used.
- The `lenis` dependency: no longer used.
