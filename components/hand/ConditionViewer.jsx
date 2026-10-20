"use client";

import HandViewer from "./HandViewer";
import { REGION_POSES } from "@/lib/poses";
import { chapters } from "@/lib/story";
import { Copy, Todo } from "@/components/ui";

// Anatomy card for a symptom page: the figure, its structures in the margin
// and in a text list, the S7 caption and the approved education caption.
export default function ConditionViewer({ slug, region, area, captionPath, className = "" }) {
  const pose = { ...REGION_POSES[region], x: 0, y: 0, dark: 0 };
  const structures = chapters.find((c) => c.id === slug)?.structures || [];
  return (
    <figure className={`rounded-card border border-line bg-surface p-3 sm:p-4 ${className}`}>
      <HandViewer pose={pose} structures={structures} className="h-[320px] sm:h-[400px]" label={`3D hand highlighting the ${area.toLowerCase()}`} />
      <figcaption className="space-y-1 pb-1 pt-4 text-small">
        <span className="block">
          <Copy path={captionPath} />
        </span>
        <span className="block text-muted">
          <Copy path="anatomy.caption" /> <Todo kind="review">Draft</Todo>
        </span>
      </figcaption>
    </figure>
  );
}
