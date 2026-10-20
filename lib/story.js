import { makePose } from "./poses";

// Anatomy section on the home page. Each chapter is one step of scrolling; the
// 3D hand blends from one chapter's pose to the next. Chapter wording lives in
// lib/copy under home.anatomy.chapters.<id>.
//
// `structures` are the named structures shown in that chapter: [label, anchor].
// Labels sit in the figure's margin with leader lines, never on the figure.

const deep = { scan: 1, skin: 0.14, bones: 1, muscles: 0.08, tendons: 0.35, nerves: 0.25, vessels: 0.1, dark: 0 };

export const chapters = [
  {
    id: "inside",
    structures: [["Muscle", "muscle"], ["Tendon", "tendon"], ["Nerve", "nerve"], ["Artery", "artery"], ["Vein", "vein"]],
    // Colour key for the illustration's own colours, always with a text label
    legend: [
      ["Muscle", "#a3402c"],
      ["Tendon", "#ece3d3"],
      ["Nerve", "#ffc94d"],
      ["Artery", "#b8261d"],
      ["Vein", "#2b3f93"],
    ],
    pose: makePose({ scan: 1, skin: 1, bones: 0.7, muscles: 1, tendons: 1, nerves: 1, vessels: 1, dark: 0, yaw: 0.3, pitch: 0.02, zoom: 1.0 }),
  },
  {
    id: "bones",
    structures: [["Scaphoid", "scaphoid"], ["Metacarpal", "metacarpal"], ["Phalanx", "phalanx"]],
    pose: makePose({ scan: 1, skin: 0.14, bones: 1, explode: 1, dark: 0, yaw: -0.35, pitch: 0.02, zoom: 1.0 }),
  },
  {
    id: "carpal-tunnel-syndrome",
    structures: [["Median nerve", "median"], ["Transverse carpal ligament", "ligament"]],
    pose: makePose({ ...deep, nerves: 0.3, tendons: 0.3, yaw: 0.2, pitch: -0.25, zoom: 1.3, hl: "carpal", act: "carpal", focus: "carpal", focusAmount: 0.5 }),
  },
  {
    id: "trigger-finger",
    structures: [["A1 pulley", "a1"], ["Flexor tendons", "flexor"]],
    pose: makePose({ ...deep, tendons: 0.45, nerves: 0.1, yaw: -0.15, pitch: 0.05, zoom: 1.2, hl: "trigger", act: "trigger", focus: "finger-base", focusAmount: 0.4, curl: [0.05, 0.1, 0.15, 0, 0.15] }),
  },
  {
    id: "thumb-arthritis",
    structures: [["Trapezium", "cmc"], ["First metacarpal", "mc1"]],
    pose: makePose({ ...deep, muscles: 0.15, yaw: -0.4, pitch: -0.1, zoom: 1.3, hl: "thumb", act: "thumb", focus: "thumb-base", focusAmount: 0.5 }),
  },
  {
    id: "de-quervains-tenosynovitis",
    structures: [["Abductor pollicis longus", "dq"], ["Extensor pollicis brevis", "dq2"]],
    pose: makePose({ ...deep, tendons: 0.4, muscles: 0.1, yaw: -0.6, pitch: -0.15, zoom: 1.2, hl: "dequervain", act: "dq", focus: "radial-wrist", focusAmount: 0.5 }),
  },
  {
    id: "ganglion-cyst",
    structures: [["Ganglion (illustration)", "ganglion"]],
    pose: makePose({ ...deep, skin: 0.3, tendons: 0.6, yaw: Math.PI + 0.3, pitch: -0.15, zoom: 1.3, hl: "ganglion", act: "ganglion", focus: "dorsal-wrist", focusAmount: 0.5 }),
  },
  {
    id: "wrist-fracture",
    structures: [["Radius", "radius"], ["Scaphoid", "scaphoid"]],
    pose: makePose({ ...deep, tendons: 0.15, nerves: 0.1, yaw: -0.4, pitch: -0.3, zoom: 1.35, hl: "scaphoid", act: "fall", focus: "distal-radius", focusAmount: 0.5 }),
  },
  {
    id: "dupuytrens-contracture",
    structures: [["Palmar aponeurosis", "aponeurosis"]],
    pose: makePose({ ...deep, skin: 0.25, tendons: 0.4, yaw: 0.1, pitch: 0.1, zoom: 1.2, hl: "dupuytren", act: "dup", focus: "palm", focusAmount: 0.45 }),
  },
];

// Every structure once, with the first chapter that shows it. This is the
// text list that mirrors the figure (DESIGN.md §8).
export const structures = (() => {
  const seen = new Map();
  chapters.forEach((c, i) =>
    c.structures.forEach(([label, anchor]) => {
      if (!seen.has(label)) seen.set(label, { label, anchor, chapter: i });
    }),
  );
  return [...seen.values()];
})();
