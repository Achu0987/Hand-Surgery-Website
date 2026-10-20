"use client";

import HandViewer from "./HandViewer";
import { REGION_POSES } from "@/lib/poses";

export default function ConditionViewer({ region, area }) {
  const pose = { ...REGION_POSES[region], x: 0, y: 0 };
  return (
    <figure className="rounded-[28px] bg-[radial-gradient(500px_400px_at_50%_40%,#1e1870,#0b0833)] p-3 on-dark">
      <HandViewer pose={pose} className="h-[380px] sm:h-[440px]" label={`3D hand highlighting the ${area.toLowerCase()}`} />
      <figcaption className="px-2 pb-1 pt-3 text-sm text-white/75">
        Highlighted: {area}. Real anatomy from the Open3D model; the lit-up structures are the ones this guide explains.
      </figcaption>
    </figure>
  );
}
