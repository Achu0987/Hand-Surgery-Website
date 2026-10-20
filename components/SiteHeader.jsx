import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Container, Copy, ScheduleButton } from "./ui";

// Wordmark only: the final THInc logo file has not been supplied, and no
// stand-in mark is drawn (DESIGN.md §6).
export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 flex-col justify-center leading-tight" aria-label={`${site.name}, home`}>
      <span className="font-medium text-ink">{site.name}</span>
      <span className="hidden text-small text-muted sm:block lg:hidden xl:block">
        <Copy path="ui.tagline" />
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container wide className="flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="whitespace-nowrap rounded-full px-3 py-2 text-ink hover:underline hover:underline-offset-4">
                  <Copy path={`ui.nav.${item.key}`} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {/* Phones use the bottom action bar */}
          <div className="hidden sm:block">
            <ScheduleButton className="min-h-11" />
          </div>
          <details className="relative lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full px-4 font-medium text-ink ring-1 ring-inset ring-ink [&::-webkit-details-marker]:hidden">
              <Copy path="ui.menu" />
            </summary>
            <nav aria-label="Main" className="absolute right-0 top-14 w-72 rounded-card border border-line bg-surface p-2">
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-card px-4 py-3 hover:bg-base">
                      <Copy path={`ui.nav.${item.key}`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
