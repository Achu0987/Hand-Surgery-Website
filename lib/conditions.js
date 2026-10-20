// The symptom pages. S1 (the name) is fixed; every other line of copy for
// these pages lives in lib/copy (draft.js until approved).
//
// COPY-BRIEF.md expects eight symptom pages. Seven exist; the eighth has not
// been named yet (see docs/REVIEW-NOTES.md).

export const conditions = [
  { slug: "carpal-tunnel-syndrome", region: "carpal", name: "Carpal tunnel syndrome", area: "Palm side of the wrist" },
  { slug: "thumb-arthritis", region: "thumb-base", name: "Thumb base arthritis", area: "Where the thumb meets the wrist" },
  { slug: "trigger-finger", region: "finger-base", name: "Trigger finger", area: "Base of the finger, in the palm" },
  { slug: "de-quervains-tenosynovitis", region: "radial-wrist", name: "De Quervain's tenosynovitis", area: "Thumb side of the wrist" },
  { slug: "ganglion-cyst", region: "dorsal-wrist", name: "Ganglion cyst", area: "Back or front of the wrist" },
  { slug: "wrist-fracture", region: "distal-radius", name: "Wrist fracture", area: "Lower end of the forearm and wrist bones" },
  { slug: "dupuytrens-contracture", region: "palm", name: "Dupuytren's contracture", area: "Palm and fingers" },
];

export function getCondition(slug) {
  return conditions.find((c) => c.slug === slug);
}
