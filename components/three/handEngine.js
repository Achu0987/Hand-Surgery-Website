// Three.js engine for the anatomical hand. Framework-agnostic and loaded lazily.
//
// Assets
// - Skin: "generic-hand" from @webxr-input-profiles/assets (MIT, Amazon 2019).
//   Pre-smoothed by scripts/build-skin.mjs and re-rigged here onto the skeleton.
// - Anatomy: Open3DModel "Hand, complete", AnatomyTOOL / Open3D project
//   (CC BY-SA 4.0), derived from BodyParts3D and Z-Anatomy. Bones, muscles,
//   tendons, nerves, arteries, veins and selected ligaments, simplified by
//   scripts/build-anatomy.mjs. The ganglion is the only drawn illustration.
//
// The skin rig is fitted to the real bones: joint centres are measured from
// each bone's principal axis, then the skin's joints are moved onto them. That
// keeps the bones inside the skin and lets fingers curl with bones attached.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HL_KEYS, POSE_KEYS, REGIONS, makePose } from "@/lib/poses";

const SKIN_URL = "/models/generic-hand/right-smooth.glb"; // built by scripts/build-skin.mjs
const ANATOMY_URL = "/models/anatomy/hand-anatomy.glb"; // built by scripts/build-anatomy.mjs

const FINGERS = ["thumb", "index-finger", "middle-finger", "ring-finger", "pinky-finger"];
const ORDINALS = [["1st"], ["2d", "2nd"], ["3d", "3rd"], ["4th"], ["5th"]];
// Real structures lit up for each topic
const HL_SETS = {
  carpal: [/^Median nerve/, /^Transverse carpal ligament/, /^Flexor retinaculum/],
  trigger: [/^Annular ligaments of 4th finger/, /^Flexor digitorum profundus/, /^Flexor digitorum superficialis/],
  dequervain: [/^Abductor pollicis longus$/, /^Extensor pollicis brevis$/],
  dupuytren: [/^Aponeurosis palmaris/],
  thumb: [/^Trapezium/, /^1st metacarpal/],
  scaphoid: [/^Scaphoid/, /^Radius/],
};

const C = {
  skinLight: new THREE.Color("#ecd2c0"),
  rimLight: new THREE.Color("#7fd8fb"),
  rimDark: new THREE.Color("#9ee3fb"),
  bone: new THREE.Color("#efe6d6"),
  muscle: new THREE.Color("#a3402c"),
  ligament: new THREE.Color("#dfe6ee"),
  artery: new THREE.Color("#b8261d"),
  vein: new THREE.Color("#2b3f93"),
  nerve: new THREE.Color("#ffc94d"),
  tendon: new THREE.Color("#ece3d3"),
  hot: new THREE.Color("#00aeef"),
  glow: new THREE.Color("#00aeef"),
  ember: new THREE.Color("#00aeef"),
};

// ---------------------------------------------------------------- helpers ---

function fingerOf(name) {
  for (let i = 0; i < 5; i++) for (const t of ORDINALS[i]) if (name.includes(`${t} `)) return i;
  return -1;
}

function worldPoints(mesh, max = 600) {
  mesh.updateWorldMatrix(true, false);
  const pos = mesh.geometry.attributes.position;
  const step = Math.max(1, Math.floor(pos.count / max));
  const pts = [];
  for (let i = 0; i < pos.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld));
  return pts;
}

// Principal axis of a bone: centre, direction, end points and mean radius.
function boneAxis(mesh, towardsDistalFrom) {
  const pts = worldPoints(mesh);
  const c = new THREE.Vector3();
  pts.forEach((p) => c.add(p));
  c.divideScalar(pts.length);
  let xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0;
  for (const p of pts) {
    const x = p.x - c.x, y = p.y - c.y, z = p.z - c.z;
    xx += x * x; xy += x * y; xz += x * z; yy += y * y; yz += y * z; zz += z * z;
  }
  let v = new THREE.Vector3(1, 1, 1).normalize();
  for (let i = 0; i < 40; i++) {
    v = new THREE.Vector3(xx * v.x + xy * v.y + xz * v.z, xy * v.x + yy * v.y + yz * v.z, xz * v.x + yz * v.y + zz * v.z).normalize();
  }
  let lo = Infinity, hi = -Infinity, rad = 0;
  const tmp = new THREE.Vector3();
  for (const p of pts) {
    const t = tmp.subVectors(p, c).dot(v);
    lo = Math.min(lo, t);
    hi = Math.max(hi, t);
  }
  for (const p of pts) {
    tmp.subVectors(p, c);
    const t = tmp.dot(v);
    rad += tmp.addScaledVector(v, -t).length();
  }
  rad /= pts.length;
  let start = c.clone().addScaledVector(v, lo);
  let end = c.clone().addScaledVector(v, hi);
  if (towardsDistalFrom && end.distanceTo(towardsDistalFrom) < start.distanceTo(towardsDistalFrom)) [start, end] = [end, start];
  return { center: c, start, end, dir: end.clone().sub(start).normalize(), radius: rad, length: start.distanceTo(end) };
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Fresnel rim shell that follows the skinned mesh.
function rimMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color() }, uOpacity: { value: 0 }, uPower: { value: 2.2 } },
    vertexShader: /* glsl */ `
      #include <common>
      #include <skinning_pars_vertex>
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        #include <beginnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        vN = normalize(transformedNormal);
        vV = normalize(-mvPosition.xyz);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPower;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
        gl_FragColor = vec4(uColor, (0.03 + f * 0.9) * uOpacity);
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    // Same surface as the skin: pull it forward so the two never z-fight
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}


// ----------------------------------------------------------------- engine ---

export async function createHandEngine(container, options = {}) {
  const { markerEls = {}, reducedMotion = false, narrowLift = 0, onReady } = options;
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.75;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 10);
  scene.add(camera);

  scene.add(new THREE.HemisphereLight("#f3f6ff", "#14104a", 0.75));
  const key = new THREE.DirectionalLight("#f5f8ff", 2.4);
  key.position.set(0.35, 0.65, 0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0008;
  key.shadow.normalBias = 0.005;
  Object.assign(key.shadow.camera, { left: -0.14, right: 0.14, top: 0.14, bottom: -0.14, near: 0.5, far: 2 });
  scene.add(key);
  const rimLight = new THREE.DirectionalLight("#6fd0f7", 2.0);
  rimLight.position.set(-1, 0.5, -1.2);
  scene.add(rimLight);

  const pivot = new THREE.Group();
  scene.add(pivot);
  const handSpace = new THREE.Group();
  pivot.add(handSpace);

  // ------------------------------------------------------------- loading ---
  const draco = new DRACOLoader().setDecoderPath("/draco/");
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const [skinGltf, anatGltf] = await Promise.all([loader.loadAsync(SKIN_URL), loader.loadAsync(ANATOMY_URL)]);
  draco.dispose();

  const skinRoot = skinGltf.scene;
  const anatRoot = anatGltf.scene;
  handSpace.add(anatRoot);
  handSpace.add(skinRoot);
  scene.updateMatrixWorld(true);

  // --- Read real anatomy ---------------------------------------------------
  // Each structure keeps its anatomical name and group (from the build script).
  const parts = [];
  anatRoot.traverse((o) => {
    if (!o.isMesh) return;
    const holder = o.userData.group ? o : o.parent;
    const name = (holder.name || o.name).replace(/_/g, " ").trim(); // GLTFLoader sanitises spaces
    parts.push({ mesh: o, name, group: holder.userData.group || "Other", matName: o.material?.name || "" });
  });
  const boneMeshes = {};
  for (const p of parts) if (p.group === "Bones" && !boneMeshes[p.name]) boneMeshes[p.name] = p.mesh;
  for (const [n, m] of Object.entries(boneMeshes)) m.name = n;
  const findBone = (pred) => Object.values(boneMeshes).find((m) => pred(m.name));
  const carpal = (name) => findBone((n) => n.startsWith(name));
  const capitate = carpal("Capitate");
  const capAxis = boneAxis(capitate);

  const segs = FINGERS.map(() => ({}));
  for (const mesh of Object.values(boneMeshes)) {
    const f = fingerOf(mesh.name);
    if (f < 0) continue;
    const type = /metacarpal/i.test(mesh.name) ? "mc" : /^Proximal/.test(mesh.name) ? "pp" : /^Middle/.test(mesh.name) ? "mp" : /^Distal/.test(mesh.name) ? "dp" : null;
    if (!type) continue;
    segs[f][type] = { mesh, ...boneAxis(mesh, capAxis.center) };
  }
  const chainSegs = (f) => (f === 0 ? [segs[0].mc, segs[0].pp, segs[0].dp] : [segs[f].mc, segs[f].pp, segs[f].mp, segs[f].dp]);
  const chainNames = (f) =>
    f === 0
      ? ["thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip"]
      : ["metacarpal", "phalanx-proximal", "phalanx-intermediate", "phalanx-distal", "tip"].map((s) => `${FINGERS[f]}-${s}`);

  const target = {};
  for (let f = 0; f < 5; f++) {
    const s = chainSegs(f);
    const names = chainNames(f);
    target[names[0]] = s[0].start.clone();
    for (let k = 1; k < s.length; k++) target[names[k]] = s[k - 1].end.clone().lerp(s[k].start, 0.5);
    const last = s[s.length - 1];
    target[names[names.length - 1]] = last.end.clone().addScaledVector(last.dir, 0.0035);
  }
  const proxRow = ["Scaphoid", "Lunate", "Triquetrum"].map((n) => boneAxis(carpal(n)).center);
  const proxCentroid = proxRow.reduce((a, b) => a.add(b), new THREE.Vector3()).divideScalar(3);
  target.wrist = proxCentroid.clone().add(proxCentroid.clone().sub(capAxis.center).multiplyScalar(0.9));

  // Anatomical frame. Palm normal sign comes from the sesamoid bones, which
  // sit on the palm side of the knuckles.
  const up = target["middle-finger-tip"].clone().sub(target.wrist).normalize();
  const radialRaw = target["index-finger-phalanx-proximal"].clone().sub(target["pinky-finger-phalanx-proximal"]).normalize();
  let palmN = new THREE.Vector3().crossVectors(radialRaw, up).normalize();
  const sesamoid = findBone((n) => n.startsWith("Sesamoid"));
  if (sesamoid) {
    const sc = boneAxis(sesamoid).center;
    const knuckles = FINGERS.slice(1).map((f) => target[`${f}-phalanx-proximal`]).reduce((a, b) => a.clone().add(b)).divideScalar(4);
    if (sc.clone().sub(knuckles).dot(palmN) < 0) palmN.negate();
  }
  const side = new THREE.Vector3().crossVectors(up, palmN).normalize(); // screen right when palm faces camera
  const radial = radialRaw.dot(side) > 0 ? side.clone() : side.clone().negate();
  const proximal = up.clone().negate();

  // --- Fit the skin rig onto the skeleton ------------------------------------
  let skinned = null;
  const joints = {};
  skinRoot.traverse((o) => {
    if (o.isSkinnedMesh) skinned = o;
    if (o.isBone) joints[o.name] = o;
  });
  const srcPos = (n) => joints[n].getWorldPosition(new THREE.Vector3());
  const frame = (w, i, p, t) => {
    const u = t.clone().sub(w).normalize();
    const a = i.clone().sub(p).normalize();
    const nn = new THREE.Vector3().crossVectors(a, u).normalize();
    const a2 = new THREE.Vector3().crossVectors(u, nn).normalize();
    return new THREE.Matrix4().makeBasis(a2, u, nn);
  };
  const S = ["wrist", "index-finger-phalanx-proximal", "pinky-finger-phalanx-proximal", "middle-finger-tip"].map(srcPos);
  const T = ["wrist", "index-finger-phalanx-proximal", "pinky-finger-phalanx-proximal", "middle-finger-tip"].map((n) => target[n]);
  const Fs = frame(...S);
  const Ft = frame(...T);
  const R = Ft.clone().multiply(Fs.clone().transpose());
  const scale = (T[3].distanceTo(T[0]) / S[3].distanceTo(S[0]) + T[1].distanceTo(T[2]) / S[1].distanceTo(S[2])) / 2;
  skinRoot.quaternion.setFromRotationMatrix(R);
  skinRoot.scale.setScalar(scale);
  const srcCentroid = S.reduce((a, b) => a.clone().add(b)).divideScalar(4);
  const tgtCentroid = T.reduce((a, b) => a.clone().add(b)).divideScalar(4);
  skinRoot.position.copy(tgtCentroid).sub(srcCentroid.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(skinRoot.quaternion)).multiplyScalar(scale));
  skinRoot.updateMatrixWorld(true);


  // Bone directions in the skin as modelled, measured before anything moves
  const srcDir = {};
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    names.forEach((n, k) => {
      const a = srcPos(names[k === names.length - 1 ? k - 1 : k]);
      const b = srcPos(names[k === names.length - 1 ? k : k + 1]);
      srcDir[n] = b.sub(a).normalize();
    });
  }

  const qTmp = new THREE.Quaternion();
  const setJoint = (name, pos, next) => {
    const j = joints[name];
    if (!j) return;
    const parent = j.parent;
    parent.updateWorldMatrix(true, false);
    j.position.copy(parent.worldToLocal(pos.clone()));
    if (next) {
      j.updateWorldMatrix(true, false);
      const qw = j.getWorldQuaternion(new THREE.Quaternion());
      const d0 = srcDir[name];
      const d1 = next.clone().sub(pos).normalize();
      const nq = new THREE.Quaternion().setFromUnitVectors(d0, d1).multiply(qw);
      const pq = parent.getWorldQuaternion(qTmp);
      j.quaternion.copy(pq.invert().multiply(nq));
    }
    j.updateWorldMatrix(true, false);
  };
  setJoint("wrist", target.wrist);
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    names.forEach((n, k) => {
      const next = target[names[Math.min(k + 1, names.length - 1)]];
      const prev = target[names[Math.max(k - 1, 0)]];
      setJoint(n, target[n], k === names.length - 1 ? target[n].clone().add(target[n].clone().sub(prev)) : next);
    });
  }

  // Hierarchy so a joint carries everything distal to it
  scene.updateMatrixWorld(true);
  const wristJ = joints.wrist;
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    wristJ.attach(joints[names[0]]);
    for (let k = 1; k < names.length; k++) joints[names[k - 1]].attach(joints[names[k]]);
  }
  scene.updateMatrixWorld(true);

  // Flexion axes, measured rather than assumed: rotate each segment towards the palm
  const flex = []; // { joint, rest, axis, maxAngle, finger }
  const ulnar = radial.clone().negate();
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    const flexers = f === 0 ? [[0, 0.45], [1, 0.9], [2, 1.0]] : [[1, 1.35], [2, 1.65], [3, 1.1]];
    for (const [k, maxAngle] of flexers) {
      const j = joints[names[k]];
      const d = target[names[k + 1]].clone().sub(target[names[k]]).normalize();
      const towards = f === 0 ? palmN.clone().multiplyScalar(0.8).addScaledVector(ulnar, 0.75).normalize() : palmN;
      const axisW = new THREE.Vector3().crossVectors(d, towards).normalize();
      const qw = j.getWorldQuaternion(new THREE.Quaternion());
      const axis = axisW.applyQuaternion(qw.invert());
      flex.push({ joint: j, rest: j.quaternion.clone(), axis, maxAngle, finger: f });
    }
  }

  // --- Materials -------------------------------------------------------------
  const skinMat = new THREE.MeshPhysicalMaterial({
    color: C.skinLight,
    roughness: 0.52,
    metalness: 0,
    sheen: 0.9,
    sheenColor: new THREE.Color("#ffcfb8"),
    sheenRoughness: 0.45,
    clearcoat: 0.12,
    clearcoatRoughness: 0.6,
    transparent: true,
    clippingPlanes: [],
  });
  skinned.material = skinMat;
  skinned.castShadow = true;
  skinned.receiveShadow = true;
  skinned.frustumCulled = false;

  const rimMat = rimMaterial();
  const rim = new THREE.SkinnedMesh(skinned.geometry, rimMat);
  rim.bind(skinned.skeleton, skinned.bindMatrix);
  rim.frustumCulled = false;
  rim.renderOrder = 5;
  skinned.parent.add(rim);
  rim.position.copy(skinned.position);
  rim.quaternion.copy(skinned.quaternion);
  rim.scale.copy(skinned.scale);

  renderer.localClippingEnabled = true;
  const clipPlane = new THREE.Plane();
  const layerMats = { bones: [], muscles: [], tendons: [], nerves: [], vessels: [] };
  const mk = (layer, params) => {
    const m = new THREE.MeshPhysicalMaterial({ transparent: true, clippingPlanes: [clipPlane], ...params });
    m.userData.baseEmissive = params.emissiveIntensity ?? 0;
    m.userData.baseOpacity = params.opacity ?? 1;
    m.userData.layer = layer;
    layerMats[layer].push(m);
    return m;
  };
  const LOOK = {
    bones: ["bones", { color: C.bone, roughness: 0.42, sheen: 0.4, sheenColor: new THREE.Color("#fff3df"), clearcoat: 0.25, emissive: C.hot, emissiveIntensity: 0 }],
    muscles: ["muscles", { color: C.muscle, roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color("#ff8f73"), sheenRoughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.35, emissive: C.hot, emissiveIntensity: 0 }],
    tendons: ["tendons", { color: C.tendon, roughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color("#ffffff"), clearcoat: 0.7, emissive: C.hot, emissiveIntensity: 0 }],
    ligaments: ["tendons", { color: C.ligament, roughness: 0.35, clearcoat: 0.5, emissive: C.hot, emissiveIntensity: 0, opacity: 0.35 }],
    nerves: ["nerves", { color: C.nerve, roughness: 0.35, clearcoat: 0.4, emissive: C.nerve, emissiveIntensity: 0.25 }],
    arteries: ["vessels", { color: C.artery, roughness: 0.3, clearcoat: 0.7, emissive: C.artery, emissiveIntensity: 0.05 }],
    veins: ["vessels", { color: C.vein, roughness: 0.3, clearcoat: 0.7, emissive: C.vein, emissiveIntensity: 0.05 }],
  };
  const shared = {};
  const hlMats = Object.fromEntries(HL_KEYS.map((k) => [k, []]));
  const kindOf = (p) => {
    if (p.group === "Bones") return "bones";
    if (p.group === "Nerves") return "nerves";
    if (p.group === "Arteries") return "arteries";
    if (p.group === "Veins") return "veins";
    if (p.group === "Ligaments") return "ligaments";
    if (/aponeurosis/i.test(p.name) || /tendon|hood|fibrous/i.test(p.matName)) return "tendons";
    return "muscles";
  };
  const materialFor = (p) => {
    const kind = kindOf(p);
    const hl = Object.entries(HL_SETS).find(([, res]) => res.some((r) => r.test(p.name)))?.[0];
    if (hl) {
      const m = mk(LOOK[kind][0], LOOK[kind][1]);
      m.userData.hl = hl;
      m.userData.baseColor = m.color.clone();
      hlMats[hl].push(m);
      return m;
    }
    return (shared[kind] ||= mk(LOOK[kind][0], LOOK[kind][1]));
  };

  // Bones: rigid, attached to the joint that carries them
  for (const mesh of Object.values(boneMeshes)) mesh.material = materialFor(parts.find((p) => p.mesh === mesh));
  scene.updateMatrixWorld(true);
  const fingerBones = new Set();
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    chainSegs(f).forEach((s, k) => {
      joints[names[k]].attach(s.mesh);
      fingerBones.add(s.mesh);
    });
  }
  for (const mesh of Object.values(boneMeshes)) if (!fingerBones.has(mesh)) wristJ.attach(mesh);

  // Soft tissue: skinned to the rig by distance to each bone segment, so
  // muscles, tendons, nerves and vessels bend with the fingers.
  const rigBones = skinned.skeleton.bones;
  const softSkeleton = new THREE.Skeleton(rigBones); // inverses from the fitted pose
  const segList = [];
  for (let f = 0; f < 5; f++) {
    const names = chainNames(f);
    for (let k = 0; k < names.length - 1; k++) segList.push([target[names[k]], target[names[k + 1]], rigBones.indexOf(joints[names[k]])]);
  }
  segList.push([target.wrist.clone().addScaledVector(up, -0.06), target.wrist, rigBones.indexOf(wristJ)]);
  const sa = new THREE.Vector3();
  const sb = new THREE.Vector3();
  const segDist = (p, a, b) => {
    const ab = sb.subVectors(b, a);
    const t = THREE.MathUtils.clamp(sa.subVectors(p, a).dot(ab) / ab.lengthSq(), 0, 1);
    return p.distanceTo(sa.copy(a).addScaledVector(ab, t));
  };
  const pv = new THREE.Vector3();
  for (const p of parts) {
    if (p.group === "Bones") continue;
    const geo = p.mesh.geometry.clone();
    p.mesh.updateWorldMatrix(true, false);
    geo.applyMatrix4(p.mesh.matrixWorld);
    const pos = geo.attributes.position;
    const si = new Uint16Array(pos.count * 4);
    const sw = new Float32Array(pos.count * 4);
    for (let i = 0; i < pos.count; i++) {
      pv.fromBufferAttribute(pos, i);
      let b1 = 0, b2 = 0, d1 = Infinity, d2 = Infinity;
      for (const [a, b, bone] of segList) {
        const d = segDist(pv, a, b);
        if (d < d1) [b2, d2, b1, d1] = [b1, d1, bone, d];
        else if (d < d2 && bone !== b1) [b2, d2] = [bone, d];
      }
      const w1 = 1 / (d1 ** 4 + 1e-14);
      const w2 = b2 === b1 ? 0 : 1 / (d2 ** 4 + 1e-14);
      si[i * 4] = b1;
      si[i * 4 + 1] = b2;
      sw[i * 4] = w1 / (w1 + w2);
      sw[i * 4 + 1] = w2 / (w1 + w2);
    }
    geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(si, 4));
    geo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(sw, 4));
    const sm = new THREE.SkinnedMesh(geo, materialFor(p));
    sm.name = p.name;
    sm.frustumCulled = false;
    handSpace.add(sm);
    sm.bind(softSkeleton, new THREE.Matrix4());
    p.mesh.removeFromParent();
  }

  // Clip anatomy where the skin ends, just past the wrist
  skinned.skeleton.update();
  let skinEnd = Infinity;
  for (let i = 0; i < skinned.geometry.attributes.position.count; i += 5) {
    skinned.getVertexPosition(i, pv).applyMatrix4(skinned.matrixWorld);
    skinEnd = Math.min(skinEnd, pv.dot(up));
  }
  const localClip = new THREE.Plane(up.clone(), -(skinEnd + 0.002));

  const attachTo = (obj, jointName) => {
    scene.updateMatrixWorld(true);
    (jointName ? joints[jointName] : wristJ).attach(obj);
    return obj;
  };
  const carpalTunnel = capAxis.center.clone().addScaledVector(palmN, capAxis.radius + 0.0045);
  const mcBase = (f) => chainSegs(f)[0];
  const scaphoidAxis = boneAxis(carpal("Scaphoid"));

  // Ganglion: an illustration (not part of the source model), shown only for its chapter
  const lesionMat = new THREE.MeshPhysicalMaterial({ color: C.hot, roughness: 0.25, clearcoat: 1, emissive: C.hot, emissiveIntensity: 0.35, transparent: true, opacity: 0 });
  const lunate = boneAxis(carpal("Lunate")).center;
  const ganglion = new THREE.Mesh(new THREE.SphereGeometry(0.0062, 32, 20), lesionMat);
  const ganglionPos = scaphoidAxis.center.clone().lerp(lunate, 0.5).addScaledVector(palmN, -0.012);
  ganglion.position.copy(ganglionPos);
  attachTo(ganglion);

  // --- Anchors (markers, glow, camera focus) -------------------------------
  const anchorDefs = {
    carpal: [carpalTunnel.clone().addScaledVector(palmN, 0.004), palmN, null],
    "thumb-base": [boneAxis(carpal("Trapezium")).center.lerp(mcBase(0).start, 0.5).addScaledVector(palmN, 0.004), palmN.clone().add(radial).normalize(), null],
    "finger-base": [target["middle-finger-phalanx-proximal"].clone().lerp(target["ring-finger-phalanx-proximal"], 0.5).addScaledVector(palmN, 0.011), palmN, null],
    "radial-wrist": [scaphoidAxis.center.clone().addScaledVector(radial, scaphoidAxis.radius + 0.009), radial, null],
    "dorsal-wrist": [ganglionPos.clone().addScaledVector(palmN, -0.005), palmN.clone().negate(), null],
    "distal-radius": [scaphoidAxis.center.clone().addScaledVector(palmN, 0.006), palmN.clone().add(radial).normalize(), null],
    palm: [mcBase(3).center.clone().addScaledVector(palmN, mcBase(3).radius + 0.01), palmN, null],
  };
  const anchors = {};
  for (const [id, [pos, normal, jointName]] of Object.entries(anchorDefs)) {
    const o = new THREE.Object3D();
    o.position.copy(pos);
    handSpace.add(o);
    attachTo(o, jointName);
    const nObj = new THREE.Object3D();
    nObj.position.copy(pos.clone().add(normal));
    handSpace.add(nObj);
    attachTo(nObj, jointName);
    anchors[id] = { o, nObj };
  }

  // Callout points on named structures. Finger points ride on their joint.
  const radiusAxis = (() => {
    const m = Object.entries(boneMeshes).find(([n]) => /^Radius/.test(n))?.[1];
    return m ? boneAxis(m, capAxis.center) : null;
  })();
  const sideOf = (f) => new THREE.Vector3().crossVectors(chainSegs(f)[1].dir, palmN).normalize();
  const calloutDefs = {
    median: [carpalTunnel.clone().addScaledVector(palmN, 0.001), null],
    ligament: [carpalTunnel.clone().addScaledVector(palmN, 0.0065).addScaledVector(radial, -0.006), null],
    a1: [target["ring-finger-phalanx-proximal"].clone().addScaledVector(palmN, 0.009), null],
    flexor: [target["middle-finger-phalanx-intermediate"].clone().addScaledVector(palmN, 0.006), "middle-finger-phalanx-proximal"],
    cmc: [boneAxis(carpal("Trapezium")).center.addScaledVector(palmN, 0.003), null],
    mc1: [mcBase(0).center.clone().addScaledVector(palmN, 0.004), null],
    dq: [scaphoidAxis.center.clone().addScaledVector(radial, scaphoidAxis.radius + 0.008).addScaledVector(up, -0.006), null],
    dq2: [mcBase(0).start.clone().addScaledVector(radial, 0.007).addScaledVector(palmN, -0.003), null],
    ganglion: [ganglionPos.clone().addScaledVector(palmN, -0.004), null],
    scaphoid: [scaphoidAxis.center.clone().addScaledVector(palmN, 0.005), null],
    radius: [radiusAxis ? radiusAxis.start.clone().addScaledVector(radiusAxis.dir, 0.01).addScaledVector(palmN, radiusAxis.radius) : target.wrist.clone(), null],
    aponeurosis: [mcBase(3).center.clone().lerp(mcBase(2).center, 0.5).addScaledVector(palmN, mcBase(3).radius + 0.008), null],
    muscle: [boneAxis(carpal("Trapezium")).center.lerp(mcBase(0).center, 0.6).addScaledVector(palmN, 0.012).addScaledVector(radial, -0.004), null],
    tendon: [target["index-finger-phalanx-proximal"].clone().lerp(target["index-finger-phalanx-intermediate"], 0.5).addScaledVector(palmN, 0.006), "index-finger-phalanx-proximal"],
    nerve: [target["middle-finger-phalanx-proximal"].clone().lerp(target["middle-finger-phalanx-intermediate"], 0.4).addScaledVector(palmN, 0.007).addScaledVector(sideOf(2), 0.005), "middle-finger-phalanx-proximal"],
    artery: [target.wrist.clone().addScaledVector(radial, 0.014).addScaledVector(palmN, 0.007), null],
    vein: [mcBase(2).center.clone().addScaledVector(palmN, -0.012), null],
    metacarpal: [mcBase(2).center.clone(), null],
    phalanx: [target["index-finger-phalanx-proximal"].clone().lerp(target["index-finger-phalanx-intermediate"], 0.5), "index-finger-phalanx-proximal"],
  };
  for (const [id, [pos, jointName]] of Object.entries(calloutDefs)) {
    const o = new THREE.Object3D();
    o.position.copy(pos);
    handSpace.add(o);
    attachTo(o, jointName);
    anchors[id] = { o, nObj: o };
  }

  const glowTex = glowTexture();
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, color: C.glow, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const glow = new THREE.Sprite(glowMat);
  glow.renderOrder = 20;
  scene.add(glow);
  // --- Scanner: a glowing plane sweeps down the hand and peels the skin away
  const scanPlane = new THREE.Plane();
  skinMat.clippingPlanes = [scanPlane];
  let skinTop = -Infinity;
  for (let i = 0; i < skinned.geometry.attributes.position.count; i += 5) {
    skinned.getVertexPosition(i, pv).applyMatrix4(skinned.matrixWorld);
    skinTop = Math.max(skinTop, pv.dot(up));
  }
  const scanLocal = new THREE.Plane(up.clone().negate(), 0);
  const scanTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(128, 128, 20, 128, 128, 128);
    grd.addColorStop(0, "rgba(0,174,239,0)");
    grd.addColorStop(0.55, "rgba(0,174,239,0.08)");
    grd.addColorStop(0.86, "rgba(150,225,252,0.9)");
    grd.addColorStop(1, "rgba(0,174,239,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const scanMat = new THREE.MeshBasicMaterial({ map: scanTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0 });
  const scanRing = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), scanMat);
  scanRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), up);
  scanRing.renderOrder = 30;
  handSpace.add(scanRing);

  // --- Exploded view: each bone remembers its rest place and a direction out
  const explodeParts = [];
  const handCenter = capAxis.center.clone().addScaledVector(up, 0.03);
  scene.updateMatrixWorld(true);
  for (const mesh of Object.values(boneMeshes)) {
    const c = boneAxis(mesh).center;
    const out = c.clone().sub(handCenter);
    const dist = out.length();
    out.normalize().multiplyScalar(0.006 + dist * 0.18);
    const a = mesh.parent.worldToLocal(c.clone());
    const b = mesh.parent.worldToLocal(c.clone().add(out));
    explodeParts.push({ mesh, rest: mesh.position.clone(), delta: b.sub(a) });
  }

  // --- Nerve signals for the carpal tunnel demonstration
  const glowTexS = glowTexture();
  const signalCurves = [0, 1, 2].map((fi) => {
    const names = chainNames(fi);
    const pts = [
      target.wrist.clone().addScaledVector(up, -0.012).addScaledVector(palmN, 0.007),
      carpalTunnel.clone(),
      mcBase(fi).center.clone().addScaledVector(palmN, mcBase(fi).radius + 0.004),
      ...names.slice(1).map((n) => target[n].clone().addScaledVector(palmN, 0.006)),
    ];
    return new THREE.CatmullRomCurve3(pts, false, "centripetal");
  });
  const signals = [];
  for (let fi = 0; fi < 3; fi++)
    for (let k = 0; k < 3; k++) {
      const m = new THREE.SpriteMaterial({ map: glowTexS, color: C.nerve, transparent: true, depthTest: false, blending: THREE.AdditiveBlending, opacity: 0 });
      const sp = new THREE.Sprite(m);
      sp.scale.setScalar(0.011);
      sp.renderOrder = 25;
      handSpace.add(sp);
      signals.push({ sp, curve: signalCurves[fi], offset: k / 3 + fi * 0.11 });
    }
  const tips = [0, 1, 2].map((fi) => {
    const m = new THREE.SpriteMaterial({ map: glowTexS, color: C.hot, transparent: true, depthTest: false, blending: THREE.AdditiveBlending, opacity: 0 });
    const sp = new THREE.Sprite(m);
    sp.scale.setScalar(0.02);
    sp.renderOrder = 26;
    sp.position.copy(target[chainNames(fi).at(-1)]);
    handSpace.add(sp);
    return sp;
  });

  // --- Fracture demonstration: a crack line across the end of the radius
  const radiusMesh = Object.entries(boneMeshes).find(([n]) => /^Radius/.test(n))?.[1];
  const crackMat = new THREE.LineBasicMaterial({ color: C.hot, transparent: true, opacity: 0, depthTest: false, blending: THREE.AdditiveBlending });
  let crack = null;
  if (radiusMesh) {
    const ra = boneAxis(radiusMesh, capAxis.center);
    const base = ra.start.clone().addScaledVector(ra.dir, 0.011);
    const across = new THREE.Vector3().crossVectors(ra.dir, palmN).normalize();
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10 - 0.5;
      pts.push(base.clone().addScaledVector(across, t * ra.radius * 2.6).addScaledVector(ra.dir, (i % 2 ? 1 : -1) * 0.0012).addScaledVector(palmN, ra.radius + 0.0012));
    }
    crack = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), crackMat);
    crack.renderOrder = 27;
    attachTo(crack);
  }

  // --- Intro: the hand assembles from particles
  const introCount = Math.min(9000, skinned.geometry.attributes.position.count);
  const pTarget = new Float32Array(introCount * 3);
  const pStart = new Float32Array(introCount * 3);
  const pDelay = new Float32Array(introCount);
  const step = skinned.geometry.attributes.position.count / introCount;
  const topY = skinTop;
  const botY = target.wrist.dot(up) - 0.02;
  for (let i = 0; i < introCount; i++) {
    skinned.getVertexPosition(Math.floor(i * step), pv).applyMatrix4(skinned.matrixWorld);
    pTarget.set([pv.x, pv.y, pv.z], i * 3);
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const st = pv.clone().addScaledVector(dir, 0.06 + Math.random() * 0.16);
    pStart.set([st.x, st.y, st.z], i * 3);
    pDelay[i] = THREE.MathUtils.clamp((pv.dot(up) - botY) / (topY - botY), 0, 1) * 0.6 + Math.random() * 0.25;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pTarget, 3));
  pGeo.setAttribute("aStart", new THREE.BufferAttribute(pStart, 3));
  pGeo.setAttribute("aDelay", new THREE.BufferAttribute(pDelay, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uFade: { value: 0 }, uScale: { value: 300 }, uColorA: { value: C.ember }, uColorB: { value: C.hot } },
    vertexShader: /* glsl */ `
      attribute vec3 aStart;
      attribute float aDelay;
      uniform float uT;
      uniform float uScale;
      varying float vP;
      void main() {
        float p = clamp((uT - aDelay * 0.55) / 0.45, 0.0, 1.0);
        p = 1.0 - pow(1.0 - p, 3.0);
        vP = p;
        vec3 pos = mix(aStart, position, p);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uScale * (0.0035 + (1.0 - p) * 0.004) / -mv.z;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFade;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vP;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * (1.0 - uFade) * (0.35 + 0.65 * vP);
        gl_FragColor = vec4(mix(uColorB, uColorA, vP), a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  particles.frustumCulled = false;
  particles.renderOrder = 40;
  handSpace.add(particles);
  let introT = options.intro && !reducedMotion ? 0 : 1;

  // --- Ambient embers drifting through the light (scene space, not the hand)
  const emberCount = lowPower ? 160 : 360;
  const ePos = new Float32Array(emberCount * 3);
  const eSeed = new Float32Array(emberCount);
  for (let i = 0; i < emberCount; i++) {
    ePos.set([(Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.4 - 0.05], i * 3);
    eSeed[i] = Math.random();
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
  eGeo.setAttribute("aSeed", new THREE.BufferAttribute(eSeed, 1));
  const eMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAlpha: { value: 0 }, uScale: { value: 600 }, uColor: { value: C.ember } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uScale;
      varying float vTw;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + uTime * (0.006 + aSeed * 0.01) + 0.25, 0.5) - 0.25;
        p.x += sin(uTime * 0.4 + aSeed * 30.0) * 0.012;
        vTw = 0.4 + 0.6 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 40.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uScale * (0.0012 + aSeed * 0.0016) / -mv.z;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      uniform vec3 uColor;
      varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * uAlpha * vTw);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const embers = new THREE.Points(eGeo, eMat);
  embers.frustumCulled = false;
  scene.add(embers);

  // --- Display orientation: fingers up, palm to camera, thumb to the right ---
  const basis = new THREE.Matrix4().makeBasis(side, up, palmN);
  handSpace.quaternion.setFromRotationMatrix(basis).invert();
  handSpace.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(skinned, true);
  const center = box.getCenter(new THREE.Vector3());
  handSpace.position.sub(center);
  const fitRadius = box.getSize(new THREE.Vector3()).length() * 0.5;

  // ------------------------------------------------------------- state ---
  const cur = makePose({});
  let tgt = makePose({});
  let userYaw = 0;
  let userPitch = 0;
  let motion = !reducedMotion;
  let visible = true;
  let dragging = false;
  let raf = 0;
  let disposed = false;
  let springBack = options.springBack ?? true;
  const timer = new THREE.Timer();

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    invalidate();
  }

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const anchorWorld = (id, out) => anchors[id].o.getWorldPosition(out);

  const curlNow = [0, 0, 0, 0, 0];
  const demo = { triggerCatch: 0, thumbFlash: 0, dqStretch: 0, fallFlash: 0, jolt: 0 };
  const ease = (x) => x * x * (3 - 2 * x);

  // Looping demonstrations. Each is weighted by its act_ value, so they fade
  // in and out with scrolling; with reduced motion they hold a still pose.
  function updateDemos(time) {
    for (let i = 0; i < 5; i++) curlNow[i] = cur[`curl${i}`];
    const T = motion ? time : 1.2;
    const add = (i, v) => (curlNow[i] = Math.max(curlNow[i], v));

    const aT = cur.act_trigger;
    if (aT > 0.001) {
      const ph = (T % 3.4) / 3.4;
      let c;
      if (ph < 0.32) c = ease(ph / 0.32) * 0.42;
      else if (ph < 0.55) c = 0.42 + 0.015 * Math.sin(ph * 90);
      else if (ph < 0.6) c = 0.42 + ((ph - 0.55) / 0.05) * 0.5;
      else if (ph < 0.8) c = 0.92;
      else c = 0.92 * (1 - ease((ph - 0.8) / 0.2));
      add(3, aT * c);
      add(2, aT * c * 0.25);
      add(4, aT * c * 0.3);
      demo.triggerCatch = aT * (ph > 0.3 && ph < 0.6 ? 1 : 0.15);
    } else demo.triggerCatch = 0;

    const aP = cur.act_thumb;
    if (aP > 0.001) {
      const p = 0.5 - 0.5 * Math.cos(T * 2.0);
      add(0, aP * (0.2 + 0.55 * p));
      add(1, aP * 0.42 * p);
      demo.thumbFlash = aP * Math.max(0, (p - 0.75) / 0.25);
    } else demo.thumbFlash = 0;

    const aD = cur.act_dq;
    if (aD > 0.001) {
      const p = 0.5 - 0.5 * Math.cos(T * 1.5);
      add(0, aD * (0.45 + 0.4 * p));
      for (let i = 1; i < 5; i++) add(i, aD * 0.78 * p);
      demo.dqStretch = aD * p;
    } else demo.dqStretch = 0;

    const aU = cur.act_dup;
    if (aU > 0.001) {
      const p = 0.5 - 0.5 * Math.cos(T * 0.7);
      add(3, aU * (0.25 + 0.45 * p));
      add(4, aU * (0.3 + 0.45 * p));
      add(2, aU * 0.12 * p);
    }

    const aE = cur.act_exam;
    if (aE > 0.001) {
      const g = 0.5 - 0.5 * Math.cos(T * 1.3);
      add(0, aE * 0.5 * g);
      for (let i = 1; i < 5; i++) add(i, aE * 0.7 * g);
    }

    const aF = cur.act_fall;
    if (aF > 0.001) {
      const ph = motion ? (T % 2.8) / 2.8 : 0.5;
      const hit = Math.exp(-ph * 9);
      demo.jolt = motion ? aF * hit : 0;
      demo.fallFlash = aF * (motion ? hit : 0.6);
      crackMat.opacity = aF * Math.min(1, 0.35 + ph * 1.5);
    } else {
      demo.jolt = 0;
      demo.fallFlash = 0;
      crackMat.opacity = 0;
    }
    if (crack) crack.visible = crackMat.opacity > 0.01;

    // Carpal tunnel: signals travel down the median nerve and falter in the tunnel
    const aC = cur.act_carpal;
    for (const sg of signals) {
      if (aC < 0.01) {
        sg.sp.material.opacity = 0;
        continue;
      }
      const t = ((motion ? T * 0.32 : 0.4) + sg.offset) % 1;
      sg.sp.position.copy(sg.curve.getPointAt(t));
      const inTunnel = t > 0.12 && t < 0.3;
      const flicker = inTunnel ? 0.25 + 0.5 * Math.abs(Math.sin(T * 37 + sg.offset * 20)) : t > 0.3 ? 0.35 : 1;
      sg.sp.material.opacity = aC * flicker * Math.sin(Math.min(1, t * 1.15) * Math.PI) * 0.95;
    }
    tips.forEach((sp, i) => {
      const fl = motion ? 0.25 + 0.75 * Math.max(0, Math.sin(T * (11 + i * 3.7) + i)) ** 4 : 0.5;
      sp.material.opacity = aC * fl * 0.9;
    });

    // Exploded bones
    const ex = cur.explode * (motion ? 0.82 + 0.18 * Math.sin(T * 1.1) : 1);
    for (const p of explodeParts) p.mesh.position.copy(p.rest).addScaledVector(p.delta, ex);
  }

  function applyCurls() {
    for (const f of flex) {
      const c = curlNow[f.finger];
      f.joint.quaternion.copy(f.rest);
      if (c > 0.0005) f.joint.quaternion.multiply(qTmp.setFromAxisAngle(f.axis, f.maxAngle * c));
    }
  }

  function applyLayers(time) {
    const breathe = motion ? 0.5 + 0.5 * Math.sin(time * 2.6) : 0.7;
    const dark = cur.dark;
    const introSkin = THREE.MathUtils.smoothstep(introT, 0.7, 1);
    skinMat.opacity = cur.skin * introSkin;
    skinMat.depthWrite = cur.skin > 0.75;
    skinned.visible = cur.skin * introSkin > 0.01 && cur.scan < 0.995;
    skinned.castShadow = cur.skin > 0.75 && cur.scan < 0.5;
    // Scanner height runs from just above the fingertips to just below the wrist
    const scanH = THREE.MathUtils.lerp(skinTop + 0.004, botY - 0.01, cur.scan);
    scanLocal.constant = scanH;
    scanPlane.copy(scanLocal).applyMatrix4(handSpace.matrixWorld);
    scanRing.position.copy(up).multiplyScalar(scanH).add(handCenter.clone().sub(up.clone().multiplyScalar(handCenter.dot(up))));
    scanMat.opacity = cur.scan > 0.01 && cur.scan < 0.99 ? Math.sin(cur.scan * Math.PI) * 1.4 : 0;
    scanRing.visible = scanMat.opacity > 0.01;
    rimMat.uniforms.uColor.value.copy(C.rimLight).lerp(C.rimDark, dark);
    rimMat.uniforms.uOpacity.value = (0.22 + Math.max(1 - cur.skin, cur.scan) * 0.7) * introSkin;
    rimMat.blending = THREE.AdditiveBlending;
    renderer.toneMappingExposure = 1.0 + dark * 0.1;
    scene.environmentIntensity = 0.75 - dark * 0.25;

    for (const [layer, mats] of Object.entries(layerMats)) {
      for (const m of mats) {
        const h = m.userData.hl ? cur[`hl_${m.userData.hl}`] : 0;
        const v = Math.max(cur[layer], h * 0.95);
        m.opacity = Math.max(m.userData.baseOpacity * cur[layer], h * 0.95);
        m.visible = v > 0.01;
        m.depthWrite = v > 0.6;
      }
    }
    const hot = (k) => cur[`hl_${k}`] * (0.55 + 0.75 * breathe);
    for (const [k, mats] of Object.entries(hlMats)) {
      const v = hot(k);
      const w = cur[`hl_${k}`];
      for (const m of mats) {
        // Lit-up structures turn coral and glow, so they read at a glance
        m.color.copy(m.userData.baseColor).lerp(C.hot, w * 0.85);
        m.emissive.copy(C.hot);
        const extra = k === "trigger" ? demo.triggerCatch : k === "thumb" ? demo.thumbFlash : k === "dequervain" ? demo.dqStretch : k === "scaphoid" ? demo.fallFlash : 0;
        m.emissiveIntensity = m.userData.baseEmissive * (1 - w) + v * 0.75 + extra * 1.6;
      }
    }
    lesionMat.opacity = Math.min(1, cur.hl_ganglion * 1.4) * 0.95;
    ganglion.visible = lesionMat.opacity > 0.01;
    const grow = cur.act_ganglion * (motion ? 0.5 + 0.5 * Math.sin(time * 1.6) : 0.6);
    ganglion.scale.set(1, 0.8, 0.7).multiplyScalar(0.6 + 0.25 * cur.hl_ganglion + 0.45 * grow);

    // Glow at the strongest highlighted region
    let bestR = null;
    let bestW = 0;
    for (const r of REGIONS) {
      const w = cur[`f_${r}`];
      if (w > bestW) [bestR, bestW] = [r, w];
    }
    if (bestR && bestW > 0.02) {
      anchorWorld(bestR, glow.position);
      glowMat.opacity = Math.min(1, bestW * 1.2) * (0.2 + 0.2 * breathe) * (0.5 + 0.5 * dark);
      glow.scale.setScalar(0.018 + 0.008 * breathe);
    } else glowMat.opacity = 0;

  }

  const projV = new THREE.Vector3();
  const projN = new THREE.Vector3();
  // Screen position of a named anchor, in CSS pixels of the container
  function projectAnchor(id) {
    const a = anchors[id];
    if (!a) return null;
    a.o.getWorldPosition(projV);
    camera.getWorldDirection(projN);
    const toCam = camera.position.clone().sub(projV).normalize();
    projV.project(camera);
    return { x: (projV.x * 0.5 + 0.5) * container.clientWidth, y: (-projV.y * 0.5 + 0.5) * container.clientHeight, z: projV.z, toCam };
  }

  function updateMarkers() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.getWorldDirection(camDir);
    for (const [id, el] of Object.entries(markerEls)) {
      if (!el || !anchors[id]) continue;
      anchorWorld(id, v1);
      anchors[id].nObj.getWorldPosition(v2);
      const facing = -v2.sub(v1).normalize().dot(camDir);
      v1.project(camera);
      el.style.transform = `translate3d(${((v1.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v1.y * 0.5 + 0.5) * h).toFixed(1)}px, 0)`;
      const active = cur[`f_${id}`];
      const op = cur.markers * Math.max(active, Math.max(0, Math.min(1, facing * 2.2)) * 0.6);
      el.style.opacity = op.toFixed(2);
      el.dataset.active = active > 0.5 ? "true" : "false";
    }
  }

  function frameLoop(ts) {
    raf = 0;
    if (disposed) return;
    timer.update(ts);
    const dt = Math.min(timer.getDelta(), 0.1);
    const time = timer.getElapsed();

    const k = motion ? 1 - Math.exp(-dt * 6.5) : 1;
    let delta = 0;
    for (const key of POSE_KEYS) {
      const d = tgt[key] - cur[key];
      cur[key] += d * k;
      delta = Math.max(delta, Math.abs(d));
    }
    if (springBack && !dragging) {
      userYaw *= motion ? Math.exp(-dt * 1.5) : 0;
      userPitch *= motion ? Math.exp(-dt * 1.5) : 0;
    }

    updateDemos(time);
    applyCurls();
    eMat.uniforms.uTime.value = motion ? time : 0;
    eMat.uniforms.uAlpha.value = 0.35 + cur.dark * 0.45;
    eMat.uniforms.uScale.value = renderer.domElement.height;
    // Arteries pulse at a resting heart rate when the vessels are on show
    if (shared.arteries) {
      const beat = motion ? Math.pow(Math.max(0, Math.sin(time * 7.3)), 12) + 0.4 * Math.pow(Math.max(0, Math.sin(time * 7.3 - 0.9)), 12) : 0;
      shared.arteries.emissiveIntensity = 0.05 + beat * 0.9 * cur.vessels;
    }
    if (introT < 1) {
      introT = Math.min(1, introT + dt / 2.6);
      pMat.uniforms.uT.value = introT * 1.25;
      pMat.uniforms.uFade.value = THREE.MathUtils.smoothstep(introT, 0.8, 1);
      pMat.uniforms.uScale.value = renderer.domElement.height;
    }
    particles.visible = introT < 1;
    lightAim.lerp(pointerAim, 1 - Math.exp(-dt * 3));
    key.position.set(0.35 + lightAim.x * 0.6, 0.65 + lightAim.y * 0.4, 0.9);
    const float = motion && !dragging ? Math.sin(time * 0.7) * 0.05 : 0;
    pivot.rotation.set(cur.pitch + userPitch + float * 0.3 - demo.jolt * 0.22, cur.yaw + userYaw + float, demo.jolt * 0.05 * Math.sin(time * 60), "YXZ");
    pivot.position.y = motion ? Math.sin(time * 0.9) * 0.002 : 0;
    scene.updateMatrixWorld(true);
    clipPlane.copy(localClip).applyMatrix4(handSpace.matrixWorld);

    // Camera: frame the hand, then lean towards the focused region
    const focus = new THREE.Vector3();
    let fSum = 0;
    for (const r of REGIONS) {
      const w = cur[`f_${r}`];
      if (w < 0.001) continue;
      focus.addScaledVector(anchorWorld(r, v1), w);
      fSum += w;
    }
    if (fSum > 1) focus.divideScalar(fSum);
    const fov = (camera.fov * Math.PI) / 180;
    const narrow = camera.aspect < 0.9;
    const fit = (fitRadius / Math.sin(fov / 2)) * (narrow ? Math.min(1.9, 0.95 / Math.max(camera.aspect, 0.45)) : 1) * 0.88;
    camera.position.set(focus.x, focus.y, focus.z + fit / cur.zoom);
    camera.lookAt(focus);
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    const ox = narrow ? 0 : cur.x;
    const oy = narrow ? narrowLift : cur.y;
    camera.setViewOffset(w, h, -ox * w, oy * h, w, h);
    camera.updateMatrixWorld();

    applyLayers(time);
    renderer.render(scene, camera);
    updateMarkers();
    options.onFrame?.(projectAnchor, cur);

    const busy = delta > 0.0005 || dragging || motion || introT < 1 || Math.abs(userYaw) > 0.001;
    if (visible && busy) raf = requestAnimationFrame(frameLoop);
  }

  function invalidate() {
    if (!raf && visible && !disposed) {
      timer.update();
      raf = requestAnimationFrame(frameLoop);
    }
  }

  // --- Input: drag to turn (horizontal only on touch, so the page still scrolls)
  let lastX = 0;
  let lastY = 0;
  let pid = null;
  canvas.style.touchAction = "pan-y";
  const onDown = (e) => {
    pid = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    dragging = true;
    invalidate();
  };
  const pointerAim = new THREE.Vector2();
  const lightAim = new THREE.Vector2();
  const onAim = (e) => {
    pointerAim.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    if (motion) invalidate();
  };
  window.addEventListener("pointermove", onAim);
  const onMove = (e) => {
    if (!dragging || e.pointerId !== pid) return;
    userYaw += (e.clientX - lastX) * 0.008;
    if (e.pointerType !== "touch") userPitch = THREE.MathUtils.clamp(userPitch + (e.clientY - lastY) * 0.005, -0.8, 0.8);
    lastX = e.clientX;
    lastY = e.clientY;
    invalidate();
  };
  const onUp = () => {
    dragging = false;
    pid = null;
    invalidate();
  };
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate();
  });
  io.observe(container);
  const onVis = () => {
    visible = document.visibilityState === "visible";
    if (visible) invalidate();
  };
  document.addEventListener("visibilitychange", onVis);

  resize();
  // Start at the target pose rather than easing in from defaults
  if (options.initialPose) {
    Object.assign(cur, makePose(options.initialPose));
    tgt = { ...cur };
  }
  invalidate();
  onReady?.();

  return {
    setPose(pose) {
      tgt = pose.yaw === undefined || pose.curl0 === undefined ? makePose(pose) : pose;
      invalidate();
    },
    rotate(dYaw, dPitch = 0) {
      userYaw += dYaw;
      userPitch = THREE.MathUtils.clamp(userPitch + dPitch, -0.8, 0.8);
      invalidate();
    },
    resetView() {
      userYaw = 0;
      userPitch = 0;
      invalidate();
    },
    setSpringBack(on) {
      springBack = on;
    },
    setMotion(on) {
      motion = on;
      invalidate();
    },
    invalidate,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onAim);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        mats.forEach((m) => {
          m.map?.dispose?.();
          m.dispose?.();
        });
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export { HL_KEYS };
