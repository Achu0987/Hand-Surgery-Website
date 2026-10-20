"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-linked reveals driven by data attributes, so pages stay server
// components and read normally without JS or with reduced motion:
//   data-reveal="up"     rise and fade in
//   data-reveal="words"  words rise one after another (use <SplitWords>)
//   data-reveal="mask"   image or block wipes open
//   data-reveal="stagger" children rise in sequence
//   data-parallax="0.2"  drifts against the scroll
//   data-marquee="-30"   moves sideways with the scroll (percent)
//   data-hscroll         pinned horizontal track (child [data-track])
export default function Motion() {
  const pathname = usePathname();

  // The phone menu is a <details>; close it after any menu link is used, so it
  // is not still open on the next page or after jumping within the page.
  useEffect(() => {
    document.querySelectorAll("header details[open]").forEach((d) => (d.open = false));
    const onClick = (e) => {
      const link = e.target.closest("header details a");
      if (link) link.closest("details").open = false;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal='up']").forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray("[data-reveal='words']").forEach((el) => {
        gsap.from(el.querySelectorAll(".sw > span"), {
          yPercent: 110,
          rotate: 4,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray("[data-reveal='mask']").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 12% 18% 12% round 40px)" },
          { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: true } },
        );
      });
      gsap.utils.toArray("[data-reveal='stagger']").forEach((el) => {
        gsap.from(el.children, { y: 70, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.2;
        gsap.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray("[data-marquee]").forEach((el) => {
        const amt = parseFloat(el.dataset.marquee) || -30;
        gsap.fromTo(el, { xPercent: 0 }, { xPercent: amt, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray("[data-hscroll]").forEach((section) => {
        const track = section.querySelector("[data-track]");
        if (!track) return;
        section.setAttribute("data-hscroll-active", "");
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
