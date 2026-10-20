// Builds docs/copy/COPY-DECK.md from lib/copy, in the format COPY-BRIEF.md §7
// asks for: one table per page, keyed by slot, with the proposed text, word
// count, clinical review flag and anything missing. Run: npm run copy:deck
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// The lib files are plain ES modules with no imports; load them as such.
const load = async (rel) => import("data:text/javascript," + encodeURIComponent(readFileSync(new URL(rel, import.meta.url), "utf8")));
const { draft } = await load("../lib/copy/draft.js");
const { approved } = await load("../lib/copy/approved.js");
const { conditions } = await load("../lib/conditions.js");

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

// COPY-BRIEF.md §5
const SLOTS = {
  S1: ["Hero", "Symptom name (fixed)", "Fixed", false],
  S2: ["Hero, meta description", "One-line description", "Ray", true],
  S3: ["Hero", "No diagnosis needed to get in touch", "Ray", true],
  S4: ["Hero, end, aside", "Reviewed by, dates (after approval only)", "Practice", true],
  S5: ["Jump links, headings, Related, aside", "Navigation labels", "Ray", false],
  S6: ["What it may feel like", "Plain-language description", "Ray", true],
  S7: ["Anatomy card", "Caption for the structure", "Ray", true],
  S8: ["How it is evaluated", "Evaluation steps, in order", "Ray", true],
  S9: ["Options", "Nonsurgical options", "Ray", true],
  S10: ["Options", "When surgery is considered", "Ray", true],
  S11: ["Talk it through", "One line, no pressure", "Ray", false],
  S12: ["Disclaimer", "Not a substitute for a consultation", "Ray", true],
  S13: ["Call", "Practice phone number", "Practice", false],
  S14: ["Next step", "Line under \"Still not sure?\"", "Ray", false],
  S15: ["Related", "Symptoms and centres to link", "Ray", true],
  S16: ["Page title, social card", "SEO title and Open Graph text", "Ray", false],
};

const isTodo = (v) => v && typeof v === "object" && "todo" in v;
const words = (v) => {
  if (v == null || isTodo(v)) return 0;
  if (typeof v === "string") return v.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((n, x) => n + words(x), 0);
  return Object.values(v).reduce((n, x) => n + words(x), 0);
};
const todos = (v) => {
  if (isTodo(v)) return [v.todo];
  if (Array.isArray(v)) return v.flatMap(todos);
  if (v && typeof v === "object") return Object.values(v).flatMap(todos);
  return [];
};
const esc = (s) => String(s).replace(/\|/g, "\\|");
const show = (v, key) => {
  if (v == null) return "";
  if (isTodo(v)) return `\`TODO(copy)\`: ${esc(v.todo)}`;
  if (typeof v === "string") return (key ? `**${key}:** ` : "") + esc(v);
  if (Array.isArray(v)) return (key ? `**${key}:**<br>` : "") + v.map((x, i) => `${i + 1}. ${show(x)}`).join("<br>");
  return Object.entries(v)
    .map(([k, x]) => show(x, k))
    .join("<br>");
};
const status = (path) => (get(approved, path) !== undefined ? "Approved" : isTodo(get(draft, path)) ? "Missing" : "Draft");
const pick = (path) => get(approved, path) ?? get(draft, path);

const row = (slot, value, path, extra = "") => {
  const [, what, owner, clinical] = SLOTS[slot];
  const missing = todos(value);
  return `| ${slot} | ${esc(what)} | ${show(value)} | ${words(value)} | ${clinical ? "Yes" : "No"} | ${owner} | ${status(path)} | ${missing.map((m) => esc(m)).join("; ") || extra || ""} |`;
};
const HEAD = "| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |\n| --- | --- | --- | --- | --- | --- | --- | --- |";

const out = [];
out.push("# THInc copy deck");
out.push("");
out.push("Generated from `lib/copy` by `npm run copy:deck`. Do not edit by hand: change `lib/copy/draft.js` and run the script again.");
out.push("");
out.push("- **Draft**: proposed, needs approval. **Approved**: in `lib/copy/approved.js`. **Missing**: a fact we do not have, marked `TODO(copy)`.");
out.push("- Ray approves all wording. Anything marked \"Clinical review: Yes\" also needs Dr. Traverso before it moves to `approved.js`.");
out.push("- Drafts show in preview builds only, with a dotted underline. A production build shows a TODO marker until a slot is approved.");
out.push("");

out.push("## Shared slots (every symptom page)");
out.push("");
out.push(HEAD);
out.push(row("S3", pick("site.reassurance"), "site.reassurance"));
out.push(row("S4", pick("site.reviewed"), "site.reviewed"));
out.push(row("S5", pick("site.labels"), "site.labels"));
out.push(row("S11", pick("site.talkLine"), "site.talkLine"));
out.push(row("S12", pick("site.disclaimer"), "site.disclaimer"));
out.push(row("S13", pick("site.phone"), "site.phone"));
out.push(row("S14", pick("site.nextStepLine"), "site.nextStepLine"));
out.push("");

out.push("## Homepage and anatomy section");
out.push("");
out.push("| Key | Proposed text | Words | Clinical review | Status |\n| --- | --- | --- | --- | --- |");
const homeKeys = [
  ["home.hero.title", false],
  ["home.hero.body", false],
  ["home.hero.chooser", false],
  ["home.anatomy.title", false],
  ["home.anatomy.body", true],
  ["anatomy.caption", true],
  ["anatomy.structurePending", true],
  ["home.anatomy.structuresHeading", false],
  ["home.visit.title", false],
  ["home.visit.steps", false],
  ["home.surgeon.body", false],
  ["home.professionals.title", false],
  ["home.closing.title", false],
  ["home.closing.body", false],
  ["site.emergency", true],
];
for (const [k, clinical] of homeKeys) out.push(`| \`${k}\` | ${show(pick(k))} | ${words(pick(k))} | ${clinical ? "Yes" : "No"} | ${status(k)} |`);
for (const id of Object.keys(draft.home.anatomy.chapters)) {
  const k = `home.anatomy.chapters.${id}`;
  out.push(`| \`${k}\` | ${show(pick(k))} | ${words(pick(k))} | Yes | ${status(k)} |`);
}
out.push("");

// Every other visible label and page line (ui.*, pages.*), one row per key
const flat = (obj, prefix) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) && !isTodo(v) ? flat(v, `${prefix}.${k}`) : [[`${prefix}.${k}`, v]],
  );
out.push("## Interface labels and other pages");
out.push("");
out.push("Not clinical. Ray approves.");
out.push("");
out.push("| Key | Proposed text | Words | Status |\n| --- | --- | --- | --- |");
for (const [k] of [...flat(draft.ui, "ui"), ...flat(draft.pages, "pages")]) out.push(`| \`${k}\` | ${show(pick(k))} | ${words(pick(k))} | ${status(k)} |`);
out.push("");

for (const c of conditions) {
  const p = `symptoms.${c.slug}`;
  const s = pick(p) || {};
  out.push(`## ${c.name}`);
  out.push("");
  out.push(`Page: \`/conditions/${c.slug}\`. Card line on the homepage: ${show(s.card)} (${words(s.card)} words, draft).`);
  out.push("");
  out.push(HEAD);
  out.push(row("S1", c.name, `${p}.S1`).replace("| Draft |", "| Fixed |"));
  for (const slot of ["S2", "S6", "S7", "S8", "S9", "S10", "S15", "S16"]) out.push(row(slot, s[slot], `${p}.${slot}`));
  out.push(`| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |`);
  out.push("");
}

out.push("## Eighth symptom page");
out.push("");
out.push("`TODO(copy)`: COPY-BRIEF.md §4 expects eight symptom pages. Seven exist. The eighth symptom has not been named.");
out.push("");

mkdirSync(new URL("../docs/copy/", import.meta.url), { recursive: true });
writeFileSync(new URL("../docs/copy/COPY-DECK.md", import.meta.url), out.join("\n") + "\n");
console.log("Wrote docs/copy/COPY-DECK.md");
