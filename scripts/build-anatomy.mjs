// Builds public/models/anatomy/hand-anatomy.glb from the Open3DModel
// "Hand, complete" (AnatomyTOOL / Open3D project, CC BY-SA 4.0), available at
// https://caskanatomy.info/open3dviewer/3dmodels/hand/hand.glb
//
// Keeps the structures the site explains, drops the rest, simplifies the
// meshes and Draco-compresses the result. Shapes are not otherwise changed.
// Run:  node scripts/build-anatomy.mjs path/to/hand.glb
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, draco, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";

const [, , SRC, OUT = "public/models/anatomy/hand-anatomy.glb"] = process.argv;
if (!SRC) throw new Error("Usage: node scripts/build-anatomy.mjs path/to/hand.glb");

const KEEP_GROUPS = new Set(["Bones", "Muscles", "Nerves", "Arteries", "Veins"]);
const KEEP_EXTRA = [/^Annular ligament/, /^Transverse carpal ligament/, /^Flexor retinaculum/, /^Extensor retinaculum/];
const DROP = [/tendon sheath/i, /^Common flexor tendon sheath/, /^Articular capsules/];

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});
const doc = await io.read(SRC);
const root = doc.getRoot();
const scene = root.listScenes()[0];

// Flatten: keep wanted leaf nodes, tag each with its group in extras
let kept = 0;
for (const group of root.listNodes().filter((n) => n.listChildren().length > 0)) {
  const gname = group.getName();
  for (const child of group.listChildren()) {
    const name = child.getName();
    const wanted = (KEEP_GROUPS.has(gname) || KEEP_EXTRA.some((r) => r.test(name))) && !DROP.some((r) => r.test(name));
    if (!wanted || !child.getMesh()) {
      child.dispose();
      continue;
    }
    child.setExtras({ group: KEEP_EXTRA.some((r) => r.test(name)) ? "Ligaments" : gname });
    kept++;
  }
}
// Materials and textures are replaced at runtime
for (const t of root.listTextures()) t.dispose();
for (const mesh of root.listMeshes())
  for (const prim of mesh.listPrimitives()) {
    for (const sem of prim.listSemantics()) if (sem !== "POSITION" && sem !== "NORMAL") prim.setAttribute(sem, null);
  }
root.listExtensionsUsed().forEach((e) => e.extensionName === "KHR_draco_mesh_compression" && e.dispose());

await MeshoptSimplifier.ready;
await doc.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.38, error: 0.0004 }),
  prune(),
  draco({ quantizePosition: 14, quantizeNormal: 10 }),
);
await io.write(OUT, doc);
console.log(`kept ${kept} structures -> ${OUT}`);
