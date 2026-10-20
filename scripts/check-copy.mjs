// Enforces the practice's copy rules on source text (COPY-BRIEF.md §2 and §3,
// DESIGN.md §9): no em dashes, en dashes or emoji, and none of the words the
// brief rules out. Run: npm run lint:copy
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXT = new Set([".js", ".jsx", ".mdx", ".md"]);
// Engine and pose code holds no visible copy
const SKIP = [/handEngine\.js$/, /poses\.js$/];
const BANNED = [
  { name: "em dash", re: /—/g },
  { name: "en dash", re: /–/g },
  { name: "emoji", re: /\p{Extended_Pictographic}/gu },
  { name: "avoided word", re: /\b(cure[sd]?|guaranteed?|miracle|best|pain-free|fix(es)?|instantly|you need surgery)\b/gi },
];

let problems = 0;
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(p)) && !SKIP.some((re) => re.test(p))) {
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const { name, re } of BANNED) {
            const m = line.match(re);
            if (m) {
              problems++;
              console.log(`${p}:${i + 1}  ${name} (${m[0]}): ${line.trim().slice(0, 100)}`);
            }
          }
        });
    }
  }
}
ROOTS.forEach(walk);
if (problems) {
  console.log(`\n${problems} copy rule violation(s).`);
  process.exit(1);
}
console.log("Copy check passed: no em dashes, en dashes, emoji or avoided words.");
