import Link from "next/link";
import HandStory from "@/components/story/HandStory";
import { ButtonLink, CallButton, Container, Copy, Eyebrow, IconTodo, ScheduleButton, Todo, Value } from "@/components/ui";
import { conditions } from "@/lib/conditions";
import { resolve } from "@/lib/copy";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: site.surgeon,
  medicalSpecialty: "Hand surgery",
  address: { "@type": "PostalAddress", addressLocality: "Coral Springs", addressRegion: "FL", addressCountry: "US" },
  url: site.url,
};

// Reading section on paper, divided by a hairline (DESIGN.md §4)
function Section({ id, labelledBy, children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="border-t border-line">
      <Container wide className="py-16 md:py-24">
        {children}
      </Container>
    </section>
  );
}

export default function HomePage() {
  const steps = resolve("home.visit.steps");

  return (
    <>
      {/* Hero: white, patient first */}
      <section id="symptoms" aria-labelledby="hero-heading" className="bg-surface">
        <Container wide className="py-14 md:py-20">
          <Eyebrow>
            {site.role}, {site.city}
          </Eyebrow>
          <h1 id="hero-heading" className="type-title mt-3 max-w-3xl">
            <Copy path="home.hero.title" />
          </h1>
          <p className="reading mt-4 text-muted">
            <Copy path="home.hero.body" />
          </p>

          <h2 className="mt-10 text-small font-medium text-muted">
            <Copy path="home.hero.chooser" />
          </h2>
          <ul data-reveal="stagger" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {conditions.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/conditions/${c.slug}`}
                  className="flex h-full min-h-28 flex-col gap-3 rounded-card border border-line bg-surface p-5 hover:border-ink"
                >
                  <IconTodo />
                  <span className="font-medium text-ink">
                    &ldquo;<Copy path={`symptoms.${c.slug}.card`} />&rdquo;
                  </span>
                  <span className="mt-auto text-small text-muted">{c.name}</span>
                </Link>
              </li>
            ))}
            <li className="flex min-h-28 items-center rounded-card border border-dashed border-line p-5 text-small">
              <Todo>Eighth symptom page, not yet named</Todo>
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ScheduleButton />
            <CallButton />
          </div>
        </Container>
      </section>

      <HandStory />

      <Section id="visit" labelledBy="visit-heading">
        <h2 id="visit-heading" className="type-section">
          <Copy path="home.visit.title" />
        </h2>
        <ol data-reveal="stagger" className="mt-8 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-4 lg:border-t-0">
          {Array.isArray(steps.value) &&
            steps.value.map((s, i) => (
              <li key={i} className="border-b border-line py-5 lg:border-b-0 lg:border-t">
                <span className="text-small text-muted">
                  <Copy path="pages.home.step" /> {i + 1}
                </span>
                <p className="mt-2">
                  <Value status={steps.status} value={s} />
                </p>
              </li>
            ))}
          {!Array.isArray(steps.value) && (
            <li className="py-5">
              <Todo>{steps.value.todo}</Todo>
            </li>
          )}
        </ol>
      </Section>

      <Section id="surgeon" labelledBy="surgeon-heading">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-card border border-line bg-surface p-8 text-center">
            <Todo kind="image">Portrait of Dr. Traverso, supplied by the practice</Todo>
          </div>
          <div>
            <Eyebrow>
              <Copy path="home.surgeon.eyebrow" />
            </Eyebrow>
            <h2 id="surgeon-heading" className="type-section mt-2">
              {site.surgeon}
            </h2>
            <p className="mt-1 text-muted">
              {site.role}, {site.city}
            </p>
            <p className="reading mt-6">
              <Copy path="home.surgeon.body" />
            </p>
            <dl className="mt-8 max-w-xl border-t border-line">
              {[
                ["training", "Medical school, residency and fellowship"],
                ["certification", "Board certification details"],
                ["affiliations", "Affiliated hospitals and surgery centers"],
                ["languages", "Languages spoken in the practice"],
              ].map(([k, val]) => (
                <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12rem_1fr]">
                  <dt>
                    <Copy path={`pages.home.facts.${k}`} />
                  </dt>
                  <dd>
                    <Todo>{val}</Todo>
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              <Copy path="pages.home.meet" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section labelledBy="practical-heading">
        <h2 id="practical-heading" className="type-section">
          <Copy path="pages.home.practical.title" />
        </h2>
        <dl className="mt-8 grid gap-x-10 md:grid-cols-3">
          {[
            ["where", site.placeholders.address],
            ["when", site.placeholders.hours],
            ["insurance", site.placeholders.insurance],
          ].map(([k, val]) => (
            <div key={k} className="border-t border-line py-5">
              <dt className="text-small text-muted">
                <Copy path={`pages.home.practical.${k}`} />
              </dt>
              <dd className="mt-2">
                <Todo>{val}</Todo>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Professionals: visible, secondary */}
      <Section labelledBy="pro-heading">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>
              <Copy path="home.professionals.eyebrow" />
            </Eyebrow>
            <h2 id="pro-heading" className="type-section mt-2">
              <Copy path="home.professionals.title" />
            </h2>
          </div>
          <ButtonLink href="/physicians" variant="secondary">
            <Copy path="home.professionals.link" />
          </ButtonLink>
        </div>
      </Section>

      <Section labelledBy="cta-heading">
        <h2 id="cta-heading" className="type-section">
          <Copy path="home.closing.title" />
        </h2>
        <p className="reading mt-3 text-muted">
          <Copy path="home.closing.body" />
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ScheduleButton />
          <CallButton />
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
