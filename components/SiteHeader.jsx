import Link from "next/link";
import { nav } from "@/lib/site";
import { Container } from "./ui";

export function Logo({ dark = false }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Traverso Hand, home">
      <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true" className="transition group-hover:rotate-[-6deg]">
        <rect width="40" height="40" rx="12" fill="#241c78" />
        <path d="M13 29V17.5a2 2 0 0 1 4 0V24M17 23V13a2 2 0 0 1 4 0v10M21 23V12.5a2 2 0 0 1 4 0V23M25 23v-7a2 2 0 0 1 4 0v8.5c0 3.6-2.9 6.5-6.5 6.5H19" fill="none" stroke="#33c1f5" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className={`block font-serif text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Traverso Hand</span>
        <span className={`hidden text-xs tracking-wide sm:block lg:hidden xl:block ${dark ? "text-white/70" : "text-ink-soft"}`}>Hand and wrist surgery, Coral Springs</span>
      </span>
    </Link>
  );
}

// Floating glass header that sits above the 3D story.
export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="bg-ink text-white">
        <Container className="py-1.5 text-center text-[12px] font-bold text-white/85 sm:text-[13px]">
          Prototype for review. Wording is proposed; clinical content is a draft pending surgeon review.
        </Container>
      </div>
      <Container className="mt-3">
        <div className="flex items-center justify-between gap-6 rounded-full bg-[#0e0a3a]/60 py-2 pl-3 pr-2 text-white shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-xl on-dark">
          <Logo dark />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="whitespace-nowrap rounded-full px-3 py-2 text-[15px] text-white/80 transition hover:bg-white/10 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/contact" className="hidden min-h-11 items-center whitespace-nowrap rounded-full bg-[#00aeef] px-5 font-bold text-[#0e0a3a] transition hover:bg-[#33c1f5] sm:inline-flex">
              Request an appointment
            </Link>
            <details className="relative lg:hidden">
              <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-full px-4 text-white ring-1 ring-white/20 [&::-webkit-details-marker]:hidden">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                Menu
              </summary>
              <nav aria-label="Main" className="absolute right-0 top-14 w-72 rounded-3xl bg-white p-2 text-ink shadow-2xl ring-1 ring-black/5">
                <ul>
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-2xl px-4 py-3 font-bold hover:bg-paper">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/contact" className="mt-1 block rounded-2xl bg-ink px-4 py-3 font-bold text-white">
                      Request an appointment
                    </Link>
                  </li>
                </ul>
              </nav>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}
