// Enforces the practice's copy rules on source text: no em dashes, en dashes
// or emoji in anything that can reach the page. Run: npm run lint:copy
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "content", "lib"];
const EXT = new Set([".js", ".jsx", ".mdx", ".md"]);
const BANNED = [
  { name: "em dash", re: /—/g },
  { name: "en dash", re: /–/g },
  { name: "emoji", re: /\p{Extended_Pictographic}/gu },
];

let problems = 0;
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(p))) {
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const { name, re } of BANNED) {
            if (line.match(re)) {
              problems++;
              console.log(`${p}:${i + 1}  ${name}: ${line.trim().slice(0, 100)}`);
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
console.log("Copy check passed: no em dashes, en dashes or emoji.");
