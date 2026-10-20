import { approved } from "./approved";
import { draft } from "./draft";

// Drafts are shown, marked, in development and in review builds
// (NEXT_PUBLIC_COPY_PREVIEW=drafts). A production build without that flag
// shows only approved copy, and a TODO marker where approval is pending.
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_COPY_PREVIEW === "drafts";

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

// Resolve a copy path to { status, value }.
//   status "approved": approved text
//   status "draft":    draft text, preview builds only
//   status "todo":     nothing usable yet; value is { todo: what is missing }
export function resolve(path) {
  const a = get(approved, path);
  if (a !== undefined) return { status: "approved", value: a };
  const d = get(draft, path);
  if (d === undefined) return { status: "todo", value: { todo: `Missing copy: ${path}` } };
  if (d && typeof d === "object" && "todo" in d) return { status: "todo", value: d };
  if (!SHOW_DRAFTS) return { status: "todo", value: { todo: "Awaiting approval" } };
  return { status: "draft", value: d };
}

// Plain text for attributes and metadata. Empty when nothing is usable.
export function text(path) {
  const { status, value } = resolve(path);
  return status === "todo" || typeof value !== "string" ? "" : value;
}
