"use client";

import { useEffect, useRef, useState } from "react";
import { makePose } from "@/lib/poses";

const posterClass = "absolute inset-0 m-auto h-[85%] rounded-[24px] object-contain";
const posterFade = { maskImage: "radial-gradient(ellipse at center, #000 55%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 55%, transparent 78%)" };

// Compact 3D viewer for condition pages. Same engine as the home page story,
// fixed on one region. The canvas is decorative; the page text carries the
// information, and the controls are real buttons with a keyboard path.
export default function HandViewer({ pose, label, className = "" }) {
  const frameRef = useRef(null);
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [layered, setLayered] = useState(true);
  const [motionOn, setMotionOn] = useState(true);

  const skinPose = { ...pose, scan: 0, skin: 1, bones: 0, muscles: 0, tendons: 0, nerves: 0, vessels: 0, dark: 0 };
  const current = layered ? pose : skinPose;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionOn(!reduced);
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
            const engine = await createHandEngine(mountRef.current, { reducedMotion: reduced, springBack: false, initialPose: pose });
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
    if (!eng) return;
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
  const ready = status === "ready";

  return (
    <div className={className}>
      <div
        ref={frameRef}
        role="group"
        aria-roledescription="3D viewer"
        aria-label={`${label}. Arrow keys rotate, L switches layers, R resets.`}
        tabIndex={ready ? 0 : -1}
        onKeyDown={onKeyDown}
        className="relative h-full overflow-hidden rounded-[24px]"
      >
        {/* Still image only as a fallback: its cream background would show as a box while the 3D loads */}
        {status === "failed" && <img src="/hand-poster.webp" alt="" className={posterClass} style={posterFade} />}
        <noscript>
          <img src="/hand-poster.webp" alt="" className={posterClass} style={posterFade} />
        </noscript>
        {status === "loading" && (
          <p className="absolute inset-0 m-auto flex h-fit w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15">
            <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" aria-hidden="true" />
            Preparing the 3D hand
          </p>
        )}
        <div ref={mountRef} className="absolute inset-0" />
        {status === "failed" && (
          <p className="absolute inset-x-3 bottom-3 rounded-xl bg-black/50 px-3 py-2 text-sm text-white">The 3D view is not available on this device.</p>
        )}
      </div>
      <div className={`mt-3 flex flex-wrap items-center gap-2 ${ready ? "" : "invisible"}`}>
        <div className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15" role="group" aria-label="View layer">
          {[
            [false, "Skin"],
            [true, "Inside"],
          ].map(([val, text]) => (
            <button
              key={text}
              type="button"
              aria-pressed={layered === val}
              onClick={() => setLayered(val)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${layered === val ? "bg-cyan-300 text-ink" : "text-white/80 hover:text-white"}`}
            >
              {text}
            </button>
          ))}
        </div>
        <IconButton label="Rotate left" onClick={() => engineRef.current?.rotate(-0.5)}>
          <path d="M9 7H4V2M4.5 7A8 8 0 1 1 4 13" />
        </IconButton>
        <IconButton label="Rotate right" onClick={() => engineRef.current?.rotate(0.5)}>
          <path d="M15 7h5V2M19.5 7A8 8 0 1 0 20 13" />
        </IconButton>
        <IconButton label="Reset view" onClick={() => engineRef.current?.resetView()}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </IconButton>
        <button type="button" aria-pressed={!motionOn} onClick={() => setMotionOn((m) => !m)} className="ml-auto px-2 text-sm text-white/75 hover:text-white hover:underline">
          {motionOn ? "Pause motion" : "Motion paused"}
        </button>
      </div>
    </div>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
