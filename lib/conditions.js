// Symptom-first index of the site. Each entry starts from the words a patient
// would use, then points to a region of the 3D hand and to a condition page.
//
// Every clinical sentence here is PROPOSED DRAFT copy. It is deliberately
// general and must be reviewed by Dr. Traverso before publication.

export const conditions = [
  {
    slug: "carpal-tunnel-syndrome",
    region: "carpal",
    name: "Carpal tunnel syndrome",
    symptom: "My fingers go numb or tingle, often at night",
    area: "Palm side of the wrist",
    summary:
      "Often linked to pressure on the median nerve as it passes through a narrow passage at the wrist called the carpal tunnel.",
    firstQuestions: [
      "Which fingers feel numb, and does the little finger feel normal?",
      "Is it worse at night or when I hold a phone or steering wheel?",
      "Am I dropping things or finding buttons harder?",
    ],
  },
  {
    slug: "thumb-arthritis",
    region: "thumb-base",
    name: "Thumb base arthritis",
    symptom: "The base of my thumb hurts when I grip or pinch",
    area: "Where the thumb meets the wrist",
    summary:
      "Often linked to wear of the joint at the base of the thumb, the joint that lets the thumb swing across the palm.",
    firstQuestions: [
      "Which everyday tasks hurt most: jars, keys, writing?",
      "Is there swelling or a bump at the base of the thumb?",
      "What can I do now to protect the joint?",
    ],
  },
  {
    slug: "trigger-finger",
    region: "finger-base",
    name: "Trigger finger",
    symptom: "A finger catches, clicks or locks when I bend it",
    area: "Base of the finger, in the palm",
    summary:
      "Often linked to a tendon that no longer glides smoothly through its tunnel at the base of the finger.",
    firstQuestions: [
      "Is it worse first thing in the morning?",
      "Does the finger ever stay stuck until I straighten it with the other hand?",
      "Is there a tender spot in the palm at the base of that finger?",
    ],
  },
  {
    slug: "de-quervains-tenosynovitis",
    region: "radial-wrist",
    name: "De Quervain's tenosynovitis",
    symptom: "It hurts on the thumb side of my wrist",
    area: "Thumb side of the wrist",
    summary:
      "Often linked to irritation of two tendons that run along the thumb side of the wrist, and the tunnel they glide through.",
    firstQuestions: [
      "Does lifting, or turning the wrist with the thumb tucked in, set it off?",
      "Did it start after a change in routine, such as caring for a baby?",
      "Is there swelling along the side of the wrist?",
    ],
  },
  {
    slug: "ganglion-cyst",
    region: "dorsal-wrist",
    name: "Ganglion cyst",
    symptom: "I have a lump on my wrist",
    area: "Back or front of the wrist",
    summary:
      "A common cause of a wrist lump is a ganglion, a fluid-filled sac that forms from a joint or tendon lining. Any new lump is worth having checked.",
    firstQuestions: [
      "Has the lump changed size, or come and gone?",
      "Is it painful, or pressing on anything?",
      "Does it need treatment at all?",
    ],
  },
  {
    slug: "wrist-fracture",
    region: "distal-radius",
    name: "Wrist fracture",
    symptom: "My wrist has not recovered after a fall",
    area: "Lower end of the forearm and wrist bones",
    summary:
      "A fall onto an outstretched hand can break one of the wrist bones. A wrist that is still painful some time after a fall is worth having assessed.",
    firstQuestions: [
      "Was an X-ray taken, and what did it show?",
      "Is the pain on the thumb side, the little finger side, or the middle?",
      "What should I avoid until it has been checked?",
    ],
  },
  {
    slug: "dupuytrens-contracture",
    region: "palm",
    name: "Dupuytren's contracture",
    symptom: "My fingers are bending toward my palm and will not straighten",
    area: "Palm and fingers",
    summary:
      "Often linked to thickening of the tissue under the skin of the palm, which can form cords that slowly draw fingers in.",
    firstQuestions: [
      "Can I still lay my hand flat on a table?",
      "Which fingers are affected, and is it changing?",
      "When is it the right time to consider treatment?",
    ],
  },
];

export function getCondition(slug) {
  return conditions.find((c) => c.slug === slug);
}
