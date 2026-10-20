"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Section-entry reveals (DESIGN.md §7): transform and opacity only, each item
// once. Content is fully visible without JS and with reduced motion.
//   data-reveal="up"       rises and fades in
//   data-reveal="stagger"  children rise in sequence
// No parallax, pinning or scroll-scrubbing. The anatomy section's figure is
// the only scroll-linked visual, and it lives in HandStory.
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal='up']").forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      gsap.utils.toArray("[data-reveal='stagger']").forEach((el) => {
        gsap.from(el.children, { y: 24, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
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
