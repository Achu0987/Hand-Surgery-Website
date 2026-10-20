// Scene "poses": plain numbers describing what the 3D hand shows. Kept free of
// three.js so React can build and blend poses before the 3D code has loaded.
//
// yaw/pitch    rotation of the hand (radians). yaw 0 = palm facing you.
// zoom         camera closeness (1 = whole hand)
// x, y         where the hand sits on screen, as a fraction of the viewport
// skin, bones, muscles, tendons, nerves, vessels  layer visibility 0..1
// dark         0 = light porcelain background, 1 = deep "under the skin" look
// markers      visibility of the clickable region markers
// scan         0..1 scanner line sweeping down, peeling the skin away
// explode      bones drift apart into an exploded view
// act_*        weight of each looping demonstration
// curl0..4     finger flexion, thumb to little finger
// hl_*         highlight weight for an anatomical feature
// f_*          how far the camera centres on a region anchor

// Looping demonstrations, one per topic (weights blend as the visitor scrolls)
export const ACTS = ["carpal", "trigger", "thumb", "dq", "ganglion", "fall", "dup", "exam"];

export const HL_KEYS = ["carpal", "thumb", "trigger", "dequervain", "ganglion", "scaphoid", "dupuytren"];
export const REGIONS = ["carpal", "thumb-base", "finger-base", "radial-wrist", "dorsal-wrist", "distal-radius", "palm"];
export const REGION_HL = {
  carpal: "carpal",
  "thumb-base": "thumb",
  "finger-base": "trigger",
  "radial-wrist": "dequervain",
  "dorsal-wrist": "ganglion",
  "distal-radius": "scaphoid",
  palm: "dupuytren",
};

const DEFAULT = {
  yaw: -0.35,
  pitch: 0.05,
  zoom: 1,
  x: 0,
  y: 0,
  skin: 1,
  bones: 0,
  muscles: 0,
  tendons: 0,
  nerves: 0,
  vessels: 0,
  dark: 0,
  markers: 0,
  scan: 0,
  explode: 0,
  ...Object.fromEntries(ACTS.map((a) => [`act_${a}`, 0])),
  curl0: 0,
  curl1: 0,
  curl2: 0,
  curl3: 0,
  curl4: 0,
  ...Object.fromEntries(HL_KEYS.map((k) => [`hl_${k}`, 0])),
  ...Object.fromEntries(REGIONS.map((r) => [`f_${r}`, 0])),
};

export const POSE_KEYS = Object.keys(DEFAULT);

export function makePose(p = {}) {
  const out = { ...DEFAULT };
  for (const [k, v] of Object.entries(p)) {
    if (k === "hl") out[`hl_${v}`] = 1;
    else if (k === "focus") out[`f_${v}`] = p.focusAmount ?? 0.85;
    else if (k === "focusAmount") continue;
    else if (k === "curl") v.forEach((c, i) => (out[`curl${i}`] = c));
    else if (k === "act") out[`act_${v}`] = 1;
    else out[k] = v;
  }
  return out;
}

export function mixPose(a, b, t) {
  const out = {};
  for (const k of POSE_KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

const inside = { scan: 1, skin: 0.16, bones: 1, muscles: 0.12, tendons: 0.45, nerves: 0.35, vessels: 0.15, dark: 1 };

export const REGION_POSES = {
  carpal: makePose({ ...inside, nerves: 1, yaw: -0.15, pitch: -0.3, zoom: 1.35, hl: "carpal", act: "carpal", focus: "carpal", focusAmount: 0.6 }),
  "thumb-base": makePose({ ...inside, yaw: -0.4, pitch: -0.1, zoom: 1.35, hl: "thumb", act: "thumb", focus: "thumb-base", focusAmount: 0.6, curl: [0.35, 0, 0, 0, 0] }),
  "finger-base": makePose({ ...inside, tendons: 1, yaw: -0.1, pitch: 0.05, zoom: 1.3, hl: "trigger", act: "trigger", focus: "finger-base", focusAmount: 0.5, curl: [0, 0.1, 0.2, 0.45, 0.15] }),
  "radial-wrist": makePose({ ...inside, tendons: 0.4, muscles: 0.1, yaw: -0.6, pitch: -0.15, zoom: 1.25, hl: "dequervain", act: "dq", focus: "radial-wrist", focusAmount: 0.6 }),
  "dorsal-wrist": makePose({ ...inside, skin: 0.35, yaw: Math.PI + 0.3, pitch: -0.15, zoom: 1.35, hl: "ganglion", act: "ganglion", focus: "dorsal-wrist", focusAmount: 0.6 }),
  "distal-radius": makePose({ ...inside, yaw: -0.4, pitch: -0.3, zoom: 1.35, hl: "scaphoid", act: "fall", focus: "distal-radius", focusAmount: 0.6 }),
  palm: makePose({ ...inside, skin: 0.3, yaw: -0.05, pitch: 0.05, zoom: 1.3, hl: "dupuytren", act: "dup", focus: "palm", focusAmount: 0.5, curl: [0, 0, 0.1, 0.35, 0.3] }),
};

export const OVERVIEW_POSE = makePose({});
