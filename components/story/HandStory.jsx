"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/lib/story";
import { mixPose } from "@/lib/poses";
import SplitWords from "@/components/motion/SplitWords";

gsap.registerPlugin(ScrollTrigger);

const N = chapters.length;
const posterClass = "absolute inset-0 m-auto h-[80%] w-auto rounded-[28px] object-contain max-lg:-translate-y-[16%] lg:translate-x-[20%]";
// Soft edges so the fallback still blends into the navy stage
const posterFade = { maskImage: "radial-gradient(ellipse at center, #000 55%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 55%, transparent 78%)" };
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Scroll-driven story. A full-screen 3D hand stays pinned while chapters of
// text scroll over it; scroll position alone decides what the hand shows.
// Without JS: the chapters read as a normal article over a still image.
// With reduced motion: the hand switches chapter by chapter, with no tweening.
export default function HandStory() {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const darkRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);
  const dotsRef = useRef([]);
  const engineRef = useRef(null);
  const poseRef = useRef(chapters[0].pose);
  const hudRef = useRef(null);
  const weightsRef = useRef(chapters.map((_, i) => (i === 0 ? 1 : 0)));

  // Holographic callouts: labels and leader lines that track named structures
  // on the 3D hand every frame, plus a connector from the highlighted word in
  // the text to the structure it names. Decorative: the text says it all.
  const updateHud = (project) => {
    const hud = hudRef.current;
    if (!hud) return;
    const W = hud.clientWidth;
    const H = hud.clientHeight;
    const wide = W >= 1024;
    const stage = hud.getBoundingClientRect();
    chapters.forEach((c, i) => {
      if (!c.callouts) return;
      const w = Math.pow(weightsRef.current[i] || 0, 3);
      const group = hud.querySelectorAll(`[data-hud="${i}"]`);
      group.forEach((el) => (el.style.opacity = w.toFixed(3)));
      if (w < 0.01) return;
      const centre = project("metacarpal");
      c.callouts.forEach(([, anchor], j) => {
        const p = project(anchor);
        const label = hud.querySelector(`[data-label="${i}-${j}"]`);
        const line = hud.querySelector(`[data-line="${i}-${j}"]`);
        const dot = hud.querySelector(`[data-dot="${i}-${j}"]`);
        if (!p || !label || !line) return;
        let dx = p.x - centre.x;
        let dy = p.y - centre.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        if (len < 4) [dx, dy] = [j % 2 ? -0.7 : 0.7, -0.7];
        // Fan labels out so neighbours never stack
        const n = c.callouts.length;
        const spread = (j - (n - 1) / 2) * (n > 2 ? 0.55 : 1.1);
        [dx, dy] = [dx * Math.cos(spread) - dy * Math.sin(spread), dx * Math.sin(spread) + dy * Math.cos(spread)];
        const R = (wide ? 110 : 64) + j * 16;
        const ex = p.x + dx * R * 0.55;
        const ey = p.y + dy * R * 0.55;
        let lx = Math.min(W - 16, Math.max(16, p.x + dx * R));
        const ly = Math.min(H - 24, Math.max(24, ey + dy * R * 0.2));
        const right = dx >= 0;
        line.setAttribute("d", `M${p.x.toFixed(1)},${p.y.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)} L${lx.toFixed(1)},${ly.toFixed(1)}`);
        line.style.strokeDashoffset = (1 - w).toFixed(3);
        dot.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        label.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) translate(${right ? "6px" : "calc(-100% - 6px)"}, -50%)`;
      });
      // Word-to-structure connector (wide screens)
      const conn = hud.querySelector(`[data-conn="${i}"]`);
      const mark = document.querySelector(`[data-term="${i}"]`);
      if (!conn) return;
      if (!wide || !mark || !c.term) {
        conn.setAttribute("d", "");
        return;
      }
      const target = project(c.term[1]);
      const r = mark.getBoundingClientRect();
      const fromLeftPanel = c.side === "left";
      const sx = (fromLeftPanel ? r.right : r.left) - stage.left;
      const sy = r.top + r.height / 2 - stage.top;
      const k = (target.x - sx) * 0.5;
      conn.setAttribute("d", `M${sx.toFixed(1)},${sy.toFixed(1)} C${(sx + k).toFixed(1)},${sy.toFixed(1)} ${(target.x - k).toFixed(1)},${target.y.toFixed(1)} ${target.x.toFixed(1)},${target.y.toFixed(1)}`);
      conn.style.strokeDashoffset = (1 - w).toFixed(3);
    });
  };
  const [status, setStatus] = useState("idle");
  const [active, setActive] = useState(0);

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
            narrowLift: 0.17,
            intro: true,
            initialPose: poseRef.current,
            onFrame: (project) => updateHud(project),
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

  // Scroll -> pose, background, counters
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "[data-chapters]",
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          const pos = self.progress * (N - 1);
          let i = Math.min(N - 2, Math.floor(pos));
          let f = smooth(0.18, 0.82, pos - i);
          if (reduced) f = pos - i > 0.5 ? 1 : 0;
          const pose = mixPose(chapters[i].pose, chapters[i + 1].pose, f);
          weightsRef.current = chapters.map((_, k) => (k === i ? 1 - f : k === i + 1 ? f : 0));
          poseRef.current = pose;
          engineRef.current?.setPose(pose);
          if (darkRef.current) darkRef.current.style.opacity = pose.dark.toFixed(3);
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          const idx = Math.round(pos);
          if (numRef.current) {
            numRef.current.textContent = String(idx + 1).padStart(2, "0");
            numRef.current.style.transform = `translate3d(0, ${((pos - idx) * -60).toFixed(1)}px, 0)`;
          }
          setActive((a) => (a === idx ? a : idx));
        },
      });

      if (reduced) return;
      // Chapter text: words rise in, panel drifts and fades out
      gsap.utils.toArray("[data-chapter]").forEach((el) => {
        const words = el.querySelectorAll(".sw > span");
        const rest = el.querySelectorAll("[data-fade]");
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 75%", end: "top 25%", scrub: 0.5 } })
          .from(words, { yPercent: 115, rotate: 5, stagger: 0.04, ease: "power3.out" })
          .from(rest, { y: 40, opacity: 0, stagger: 0.08, ease: "power2.out" }, "<0.15");
        gsap.to(el.querySelector("[data-panel]"), {
          y: -80,
          opacity: 0,
          ease: "power1.in",
          scrollTrigger: { trigger: el, start: "bottom 70%", end: "bottom 15%", scrub: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const goTo = (i) => {
    const el = document.getElementById(`chapter-${chapters[i].id}`);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView();
  };

  return (
    <section ref={rootRef} aria-label="How the hand works, and what can go wrong" className="relative">
      {/* Pinned stage */}
      <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_700px_at_68%_42%,#2a2380_0%,#15104d_45%,#0b0833_100%)]" />
        <div
          ref={darkRef}
          className="absolute inset-0 bg-[radial-gradient(900px_650px_at_62%_45%,#1e1870_0%,#0d0a3d_55%,#05041c_100%)]"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(0,174,239,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        {/* Giant chapter number behind the hand */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            ref={numRef}
            className="select-none font-serif text-[42vw] font-semibold leading-none tracking-tighter text-transparent opacity-30 [-webkit-text-stroke:1.5px_rgba(0,174,239,0.45)] lg:text-[30vw]"
          >
            01
          </span>
        </div>

        {/* Still image only as a fallback (no 3D support, or no JS): its cream
            background would otherwise show as a box while the 3D loads */}
        {status === "failed" && <img src="/hand-poster.webp" alt="" className={posterClass} style={posterFade} />}
        <noscript>
          <img src="/hand-poster.webp" alt="" className={posterClass} style={posterFade} />
        </noscript>
        <div ref={mountRef} className={`absolute inset-0 transition-opacity duration-1000 ${status === "ready" ? "opacity-100" : "opacity-0"}`} />

        <div ref={hudRef} className={`pointer-events-none absolute inset-0 ${status === "ready" ? "" : "hidden"}`}>
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="hud-conn" x1="0" x2="1">
                <stop offset="0" stopColor="#00aeef" stopOpacity="0.15" />
                <stop offset="1" stopColor="#00aeef" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {chapters.map((c, i) =>
              c.callouts ? (
                <g key={c.id} data-hud={i} style={{ opacity: 0 }}>
                  <path data-conn={i} pathLength="1" fill="none" stroke="url(#hud-conn)" strokeWidth="1.5" strokeDasharray="1" strokeDashoffset="1" />
                  {c.callouts.map(([label], j) => (
                    <g key={label}>
                      <path data-line={`${i}-${j}`} pathLength="1" fill="none" stroke="#00aeef" strokeOpacity="0.8" strokeWidth="1.2" strokeDasharray="1" strokeDashoffset="1" />
                      <g data-dot={`${i}-${j}`}>
                        <circle r="9" fill="none" stroke="#00aeef" strokeOpacity="0.5" className="hud-ping" />
                        <circle r="3.5" fill="#00aeef" />
                      </g>
                    </g>
                  ))}
                </g>
              ) : null,
            )}
          </svg>
          {chapters.map((c, i) =>
            c.callouts
              ? c.callouts.map(([label], j) => (
                  <div
                    key={`${c.id}-${label}`}
                    data-hud={i}
                    data-label={`${i}-${j}`}
                    style={{ opacity: 0 }}
                    className="absolute left-0 top-0 whitespace-nowrap rounded-md border border-[#00aeef]/40 bg-[#050a26]/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#cdeffc] shadow-[0_0_24px_-6px_rgba(0,174,239,0.6)] backdrop-blur-sm sm:text-xs"
                  >
                    {label}
                  </div>
                ))
              : null,
          )}
        </div>

        {/* Progress */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-white/5">
          <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-[#00aeef] via-[#5cccf7] to-[#00aeef]" style={{ transform: "scaleX(0)" }} />
        </div>
        {status === "loading" && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#00aeef]" />
            Preparing the 3D hand
          </div>
        )}
      </div>

      {/* Chapter rail (desktop) */}
      <nav aria-label="Story chapters" className="pointer-events-none absolute inset-y-0 right-5 z-20 hidden xl:block">
        <ol className="pointer-events-auto sticky top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                ref={(el) => (dotsRef.current[i] = el)}
                onClick={() => goTo(i)}
                                aria-current={active === i ? "step" : undefined}
                className="group flex h-8 w-4 items-center justify-center"
              >
                <span className="sr-only">{c.eyebrow}</span>
                <span className={`block rounded-full transition-all duration-500 ${active === i ? "h-8 w-1.5 bg-[#00aeef]" : "h-1.5 w-1.5 bg-white/30"}`} />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Chapters scroll over the stage */}
      <div data-chapters className="relative z-10 -mt-[100svh]">
        {chapters.map((c, i) => {
          const dark = true;
          const HeadingTag = i === 0 ? "h1" : "h2";
          return (
            <article
              key={c.id}
              id={`chapter-${c.id}`}
              data-chapter
              className={`flex min-h-[120svh] px-4 sm:px-8 lg:px-16 ${i === 0 ? "items-center" : "items-end pb-[8svh] lg:items-center lg:pb-0"} ${c.side === "right" ? "lg:justify-end" : "lg:justify-start"}`}
            >
              <div
                data-panel
                className={`w-full max-w-xl ${i === 0 ? "" : "rounded-[28px] p-6 backdrop-blur-xl sm:p-8"} ${i === 0 ? "" : dark ? "bg-[#0d0a3d]/65 text-white ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]" : ""} ${i === 0 ? "text-white max-lg:mt-[46svh]" : ""}`}
              >
                <p data-fade className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-cyan-300" : "text-teal"}`}>
                  <span className={`tabular-nums ${dark ? "text-white/50" : "text-ink/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`h-px w-8 ${dark ? "bg-cyan-300/60" : "bg-teal/50"}`} />
                  {c.eyebrow}
                </p>
                <HeadingTag className={`mt-4 font-serif font-semibold leading-[1.02] tracking-tight ${i === 0 ? "text-[2.25rem] sm:text-6xl xl:text-7xl" : "text-[1.85rem] sm:text-5xl"}`}>
                  <SplitWords text={c.title} />
                </HeadingTag>
                <p data-fade className={`mt-5 text-[1.05rem] leading-relaxed sm:text-lg ${dark ? "text-white/80" : "text-ink-soft"}`}>
                  {c.term && c.body.includes(c.term[0]) ? (
                    <>
                      {c.body.split(c.term[0])[0]}
                      <mark data-term={i} className="rounded bg-[#00aeef]/10 px-1 font-bold text-[#7fd8fb] ring-1 ring-[#00aeef]/30">
                        {c.term[0]}
                      </mark>
                      {c.body.split(c.term[0]).slice(1).join(c.term[0])}
                    </>
                  ) : (
                    c.body
                  )}
                  {c.condition && <span className={`ml-2 inline-block rounded-full px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider ${dark ? "bg-white/10 text-amber-200" : "bg-draft-bg text-draft"}`}>Draft</span>}
                </p>

                {c.demo && (
                  <p data-fade className="mt-5 flex items-start gap-3 rounded-2xl bg-[#00aeef]/10 px-4 py-3 text-[15px] leading-snug text-[#cdeffc] ring-1 ring-[#00aeef]/25">
                    <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#00aeef] opacity-70" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
                    </span>
                    <span>
                      <span className="sr-only">On the 3D hand: </span>
                      {c.demo}
                    </span>
                  </p>
                )}

                {c.legend && (
                  <ul data-fade className="mt-6 flex flex-wrap gap-2" aria-label="Colour key">
                    {c.legend.map(([label, color]) => (
                      <li key={label} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-white ring-1 ring-white/10">
                        <span className="h-3 w-3 rounded-full ring-2 ring-white/30" style={{ background: color }} aria-hidden="true" />
                        {label}
                      </li>
                    ))}
                  </ul>
                )}

                {c.steps && (
                  <ol data-fade className="mt-6 grid gap-2 sm:grid-cols-2">
                    {c.steps.map((s, k) => (
                      <li key={s} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3 text-[15px] font-bold text-white ring-1 ring-white/10">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00aeef] text-xs text-[#0e0a3a]">{k + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                )}

                {c.condition && (
                  <p data-fade className="mt-6">
                    <Link
                      href={`/conditions/${c.id}`}
                      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 font-bold transition ${"bg-white text-ink hover:bg-[#9fe0fa]"}`}
                    >
                      Often linked to {c.condition.toLowerCase().startsWith("de ") || c.condition.startsWith("Dup") ? c.condition : c.condition.toLowerCase()}
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full transition group-hover:translate-x-1 ${"bg-[#00aeef] text-ink"}`}>&rarr;</span>
                    </Link>
                  </p>
                )}

                {(i === 0 || c.steps) && (
                  <div data-fade className="mt-8 flex flex-wrap items-center gap-3">
                    <Link href="/contact" className="inline-flex min-h-12 items-center rounded-full bg-[#00aeef] px-6 font-bold text-[#0e0a3a] shadow-[0_10px_40px_-10px_rgba(0,174,239,0.7)] transition hover:-translate-y-0.5 hover:bg-[#33c1f5]">
                      Request an appointment
                    </Link>
                    {i === 0 && (
                      <span className="inline-flex items-center gap-3 px-2 text-sm font-bold text-white/70">
                        <span className="relative flex h-9 w-6 justify-center rounded-full border-2 border-white/30">
                          <span className="mt-1.5 h-2 w-1 animate-bounce rounded-full bg-white/70" />
                        </span>
                        Scroll to look inside
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
