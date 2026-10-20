"use client";

import { useEffect, useRef, useState } from "react";
import { makePose } from "@/lib/poses";
import { Copy } from "@/components/ui";
import { text } from "@/lib/copy";

// Plain structure name for accessible labels (copy layer, anatomy.structures)
const structureName = (anchor) => text(`anatomy.structures.${anchor}`) || anchor;

const MARGIN_GAP = 12;
// Narrow margins wrap long names onto more lines, so labels need more room
const labelStep = () => (window.matchMedia("(min-width: 640px)").matches ? 40 : 54);

// Compact 3D viewer for symptom pages. Same engine as the home page anatomy
// section, fixed on one region. The page text carries the information.
// - Structure labels sit in the margin with leader lines at every width, never on the
//   figure; every structure is selectable from the figure and from the text
//   list under it (DESIGN.md §8).
// - Motion starts paused: this is a reading page (DESIGN.md §7).
export default function HandViewer({ pose, label, structures = [], className = "" }) {
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const detailsRef = useRef({});
  const [status, setStatus] = useState("idle");
  const [layered, setLayered] = useState(true);
  const [motionOn, setMotionOn] = useState(false);
  const [selected, setSelected] = useState(null);

  const skinPose = { ...pose, scan: 0, skin: 1, bones: 0, muscles: 0, tendons: 0, nerves: 0, vessels: 0, dark: 0 };
  const current = layered ? pose : skinPose;

  const updateOverlay = (project) => {
    const stage = stageRef.current;
    const box = frameRef.current;
    if (!stage || !box || !structures.length) return;
    const LABEL_STEP = labelStep();
    const W = box.clientWidth;
    const H = box.clientHeight;
    const pts = structures.map(([, anchor]) => project(anchor));
    const order = pts.map((p, j) => [p ? p.y : 0, j]).sort((a, b) => a[0] - b[0]);
    const total = (order.length - 1) * LABEL_STEP;
    let y = Math.min(Math.max(24, order[0][0] - total / 2), H - 24 - total);
    const slots = [];
    order.forEach(([py, j], k) => {
      y = Math.max(y, Math.min(py, H - 24 - (order.length - 1 - k) * LABEL_STEP));
      slots[j] = y;
      y += LABEL_STEP;
    });
    structures.forEach((_, j) => {
      const p = pts[j];
      const dot = stage.querySelector(`[data-dot="${j}"]`);
      const lbl = stage.querySelector(`[data-label="${j}"]`);
      const line = stage.querySelector(`[data-line="${j}"]`);
      const visible = p && p.x > 0 && p.x < W && p.y > 0 && p.y < H;
      for (const el of [dot, lbl, line]) if (el) el.style.visibility = visible ? "visible" : "hidden";
      if (!visible) return;
      dot.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      lbl.style.transform = `translate3d(0, ${slots[j].toFixed(1)}px, 0) translateY(-50%)`;
      line.setAttribute("d", `M${p.x.toFixed(1)},${p.y.toFixed(1)} L${(W + 4).toFixed(1)},${slots[j].toFixed(1)} L${(W + MARGIN_GAP - 6).toFixed(1)},${slots[j].toFixed(1)}`);
    });
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let idleId;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
        idleId = ric(async () => {
          const probe = document.createElement("canvas");
          if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return setStatus("failed");
          setStatus("loading");
          try {
            const { createHandEngine } = await import("@/components/three/handEngine");
            if (cancelled) return;
            const engine = await createHandEngine(mountRef.current, {
              reducedMotion: reduced,
              springBack: false,
              initialPose: pose,
              onFrame: (project) => updateOverlay(project),
            });
            if (cancelled) return engine.dispose();
            engineRef.current = engine;
            setStatus("ready");
          } catch (err) {
            console.error(err);
            if (!cancelled) setStatus("failed");
          }
        });
      },
      { rootMargin: "300px" },
    );
    io.observe(frameRef.current);
    return () => {
      cancelled = true;
      io.disconnect();
      (window.cancelIdleCallback || clearTimeout)(idleId);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "ready") engineRef.current?.setPose(makePose(current));
  }, [layered, status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === "ready") engineRef.current?.setMotion(motionOn);
  }, [motionOn, status]);

  const onKeyDown = (e) => {
    const eng = engineRef.current;
    if (!eng || e.target !== e.currentTarget) return;
    const map = {
      ArrowLeft: () => eng.rotate(-0.35),
      ArrowRight: () => eng.rotate(0.35),
      ArrowUp: () => eng.rotate(0, -0.2),
      ArrowDown: () => eng.rotate(0, 0.2),
      l: () => setLayered((v) => !v),
      r: () => eng.resetView(),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  // From the figure: open the matching entry in the text list
  const selectFromFigure = (name) => {
    setSelected(name);
    const d = detailsRef.current[name];
    if (d) {
      d.open = true;
      d.querySelector("summary")?.focus({ preventScroll: true });
    }
  };

  const ready = status === "ready";

  return (
    <div>
      <div ref={stageRef} className={`relative flex ${className}`}>
        <div
          ref={frameRef}
          role="group"
          aria-roledescription="3D viewer"
          aria-label={`${label}. Arrow keys rotate, L switches layers, R resets.`}
          tabIndex={ready ? 0 : -1}
          onKeyDown={onKeyDown}
          className="relative min-w-0 flex-1 overflow-hidden rounded-card"
        >
          <img src="/hand-poster.webp" alt="" className={`absolute inset-0 m-auto h-[85%] object-contain transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`} />
          <div ref={mountRef} aria-hidden="true" className="absolute inset-0" />
          <div className={ready ? "" : "hidden"}>
            {structures.map(([name, anchor], j) => (
              <button
                key={name}
                type="button"
                data-dot={j}
                onClick={() => selectFromFigure(name)}
                aria-label={`${structureName(anchor)}: show in the structure list`}
                aria-pressed={selected === name}
                style={{ visibility: "hidden" }}
                className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full"
              >
                <span className={`block rounded-full bg-ink ring-2 ring-surface ${selected === name ? "h-4 w-4" : "h-2.5 w-2.5"}`} />
              </button>
            ))}
          </div>
          {status === "loading" && (
            <p className="absolute bottom-3 left-3 text-small text-muted">
              <Copy path="ui.viewer.loading" />
            </p>
          )}
          {status === "failed" && (
            <p className="absolute inset-x-3 bottom-3 rounded-card border border-line bg-surface px-3 py-2 text-small text-ink">
              <Copy path="ui.viewer.unavailable" />
            </p>
          )}
        </div>
        {structures.length > 0 && (
          <>
            <div className={`relative w-[104px] shrink-0 sm:w-[160px] ${ready ? "" : "invisible"}`} style={{ marginLeft: MARGIN_GAP }} aria-hidden="true">
              {structures.map(([name, anchor], j) => (
                <span
                  key={name}
                  data-label={j}
                  style={{ visibility: "hidden" }}
                  className={`absolute left-0 top-0 text-small leading-tight text-ink ${selected === name ? "font-medium underline underline-offset-4" : ""}`}
                >
                  <Copy path={`anatomy.structures.${anchor}`} />
                </span>
              ))}
            </div>
            <svg className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${ready ? "" : "hidden"}`} aria-hidden="true">
              {structures.map(([name], j) => (
                <path key={name} data-line={j} fill="none" stroke="var(--muted)" strokeWidth="1" style={{ visibility: "hidden" }} />
              ))}
            </svg>
          </>
        )}
      </div>

      <div className={`mt-3 flex flex-wrap items-center gap-2 ${ready ? "" : "invisible"}`}>
        <div className="inline-flex rounded-full border border-line p-1" role="group" aria-label="View layer">
          {[
            [false, "ui.viewer.skin"],
            [true, "ui.viewer.inside"],
          ].map(([val, path]) => (
            <button
              key={path}
              type="button"
              aria-pressed={layered === val}
              onClick={() => setLayered(val)}
              className={`min-h-8 rounded-full px-3.5 text-small font-medium ${layered === val ? "bg-ink text-surface" : "text-ink"}`}
            >
              <Copy path={path} />
            </button>
          ))}
        </div>
        <TextButton onClick={() => engineRef.current?.rotate(-0.5)} path="ui.viewer.rotateLeft" />
        <TextButton onClick={() => engineRef.current?.rotate(0.5)} path="ui.viewer.rotateRight" />
        <TextButton onClick={() => engineRef.current?.resetView()} path="ui.viewer.reset" />
        <button type="button" aria-pressed={motionOn} onClick={() => setMotionOn((m) => !m)} className="ml-auto min-h-8 px-2 text-small text-muted underline underline-offset-4">
          <Copy path={motionOn ? "ui.viewer.pause" : "ui.viewer.play"} />
        </button>
      </div>

      {structures.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-small font-medium text-muted">
            <Copy path="ui.viewer.structures" />
          </p>
          <ul className="mt-2">
            {structures.map(([name, anchor]) => (
              <li key={name} className="border-b border-line">
                <details ref={(el) => (detailsRef.current[name] = el)} onToggle={(e) => e.currentTarget.open && setSelected(name)} className="group py-2.5">
                  <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                    <span className={selected === name ? "underline underline-offset-4" : ""}><Copy path={`anatomy.structures.${anchor}`} /></span>
                    <span className="text-small text-muted group-open:hidden">
                      <Copy path="ui.viewer.show" />
                    </span>
                    <span className="hidden text-small text-muted group-open:inline">
                      <Copy path="ui.viewer.hide" />
                    </span>
                  </summary>
                  <p className="mt-1 text-small text-muted">
                    <Copy path="anatomy.structurePending" />
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TextButton({ onClick, path }) {
  return (
    <button type="button" onClick={onClick} className="min-h-8 rounded-full border border-line px-3 text-small font-medium text-ink hover:border-ink">
      <Copy path={path} />
    </button>
  );
}

