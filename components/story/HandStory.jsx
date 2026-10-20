"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, structures } from "@/lib/story";
import { mixPose } from "@/lib/poses";
import { Copy, Todo } from "@/components/ui";
import { text } from "@/lib/copy";

// Plain structure name for accessible labels (copy layer, anatomy.structures)
const structureName = (anchor) => text(`anatomy.structures.${anchor}`) || anchor;

gsap.registerPlugin(ScrollTrigger);

const N = chapters.length;
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const MARGIN_GAP = 12;
// Narrow margins wrap long names onto more lines, so labels need more room
const labelStep = () => (window.matchMedia("(min-width: 1024px)").matches ? 40 : 54);

// Anatomy section: the one place on the site with scroll-linked visuals
// (DESIGN.md §7). The figure stays in view while the chapters scroll past.
// - Structure labels sit in the margin with leader lines, never on the figure.
// - Every structure is selectable from the figure (a dot) and from the text
//   list below; both open the same entry.
// - Without JS: the chapters read as an article beside a still image.
// - Reduced motion: the figure switches chapter by chapter, with no tweening.
export default function HandStory() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const poseRef = useRef(chapters[0].pose);
  const weightsRef = useRef(chapters.map((_, i) => (i === 0 ? 1 : 0)));
  const detailsRef = useRef({});
  const [status, setStatus] = useState("idle");
  const [selected, setSelected] = useState(null);

  // Leader lines from each structure to its label in the margin
  const updateOverlay = (project) => {
    const stage = stageRef.current;
    const box = boxRef.current;
    if (!stage || !box) return;
    const LABEL_STEP = labelStep();
    const boxW = box.clientWidth;
    const H = box.clientHeight;
    chapters.forEach((c, i) => {
      const w = weightsRef.current[i] || 0;
      const shown = w > 0.05;
      const pts = c.structures.map(([, anchor]) => project(anchor));
      const order = pts.map((p, j) => [p ? p.y : 0, j]).sort((a, b) => a[0] - b[0]);
      // Spread labels down the margin in figure order so they never overlap
      const total = (order.length - 1) * LABEL_STEP;
      let y = Math.min(Math.max(24, order[0][0] - total / 2), H - 24 - total);
      const slots = [];
      order.forEach(([py, j]) => {
        y = Math.max(y, Math.min(py, H - 24 - (order.length - 1 - slots.length) * LABEL_STEP));
        slots[j] = y;
        y += LABEL_STEP;
      });
      c.structures.forEach((_, j) => {
        const p = pts[j];
        const dot = stage.querySelector(`[data-dot="${i}-${j}"]`);
        const label = stage.querySelector(`[data-label="${i}-${j}"]`);
        const line = stage.querySelector(`[data-line="${i}-${j}"]`);
        const visible = shown && p && p.x > 0 && p.x < boxW && p.y > 0 && p.y < H;
        for (const el of [dot, label, line]) {
          if (!el) continue;
          el.style.opacity = visible ? w.toFixed(3) : "0";
          el.style.visibility = visible ? "visible" : "hidden";
        }
        if (!visible) return;
        dot.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        const ly = slots[j];
        label.style.transform = `translate3d(0, ${ly.toFixed(1)}px, 0) translateY(-50%)`;
        const mx = boxW + MARGIN_GAP;
        line.setAttribute("d", `M${p.x.toFixed(1)},${p.y.toFixed(1)} L${(boxW + 4).toFixed(1)},${ly.toFixed(1)} L${(mx - 6).toFixed(1)},${ly.toFixed(1)}`);
      });
    });
  };

  // Boot three.js when idle
  useEffect(() => {
    let cancelled = false;
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
    const id = ric(
      async () => {
        const probe = document.createElement("canvas");
        if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return setStatus("failed");
        setStatus("loading");
        try {
          const { createHandEngine } = await import("@/components/three/handEngine");
          if (cancelled) return;
          const engine = await createHandEngine(mountRef.current, {
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            initialPose: poseRef.current,
            onFrame: (project) => updateOverlay(project),
          });
          if (cancelled) return engine.dispose();
          engineRef.current = engine;
          engine.setPose(poseRef.current);
          setStatus("ready");
        } catch (e) {
          console.error(e);
          if (!cancelled) setStatus("failed");
        }
      },
      { timeout: 1200 },
    );
    return () => {
      cancelled = true;
      (window.cancelIdleCallback || clearTimeout)(id);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Scroll position -> figure pose. Text is never scrubbed.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "[data-chapters]",
        start: "top 55%",
        end: "bottom 55%",
        onUpdate(self) {
          const pos = self.progress * (N - 1);
          const i = Math.min(N - 2, Math.floor(pos));
          let f = smooth(0.25, 0.75, pos - i);
          if (reduced) f = pos - i > 0.5 ? 1 : 0;
          const pose = mixPose(chapters[i].pose, chapters[i + 1].pose, f);
          weightsRef.current = chapters.map((_, k) => (k === i ? 1 - f : k === i + 1 ? f : 0));
          poseRef.current = pose;
          engineRef.current?.setPose(pose);
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const showChapter = (i) => {
    const el = document.getElementById(`chapter-${chapters[i].id}`);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  // From the figure: open the matching entry in the text list
  const selectFromFigure = (label) => {
    setSelected(label);
    const d = detailsRef.current[label];
    if (d) {
      d.open = true;
      d.querySelector("summary")?.focus({ preventScroll: true });
    }
  };

  const ready = status === "ready";

  return (
    <section ref={rootRef} id="anatomy" aria-labelledby="anatomy-heading" className="border-t border-line">
      <div className="mx-auto w-full max-w-[82rem] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <h2 id="anatomy-heading" className="type-title max-w-3xl">
          <Copy path="home.anatomy.title" />
        </h2>
        <p className="reading mt-4 text-muted">
          <Copy path="home.anatomy.body" />
        </p>
        {/* Unreviewed anatomy is marked draft in every build (DESIGN.md §8) */}
        <p className="mt-3 text-small">
          <Todo kind="review">The 3D figure is draft until clinically reviewed. The approved plate image has not been supplied.</Todo>
        </p>

        <div className="mt-10 grid gap-x-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* Figure: stays in view while the chapters scroll */}
          <div className="sticky top-[var(--header-h)] z-10 -mx-4 bg-base px-4 pb-3 pt-2 sm:-mx-6 sm:px-6 lg:order-2 lg:mx-0 lg:h-[calc(100svh-var(--header-h))] lg:px-0 lg:pt-6">
            <figure className="flex h-full flex-col">
              <div ref={stageRef} className="relative flex h-[42svh] min-h-[290px] lg:h-auto lg:min-h-0 lg:flex-1">
                <div ref={boxRef} className="relative flex-1 overflow-hidden rounded-card border border-line bg-surface">
                  <img
                    src="/hand-poster.webp"
                    alt=""
                    className={`absolute inset-0 m-auto h-[88%] w-auto object-contain transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
                  />
                  <div ref={mountRef} aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
                  {/* Structure markers on the figure: selectable, never labelled in place */}
                  <div className={ready ? "" : "hidden"}>
                    {chapters.map((c, i) =>
                      c.structures.map(([label, anchor], j) => (
                        <button
                          key={`${c.id}-${label}`}
                          type="button"
                          data-dot={`${i}-${j}`}
                          onClick={() => selectFromFigure(label)}
                          aria-label={`${structureName(anchor)}: show in the structure list`}
                          aria-pressed={selected === label}
                          style={{ opacity: 0, visibility: "hidden" }}
                          className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full"
                        >
                          <span className={`block rounded-full bg-ink ring-2 ring-surface ${selected === label ? "h-4 w-4" : "h-2.5 w-2.5"}`} />
                        </button>
                      )),
                    )}
                  </div>
                  {status === "loading" && (
                    <p className="absolute bottom-3 left-3 text-small text-muted">
                      <Copy path="ui.viewer.loading" />
                    </p>
                  )}
                </div>

                {/* Margin labels, every width: never on the figure */}
                <div className={`relative w-[104px] shrink-0 lg:w-[180px] ${ready ? "" : "invisible"}`} style={{ marginLeft: MARGIN_GAP }} aria-hidden="true">
                  {chapters.map((c, i) =>
                    c.structures.map(([label, anchor], j) => (
                      <span
                        key={`${c.id}-${label}`}
                        data-label={`${i}-${j}`}
                        style={{ opacity: 0, visibility: "hidden" }}
                        className={`absolute left-0 top-0 text-small leading-tight ${selected === label ? "font-medium text-ink underline underline-offset-4" : "text-ink"}`}
                      >
                        <Copy path={`anatomy.structures.${anchor}`} />
                      </span>
                    )),
                  )}
                </div>
                <svg className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${ready ? "" : "hidden"}`} aria-hidden="true">
                  {chapters.map((c, i) =>
                    c.structures.map(([label], j) => (
                      <path key={`${c.id}-${label}`} data-line={`${i}-${j}`} fill="none" stroke="var(--muted)" strokeWidth="1" style={{ opacity: 0 }} />
                    )),
                  )}
                </svg>
              </div>

              <figcaption className="mt-2 text-small text-muted">
                <Copy path="anatomy.caption" /> <Todo kind="review">Draft</Todo>
              </figcaption>
            </figure>
          </div>

          {/* Chapters */}
          <div data-chapters className="lg:order-1">
            {chapters.map((c, i) => {
              const base = `home.anatomy.chapters.${c.id}`;
              const isCondition = !!c.structures && !["inside", "bones"].includes(c.id);
              return (
                <article
                  key={c.id}
                  id={`chapter-${c.id}`}
                  aria-labelledby={`chapter-${c.id}-title`}
                  className="flex min-h-[62svh] flex-col justify-center border-t border-line py-10 first:border-t-0 lg:min-h-[78svh]"
                >
                  <div data-reveal="up">
                    <p className="text-small text-muted">
                      <Copy path={`${base}.eyebrow`} />
                    </p>
                    <h3 id={`chapter-${c.id}-title`} className="type-section mt-2">
                      <Copy path={`${base}.title`} />
                    </h3>
                    <p className="reading mt-4">
                      <Copy path={`${base}.body`} />
                    </p>
                    <p className="mt-1 text-small text-muted">
                      <span className="sr-only">On the illustration: </span>
                      <Copy path={`${base}.demo`} />
                    </p>
                    {c.legend && (
                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Color key for the illustration">
                        {c.legend.map(([anchor, color]) => (
                          <li key={anchor} className="flex items-center gap-2 text-small">
                            <span className="h-3 w-3 rounded-full border border-line" style={{ background: color }} aria-hidden="true" />
                            <Copy path={`anatomy.structures.${anchor}`} />
                          </li>
                        ))}
                      </ul>
                    )}
                    {isCondition && (
                      <p className="mt-5">
                        <Link href={`/conditions/${c.id}`} className="font-medium text-accent underline underline-offset-4">
                          <Copy path="home.anatomy.readGuide" />
                          <span className="sr-only">: {chapters[i].structures.map(([, a]) => structureName(a)).join(", ")}</span>
                        </Link>
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Text list of every structure: the figure's equal */}
        <div className="mt-12 border-t border-line pt-10">
          <h3 className="type-section">
            <Copy path="home.anatomy.structuresHeading" />
          </h3>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {structures.map((s) => (
              <li key={s.label} className="border-t border-line">
                <details
                  ref={(el) => (detailsRef.current[s.label] = el)}
                  onToggle={(e) => e.currentTarget.open && setSelected(s.label)}
                  className="group py-3"
                >
                  <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                    <span className={selected === s.label ? "underline underline-offset-4" : ""}><Copy path={`anatomy.structures.${s.anchor}`} /></span>
                    <span className="text-small text-muted group-open:hidden">
                      <Copy path="ui.viewer.show" />
                    </span>
                    <span className="hidden text-small text-muted group-open:inline">
                      <Copy path="ui.viewer.hide" />
                    </span>
                  </summary>
                  <p className="mt-2 text-small text-muted">
                    <Copy path="anatomy.structurePending" />
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(s.label);
                      showChapter(s.chapter);
                    }}
                    className="mt-2 min-h-8 text-small font-medium text-ink underline underline-offset-4"
                  >
                    <Copy path="ui.viewer.onFigure" />
                  </button>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
