import Link from "next/link";
import HandStory from "@/components/story/HandStory";
import SplitWords from "@/components/motion/SplitWords";
import { Container, Placeholder } from "@/components/ui";
import { conditions } from "@/lib/conditions";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: site.surgeon,
  medicalSpecialty: "Hand surgery",
  address: { "@type": "PostalAddress", addressLocality: "Coral Springs", addressRegion: "FL", addressCountry: "US" },
  url: site.url,
};

export default function HomePage() {
  return (
    <>
      <div data-fullbleed>
        <HandStory />
      </div>

      {/* Scroll-linked statement */}
      <section aria-label="Our approach" className="overflow-hidden border-y border-line bg-paper py-14 sm:py-20">
        <p data-marquee="-35" className="whitespace-nowrap font-serif text-[13vw] font-semibold leading-none tracking-tight text-ink sm:text-[9vw]">
          Understand first <span className="text-coral">/</span> then decide <span className="text-coral">/</span> no pressure{" "}
          <span className="text-coral">/</span>
        </p>
        <p data-marquee="25" aria-hidden="true" className="-ml-[30%] mt-2 whitespace-nowrap font-serif text-[13vw] font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_#0e0a3a] sm:text-[9vw]">
          Listen <span>/</span> examine <span>/</span> explain <span>/</span> decide together <span>/</span>
        </p>
      </section>

      {/* Guides: pinned horizontal track */}
      <section data-hscroll aria-labelledby="guides-heading" className="relative overflow-hidden bg-ink text-white on-dark">
        <div className="flex min-h-[100svh] flex-col justify-center py-16">
          <Container>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Guides</p>
            <h2 id="guides-heading" data-reveal="words" className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              <SplitWords text="Seven common conditions, explained in plain words." />
            </h2>
          </Container>
          <div className="mt-12 overflow-x-auto pb-4 [scrollbar-width:none] lg:overflow-visible">
            <ul data-track className="flex w-max gap-5 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
              {conditions.map((c, i) => (
                <li key={c.slug} className="w-[78vw] max-w-[380px] shrink-0">
                  <Link
                    href={`/conditions/${c.slug}`}
                    className="group relative flex h-[460px] flex-col overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1b1464] to-[#0b0833] p-7 ring-1 ring-white/10 transition duration-500 hover:-translate-y-2 hover:ring-cyan-300/60"
                  >
                    <img
                      src={`/regions/${c.slug}.webp?v=2`}
                      alt=""
                      loading="lazy"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[64%] w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-[40%] h-[30%] bg-gradient-to-b from-transparent to-[#0b0833]" />
                    <span className="relative font-serif text-sm tabular-nums text-white/60">{String(i + 1).padStart(2, "0")}</span>
                    <div className="relative mt-auto">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{c.area}</span>
                      <span className="mt-2 block font-serif text-2xl font-semibold leading-tight">{c.name}</span>
                      <span className="mt-2 block text-white/70">&ldquo;{c.symptom}&rdquo;</span>
                      <span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-200">
                        Read the guide <span className="transition group-hover:translate-x-1">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="flex w-[60vw] max-w-[320px] shrink-0 items-center">
                <Link href="/conditions" className="font-serif text-3xl font-semibold text-white underline decoration-cyan-300 underline-offset-8">
                  All conditions &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Surgeon */}
      <section aria-labelledby="surgeon-heading" className="py-24 sm:py-32">
        <Container className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div data-reveal="mask" className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e4e7f5] via-[#f2f4fb] to-[#dbf3fd]">
            <div data-parallax="0.3" className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <Placeholder>Portrait of Dr. Traverso, supplied by the practice</Placeholder>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Who you will see</p>
            <h2 id="surgeon-heading" data-reveal="words" className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              <SplitWords text={site.surgeon} />
            </h2>
            <p data-reveal="up" className="mt-3 text-lg text-ink-soft">
              {site.role}, {site.city}
            </p>
            <p data-reveal="up" className="mt-6 text-xl leading-relaxed">
              Your first appointment is a conversation: what you are noticing, how it affects your day, and what the options are,
              including the ones that do not involve surgery.
              <span className="ml-1 text-sm text-draft">(Proposed wording)</span>
            </p>
            <dl data-reveal="stagger" className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Training", "Medical school, residency and fellowship"],
                ["Certification", "Board certification details"],
                ["Hospital affiliations", "Affiliated hospitals and surgery centers"],
                ["Languages", "Languages spoken in the practice"],
              ].map(([k, val]) => (
                <div key={k} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                  <dt className="text-sm font-bold">{k}</dt>
                  <dd className="mt-1">
                    <Placeholder>{val}</Placeholder>
                  </dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold ring-1 ring-ink/20 transition hover:bg-white">
              About Dr. Traverso &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* Practical details */}
      <section aria-labelledby="practical-heading" className="pb-24">
        <Container>
          <h2 id="practical-heading" className="sr-only">
            Practical details
          </h2>
          <div data-reveal="stagger" className="grid gap-4 md:grid-cols-3">
            {[
              ["Where", site.placeholders.address],
              ["When", site.placeholders.hours],
              ["Insurance", site.placeholders.insurance],
            ].map(([k, val]) => (
              <div key={k} className="rounded-[28px] bg-white p-7 ring-1 ring-line">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal">{k}</h3>
                <p className="mt-3">
                  <Placeholder>{val}</Placeholder>
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Professionals */}
      <section aria-labelledby="pro-heading" className="relative overflow-hidden bg-ink py-24 text-white on-dark">
        <div data-parallax="0.6" aria-hidden="true" className="absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />
        <Container className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">For referring physicians and partners</p>
            <h2 id="pro-heading" data-reveal="words" className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              <SplitWords text="Referral process, what to include, and how we report back." />
            </h2>
          </div>
          <Link href="/physicians" data-reveal="up" className="inline-flex min-h-12 items-center rounded-full bg-cyan-300 px-6 font-bold text-ink transition hover:bg-cyan-200">
            Referral information &rarr;
          </Link>
        </Container>
      </section>

      {/* Closing call to action */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden py-28 sm:py-40">
        <Container className="text-center">
          <h2 id="cta-heading" data-reveal="words" className="mx-auto max-w-5xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-8xl">
            <SplitWords text="When you are ready, we will listen." />
          </h2>
          <p data-reveal="up" className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            Leave your name and a way to reach you. No health details needed; the office will call you back.
          </p>
          <div data-reveal="up" className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex min-h-14 items-center rounded-full bg-ink px-8 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5">
              Request an appointment
            </Link>
            <Link href="/contact#call" className="inline-flex min-h-14 items-center rounded-full px-8 text-lg font-bold ring-1 ring-ink/20 transition hover:bg-white">
              Prefer to call?
            </Link>
          </div>
          <p className="mx-auto mt-14 max-w-2xl text-sm text-ink-soft">
            This information is general and educational. It is not a diagnosis and is not a substitute for a consultation with a
            clinician who can examine your hand.
          </p>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
