// Builds public/models/generic-hand/right-smooth.glb from the MIT-licensed
// WebXR generic hand: two levels of Loop subdivision, with skin weights carried
// through the subdivision so the smoothed mesh still deforms with the rig.
// Run once after changing the source model:  node scripts/build-skin.mjs
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LoopSubdivision } from "three-subdivide";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { draco, prune } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { readFileSync } from "node:fs";

const SRC = "public/models/generic-hand/right.glb";
const OUT = "public/models/generic-hand/right-smooth.glb";
const ITERATIONS = 2;

function smoothSkinnedGeometry(src, iterations, boneCount) {
  const sp = src.attributes.position;
  const si = src.attributes.skinIndex;
  const sw = src.attributes.skinWeight;
  const n = sp.count;
  // The subdivider interpolates vec3 attributes, so pack bone weights 3 at a time
  const groups = Math.ceil(boneCount / 3);
  const base = new THREE.BufferGeometry();
  // three-subdivide hashes positions to 2 decimals; work at 1000x so a 0.2-unit
  // hand keeps distinct vertices distinct
  const SCALE = 1000;
  base.setAttribute("position", sp.clone());
  base.scale(SCALE, SCALE, SCALE);
  for (let g = 0; g < groups; g++) {
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++)
      for (let k = 0; k < 4; k++) {
        const b = si.getComponent(i, k);
        if (b >= g * 3 && b < g * 3 + 3) arr[i * 3 + (b - g * 3)] += sw.getComponent(i, k);
      }
    base.setAttribute(`w${g}`, new THREE.BufferAttribute(arr, 3));
  }
  if (src.index) base.setIndex(src.index.clone());
  let geo = LoopSubdivision.modify(mergeVertices(base, 1e-2), iterations, { split: false, preserveEdges: false });
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo, 1e-3);
  geo.scale(1 / SCALE, 1 / SCALE, 1 / SCALE);
  geo.computeVertexNormals();

  const m = geo.attributes.position.count;
  const joints = new Uint16Array(m * 4);
  const weights = new Float32Array(m * 4);
  const ws = Array.from({ length: groups }, (_, g) => geo.attributes[`w${g}`]);
  const row = new Array(boneCount);
  for (let i = 0; i < m; i++) {
    for (let b = 0; b < boneCount; b++) row[b] = [Math.max(0, ws[Math.floor(b / 3)].getComponent(i, b % 3)) || 0, b];
    row.sort((a, c) => c[0] - a[0]);
    const sum = row[0][0] + row[1][0] + row[2][0] + row[3][0] || 1;
    for (let k = 0; k < 4; k++) {
      joints[i * 4 + k] = row[k][1];
      weights[i * 4 + k] = row[k][0] / sum;
    }
  }
  return { geo, joints, weights };
}

const buf = readFileSync(SRC);
const gltf = await new Promise((res, rej) => new GLTFLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "", res, rej));
let skinned;
gltf.scene.traverse((o) => o.isSkinnedMesh && (skinned = o));
const { geo, joints, weights } = smoothSkinnedGeometry(skinned.geometry, ITERATIONS, skinned.skeleton.bones.length);
console.log(`smoothed: ${skinned.geometry.attributes.position.count} -> ${geo.attributes.position.count} vertices`);

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.encoder": await draco3d.createEncoderModule(),
  "draco3d.decoder": await draco3d.createDecoderModule(),
});
const doc = await io.read(SRC);
const buffer = doc.getRoot().listBuffers()[0];
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0];
const acc = (type, array) => doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
prim.setAttribute("POSITION", acc("VEC3", new Float32Array(geo.attributes.position.array)));
prim.setAttribute("NORMAL", acc("VEC3", new Float32Array(geo.attributes.normal.array)));
prim.setAttribute("JOINTS_0", acc("VEC4", joints));
prim.setAttribute("WEIGHTS_0", acc("VEC4", weights));
prim.setAttribute("TEXCOORD_0", null);
prim.setIndices(acc("SCALAR", new Uint16Array(geo.index.array)));
await doc.transform(prune(), draco({ quantizePosition: 14, quantizeNormal: 10, quantizeGeneric: 12 }));
await io.write(OUT, doc);
console.log(`wrote ${OUT}`);
