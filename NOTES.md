# Decision note

## What I built and why

**A home page that explains the hand before it asks for anything.** The visitor scrolls through one pinned 3D scene built from real anatomical data:

- **Intro:** the hand assembles from particles.
- **Scanner:** peels the skin away to show muscles, tendons, nerves and vessels.
- **Bones:** separate into an exploded view.
- **Seven condition chapters:** each one lights up the real structure involved and runs a looping demonstration of what goes wrong, for example a nerve signal faltering in the carpal tunnel, or a finger catching and snapping through.
- **Final chapter:** ends on the first visit, as a conversation rather than a sales pitch.

Each condition chapter links to a full guide, and the practice details, surgeon and referral pages follow.

- **Expertise shown through explanation.** The surgeon appears after the patient understands their situation, not before.
- **Two audiences without a gate.** Physicians get a quiet navigation link and a denser referral page.
- **Reaching out is small.** The form asks for a name and a phone number or email only. It works without JavaScript and warns against including health details. On phones, Call and Request buttons sit within thumb reach.

## Real anatomy, used carefully

- The skin rig is **fitted to the real skeleton**. Joint centers are measured from each bone's principal axis, and the skin joints are moved onto them.
- Soft tissue is **skinned to the rig by distance to bone segments**, so muscles, tendons, nerves and vessels bend when the fingers curl.
- Highlights use real named structures from the model. For example:
  - Carpal tunnel: the median nerve and transverse carpal ligament.
  - Trigger finger: the A1 pulleys and flexor tendons.
  - De Quervain's: abductor pollicis longus and extensor pollicis brevis.
  - Dupuytren's: the palmar aponeurosis.
- The ganglion is the only drawn element, and its label says so.

## Accessibility and performance

- The text is complete without the 3D. The canvas is marked decorative.
- **Without JavaScript:** the chapters read as an article over a still image.
- **Reduced motion:** the particle intro, demonstrations, embers, smooth scrolling and tweening are all off, and the hand switches chapter by chapter.
- Condition pages keep a keyboard-operable viewer.
- **Lazy loading:** three.js loads only after first paint and when idle. Assets are about 0.9 MB in total and Draco-compressed.
- **Lighter on phones:** lower pixel ratio, no shadows and fewer embers.
- The tweens run on wall-clock time, so slow devices skip frames instead of lagging.

## Content rules followed

- No invented facts, statistics, credentials or testimonials. Practice details are visible placeholders.
- All clinical wording is marked as a draft for surgeon review, and every guide says it is not a substitute for a consultation.
- `npm run lint:copy` checks for em dashes, en dashes and emoji.
- **Pre-launch indexing:** pages are set to noindex and robots.txt disallows all crawlers.
- **For launch:** a sitemap, metadata and JSON-LD are already in place.

## Not done, and next steps

1. Surgeon review of every highlighted structure and demonstration, since each one is a clinical claim.
2. Test on real mid-range Android phones and with screen readers (VoiceOver, TalkBack). So far it has only been tested in headless Chrome with software rendering.
3. A wrist joint for deviation movements, so the De Quervain's demonstration can show the full stretch.
4. A form backend, analytics, a CMS, and a Spanish version.

## Open questions

- Is the practice comfortable with the CC BY-SA 4.0 ShareAlike terms for the anatomy model? They apply to the model file, not to the site code.
- The anatomy model's exact credit line should be confirmed on AnatomyTOOL.org.
- Phone, address, hours, insurance, referral channel, and the scope of practice.
- Which conditions matter most to the practice, and how review dates should be shown.
