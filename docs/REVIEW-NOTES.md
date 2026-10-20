# Review notes: DESIGN.md and COPY-BRIEF.md pass

Prepared for Vinayak and Ray at THInc. Nothing has been committed or pushed. Nothing marked `TODO` has been filled in.

## 1. Questions we need answered

These block parts of the work. We have not guessed at any of them.

1. **CLAUDE.md.** Both briefs say CLAUDE.md takes priority, but it is not in the repository we were given. Please send it. Until then:
   - We have applied no custom letter spacing anywhere. This is the safest reading of the tracking rule in CLAUDE.md §5.
   - We will re-check everything against CLAUDE.md once we have it.
2. **Brand reference.** `docs/reference/THInc-brand-direction.html` was not supplied. Please send it so we can check for differences.
3. **The eighth symptom page.** The copy brief expects eight symptom pages. Seven exist. Which symptom is the eighth? A visible `TODO(copy)` card holds its place.
4. **Symptom page names (S1).** S1 is "Symptom name (fixed, do not change)". Our pages currently use the condition name, for example "Carpal tunnel syndrome", with the patient's words on the homepage cards. Should S1 be:
   - the condition name, or
   - a symptom phrase, such as "Numb or tingling fingers"?
5. **Icon set.** The final icon set has not been supplied. Every place that needs an icon shows `TODO(icon)` in review builds. Production builds show no icon. We have removed every hand-drawn icon, including the logo mark, the menu icon and the 3D viewer's control icons.
6. **Logo.** We need the logo file. The header currently shows a text wordmark.
7. **Anatomy visual.** DESIGN.md §8 says to use "the approved plate image" until another style is approved. We do not have the plate image. We have kept the 3D figure in the homepage anatomy section and marked it as draft. It is now restyled to the palette, with labels in the margin and every structure in a text list. Do you want to:
   - keep the 3D figure and put it forward for review, or
   - replace it with the plate image once supplied?
8. **Illustration colours.** The 3D anatomy uses anatomical colours: muscle red, nerve yellow, vein blue, and so on. The "Under the skin" chapter has a colour key with text labels. We have treated these as part of the illustration, not interface colours. Is that acceptable, or should the figure be shown in tokens only?
9. **Centres (S15).** S15 mentions linking "centres". The site has no centre pages. What are the centres?
10. **Urgent-care wording.** The earlier drafts had a "When to get help sooner" box on every page telling readers to seek urgent care. That is safety advice, but it also conflicts with the "never urgent" voice rule and the "no treatment advice" limit. We have removed it pending a decision. One line remains in the footer and on the contact page, and it is still a draft: "If you think you need urgent care, contact emergency services." Please confirm the wording with Dr. Traverso.
11. **Error colour.** The palette has no error colour. Form errors use:
    - an accent border,
    - an "Error:" text prefix, and
    - a thicker field border.

    This means errors do not rely on colour alone. Is that enough, or would you like an error colour added?
12. **Practice name.** The site now uses "Traverso Hand Institute" and "Call THInc" (from DESIGN.md §5). Please confirm the domain. `traversohand.com` is a placeholder.
13. **"One accent moment per section" (DESIGN.md §2).** We read this as one filled accent action per section. Its outlined secondary from §5 sits beside it, for example Schedule with Call THInc, and links inside text stay accent. Everything else, such as hovers, selected states, the menu button and the figure markers, now uses ink. Is that the reading you intended?
14. **"Section headings: H3" (DESIGN.md §3).** Section headings use the H3 size. In the HTML they stay `h2`, so the heading order runs H1 then H2 and screen readers do not skip a level. Please confirm that is acceptable.

## 2. Existing copy that conflicted with the brief (COPY-BRIEF.md §8)

These were in the earlier drafts. They are listed here as the brief asks. All of them are replaced by drafts in `lib/copy/draft.js`, which still need approval. The original files are untouched, for comparison, in `content/conditions/*.mdx`, `lib/story.js` (earlier version) and the homepage.

| Where | Earlier copy | Conflict |
| --- | --- | --- |
| All 7 symptom pages | Headings "In plain words", "What people often notice", "What a first appointment may involve", "Treatment options", "Questions you might bring" | Headings must match §4 on every page. Now: What it may feel like / Where this is in the hand / How it is evaluated / Options that may be appropriate / Talk it through. |
| All 7 symptom pages | "When to get help sooner... seek urgent care rather than waiting for an appointment" | Urgent tone, and reads as advice. See question 10. |
| All 7 symptom pages | "Questions you might bring" lists | Not in the §4 structure. Removed. |
| Wrist fracture | "A wrist that looks different in shape, which needs urgent attention" | Urgent, reads as advice. Removed. |
| Ganglion cyst | "Any new lump should be looked at by a clinician" / "Any new lump is worth having checked" | Reads as advice. Softened to "A clinician can look at any new lump and talk through what it may be." Needs clinical review. |
| Wrist fracture summary | "A wrist that is still painful some time after a fall is worth having assessed." | Reads as advice. Removed. |
| Homepage anatomy story | "Explain what is likely going on" | Reads as a promise of diagnosis. Now "We explain what we find, in plain words." |
| Homepage | "Seven common conditions, explained in plain words." | Count is wrong against the eight-page brief. Removed. |
| Contact form | "Best time to call" | "best" is on the avoid list. Now "Preferred time". |
| Disclaimer | Three different wordings (page, footer, homepage) | S12 must be one wording site-wide, and must be `TODO(copy)` until approved wording is supplied (§3). It now shows `TODO(copy)` everywhere, with our proposed wording inside the note for Ray. |
| Symptom pages, "How it is evaluated" | Named tests: nerve conduction study, X-ray, imaging | Clinical facts not supplied by the practice (§3). Replaced with `TODO(copy)`: which tests, if any, from Dr. Traverso. |
| Symptom pages | Medical terms before everyday words, e.g. "The carpal tunnel is...", "A ganglion is..." | §2: everyday words first, medical term in brackets. Rewritten. |
| Buttons | "Request an appointment", "Request a visit", "Call the office" | DESIGN.md §5 labels: "Schedule", "Call THInc". |
| Placeholders | `[Office phone number]` style | Brief asks for `TODO(copy)` markers. Changed throughout. |

## 3. What changed

### Design (DESIGN.md)

- **Tokens.**
  - All seven tokens are defined once, in `app/styles/tokens.css`.
  - Tailwind is locked to them. The default palette, shadows and letter spacing are switched off, so an off-palette class renders nothing.
  - `npm run lint:contrast` checks every pairing used. All pass WCAG 2.2 AA. Muted on paper, the tightest pairing, is 5.9:1.
- **Cyan.** Used in two places only: the disclaimer rule and the Next step panel. Text on cyan is ink.
- **Type.**
  - Geist 400 and 500 only. Fraunces and Atkinson are removed.
  - Page titles use H2 size on phones and H1 size from md up. Section headings use H3 size.
  - The reading measure is 65ch, and line height and paragraph spacing are set once.
- **Layout.**
  - Homepage: a white hero, then reading sections on paper divided by hairlines. There are no dark sections, gradients, glass or shadows.
  - Symptom pages: a white hero, then a three-column desktop layout (200 / 680 / 300 px) with a sticky "Talk to the practice" aside. On phones the jump links show as chips. Each page ends on the cyan Next step panel.
  - Checked at 390px and 1440px, with no horizontal scroll.
- **Components.**
  - Cards have a 14px radius, a line border and no shadow.
  - Buttons are fully rounded, either filled accent or outlined accent.
  - Every interactive element has a visible focus ring. Targets are at least 24px, and primary actions are 48px.
- **Motion.**
  - Removed: the marquee, the pinned horizontal guide track, all parallax, the word-by-word scrubbed text, mask wipes and smooth-scroll hijacking.
  - What remains is a reveal-once rise and fade, using transform and opacity only.
  - The anatomy figure is the only scroll-linked visual.
  - Reduced motion turns all of it off. Pages read fully without JavaScript.
- **Anatomy.**
  - Structure labels sit in the margin with leader lines and never on the figure.
  - Every structure can be selected from both the figure and a text list.
  - The approved caption is shown, and each entry reads "To be supplied and clinically reviewed."
  - The figure itself is marked draft.
  - Symptom page anatomy cards follow the same rules: margin labels with leader lines, figure markers, and a text list of the structures shown. Motion there starts paused.

### Copy (COPY-BRIEF.md)

- **Separate files.** Approved and draft copy are kept apart: `lib/copy/approved.js` and `lib/copy/draft.js`. An approved entry always wins.
- **Drafts do not reach production.**
  - Drafts appear only in review builds (`npm run dev`, or `NEXT_PUBLIC_COPY_PREVIEW=drafts`), marked with a dotted underline.
  - A normal production build shows a `TODO` marker until a slot is approved.
- **S4 stays hidden.** Reviewer name and dates are never shown before approval.
- **Copy deck.** `npm run copy:deck` writes `docs/copy/COPY-DECK.md`. It is the §7 table for every page: slot, text, word count, clinical review flag, owner, status and missing facts.
- **No invented facts.** Treatment options, tests, practice-specific evaluation, the disclaimer (S12), the phone number and centres are all `TODO(copy)`.
- **All visible text goes through the copy layer.** This includes navigation, buttons, form labels, the footer and every page, so nothing unapproved can reach production.
- **Button labels are short verbs.** Schedule, Call THInc, Send, Refer a patient, Meet Dr. Traverso, Read guides, Go home and Start again.
- **Copy lint.** `npm run lint:copy` now also blocks the brief's avoid list (cure, guaranteed, miracle, best, pain-free, fix, instantly, "you need surgery"), as well as em dashes, en dashes and emoji.
