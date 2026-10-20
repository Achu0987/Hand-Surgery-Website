// Checks every token pairing the site uses against WCAG 2.2 AA (DESIGN.md §2).
// Reads the hex values from app/styles/tokens.css. Run: npm run lint:contrast
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/styles/tokens.css", import.meta.url), "utf8");
const t = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
t.white = "#ffffff";

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum, where it is used]
const PAIRS = [
  ["ink", "base", 4.5, "body text on paper"],
  ["ink", "surface", 4.5, "body text on white hero and cards"],
  ["muted", "base", 4.5, "captions and meta on paper"],
  ["muted", "surface", 4.5, "captions and meta on white"],
  ["accent", "base", 4.5, "links on paper"],
  ["accent", "surface", 4.5, "links and secondary buttons on white"],
  ["white", "accent", 4.5, "primary button label"],
  ["ink", "logo-cyan", 4.5, "Next step panel text"],
  ["accent", "logo-cyan", 3, "primary button on the Next step panel (UI component)"],
  ["muted", "surface", 3, "form field borders (UI component)"],
  ["accent", "surface", 3, "focus ring on white"],
  ["accent", "base", 3, "focus ring on paper"],
];

let fail = 0;
for (const [fg, bg, min, where] of PAIRS) {
  const r = ratio(t[fg], t[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min}:1)  ${fg} on ${bg}  ${where}`);
}
// Decorative only, reported for the record (no minimum applies)
for (const [fg, bg, where] of [["line", "base", "hairlines"], ["logo-cyan", "base", "disclaimer rule"]]) {
  console.log(`info  ${ratio(t[fg], t[bg]).toFixed(2).padStart(5)}:1  ${fg} on ${bg}  ${where} (decorative)`);
}
if (fail) {
  console.log(`\n${fail} pairing(s) below WCAG 2.2 AA.`);
  process.exit(1);
}
console.log("\nAll token pairings meet WCAG 2.2 AA.");
