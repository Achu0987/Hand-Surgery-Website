import Link from "next/link";
import { notFound } from "next/navigation";
import ConditionViewer from "@/components/hand/ConditionViewer";
import { CallButton, Container, Copy, CopyList, Disclaimer, ScheduleButton, Todo, Value } from "@/components/ui";
import { conditions, getCondition } from "@/lib/conditions";
import { resolve, text } from "@/lib/copy";
import { site } from "@/lib/site";

export const dynamicParams = false;

// The same five headings on every symptom page (COPY-BRIEF.md §4)
const SECTIONS = [
  ["what-it-may-feel-like", "feel"],
  ["where-this-is-in-the-hand", "where"],
  ["how-it-is-evaluated", "evaluated"],
  ["options-that-may-be-appropriate", "options"],
  ["talk-it-through", "talk"],
];

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) return {};
  const p = `symptoms.${slug}`;
  const title = text(`${p}.S16.title`) || c.name;
  const description = text(`${p}.S16.description`) || text(`${p}.S2`) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/conditions/${c.slug}` },
    openGraph: { title, description },
  };
}

function Paragraphs({ path }) {
  const { status, value } = resolve(path);
  const items = Array.isArray(value) ? value : [value];
  return items.map((v, i) => (
    <p key={i}>
      <Value status={status} value={v} />
    </p>
  ));
}

export default async function ConditionPage({ params }) {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) notFound();
  const p = `symptoms.${slug}`;
  const related = resolve(`${p}.S15.symptoms`);
  const relatedSlugs = Array.isArray(related.value) ? related.value : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: c.name,
    about: { "@type": "MedicalCondition", name: c.name },
  };

  return (
    <>
      {/* Hero: white */}
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 text-small text-muted">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="underline underline-offset-4"><Copy path="ui.breadcrumbHome" /></Link> <span aria-hidden="true">/</span>
              </li>
              <li>
                <Link href="/#symptoms" className="underline underline-offset-4"><Copy path="ui.nav.symptoms" /></Link> <span aria-hidden="true">/</span>
              </li>
              <li aria-current="page">{c.name}</li>
            </ol>
          </nav>
          {/* S1, fixed */}
          <h1 className="type-title max-w-3xl">{c.name}</h1>
          <p className="reading mt-4">
            <Copy path={`${p}.S2`} />
          </p>
          <p className="reading mt-2 text-muted">
            <Copy path="site.reassurance" />
          </p>
          {/* S4 (reviewed by, dates) is shown only once the page is approved */}
          <p className="mt-4 text-small">
            <Todo kind="review">Clinical review by Dr. Traverso pending. Reviewer and dates appear only after approval.</Todo>
          </p>
        </Container>
      </div>

      <Container wide className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[200px_680px_300px] xl:justify-between">
          {/* On this page: rail on wide screens, chips below */}
          <nav aria-labelledby="toc-heading" className="lg:col-span-2 xl:col-span-1 xl:col-start-1 xl:row-start-1">
            <h2 id="toc-heading" className="text-small font-medium text-muted">
              <Copy path="site.labels.onThisPage" />
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2 xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:block xl:space-y-1 xl:border-l xl:border-line">
              {SECTIONS.map(([id, key]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-line bg-surface px-3 text-small text-ink hover:border-ink xl:rounded-none xl:border-0 xl:bg-transparent xl:pl-4 xl:hover:underline xl:hover:underline-offset-4"
                  >
                    <Copy path={`site.labels.sections.${key}`} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Reading column */}
          <article className="min-w-0 lg:col-start-1 lg:row-start-2 xl:col-start-2 xl:row-start-1">
            <section aria-labelledby="what-it-may-feel-like" className="reading">
              <h2 id="what-it-may-feel-like" className="type-section mt-0!">
                <Copy path="site.labels.sections.feel" />
              </h2>
              <p className="mt-4">
                <Copy path={`${p}.S6.intro`} />
              </p>
              <CopyList path={`${p}.S6.points`} />
            </section>

            <section aria-labelledby="where-this-is-in-the-hand" className="mt-10 border-t border-line pt-10">
              <h2 id="where-this-is-in-the-hand" className="type-section">
                <Copy path="site.labels.sections.where" />
              </h2>
              <ConditionViewer slug={c.slug} region={c.region} area={c.area} className="mt-6" captionPath={`${p}.S7`} />
            </section>

            <section aria-labelledby="how-it-is-evaluated" className="reading mt-10 border-t border-line pt-10">
              <h2 id="how-it-is-evaluated" className="type-section mt-0!">
                <Copy path="site.labels.sections.evaluated" />
              </h2>
              <CopyList path={`${p}.S8`} ordered className="mt-4" />
            </section>

            <section aria-labelledby="options-that-may-be-appropriate" className="reading mt-10 border-t border-line pt-10">
              <h2 id="options-that-may-be-appropriate" className="type-section mt-0!">
                <Copy path="site.labels.sections.options" />
              </h2>
              <h3 className="mt-6 font-medium">
                <Copy path="site.labels.nonsurgical" />
              </h3>
              <div className="mt-2">
                <Paragraphs path={`${p}.S9`} />
              </div>
              <h3 className="mt-6 font-medium">
                <Copy path="site.labels.surgery" />
              </h3>
              <div className="mt-2">
                <Paragraphs path={`${p}.S10`} />
              </div>
            </section>

            <section aria-labelledby="talk-it-through" className="mt-10 border-t border-line pt-10">
              <h2 id="talk-it-through" className="type-section">
                <Copy path="site.labels.sections.talk" />
              </h2>
              <p className="reading mt-4">
                <Copy path="site.talkLine" />
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ScheduleButton />
                <CallButton />
              </div>
            </section>

            <Disclaimer className="mt-12" />

            <section aria-labelledby="related" className="mt-12 border-t border-line pt-10">
              <h2 id="related" className="type-section">
                <Copy path="site.labels.related" />
              </h2>
              {relatedSlugs.length > 0 ? (
                <ul className="mt-4 border-t border-line">
                  {relatedSlugs.map((s) => {
                    const o = getCondition(s);
                    if (!o) return null;
                    return (
                      <li key={s} className="border-b border-line">
                        <Link href={`/conditions/${s}`} className="group flex min-h-14 flex-col justify-center py-3">
                          <span className="font-medium text-accent group-hover:underline group-hover:underline-offset-4">{o.name}</span>
                          <span className="text-small text-muted">
                            <Copy path={`symptoms.${s}.card`} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4">
                  <Value {...related} />
                </p>
              )}
              <p className="mt-4 text-small">
                <Copy path={`${p}.S15.centres`} />
              </p>
            </section>
          </article>

          {/* Talk to the practice */}
          <aside aria-labelledby="aside-heading" className="lg:col-start-2 lg:row-start-2 xl:col-start-3 xl:row-start-1">
            <div className="rounded-card border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <h2 id="aside-heading" className="font-medium">
                <Copy path="site.labels.aside" />
              </h2>
              <p className="mt-2 text-small text-muted">
                <Copy path="site.reassurance" />
              </p>
              <p className="mt-4">
                <Copy path="site.phone" />
              </p>
              <div className="mt-5 grid gap-2">
                <ScheduleButton />
                <CallButton />
              </div>
              <p className="mt-4 text-small text-muted">
                <Copy path="site.noHealthDetails" />
              </p>
            </div>
          </aside>
        </div>
      </Container>

      {/* Next step: one of the two approved cyan uses. Text on cyan is ink. */}
      <section aria-labelledby="next-step" className="pb-16">
        <Container wide>
          <div className="rounded-card bg-logo-cyan px-6 py-10 text-ink md:px-12 md:py-14">
            <h2 id="next-step" className="type-section">
              <Copy path="site.labels.nextStep" />
            </h2>
            <p className="reading mt-3">
              <Copy path="site.nextStepLine" />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ScheduleButton />
            </div>
          </div>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...jsonLd, publisher: site.name }) }} />
    </>
  );
}
