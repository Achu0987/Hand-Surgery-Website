import Link from "next/link";
import { notFound } from "next/navigation";
import ConditionViewer from "@/components/hand/ConditionViewer";
import { ButtonLink, Container, Disclaimer, DraftNotice, Eyebrow } from "@/components/ui";
import { conditions, getCondition } from "@/lib/conditions";

export const dynamicParams = false;

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) return {};
  return {
    title: `${c.name}: symptoms and what to ask`,
    description: `${c.summary} A plain-language guide from Traverso Hand, Coral Springs.`,
    alternates: { canonical: `/conditions/${c.slug}` },
  };
}

export default async function ConditionPage({ params }) {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) notFound();
  const { default: Content } = await import(`@/content/conditions/${slug}.mdx`);
  const others = conditions.filter((o) => o.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: c.name,
    about: { "@type": "MedicalCondition", name: c.name },
  };

  return (
    <>
      <div className="border-b border-line bg-indigo-50/60">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="underline underline-offset-4">Home</Link> <span aria-hidden="true">/</span>
              </li>
              <li>
                <Link href="/conditions" className="underline underline-offset-4">Conditions</Link> <span aria-hidden="true">/</span>
              </li>
              <li aria-current="page">{c.name}</li>
            </ol>
          </nav>
          <Eyebrow>{c.area}</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-indigo-950 sm:text-5xl">{c.name}</h1>
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink-soft">&ldquo;{c.symptom}.&rdquo;</p>
        </Container>
      </div>

      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <article>
          <DraftNotice />
          <p className="mt-8 text-xl leading-relaxed text-indigo-950">{c.summary}</p>
          <div className="prose-clinical mt-2">
            <Content />
          </div>
          <Disclaimer className="mt-10 border-t border-line pt-6" />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start" aria-label="Where it happens, and next steps">
          <ConditionViewer region={c.region} area={c.area} />
          <div className="rounded-[28px] bg-white p-6 ring-1 ring-line">
            <h2 className="font-serif text-xl font-semibold text-indigo-950">Want to talk it through?</h2>
            <p className="mt-2 text-ink-soft">
              Send your name and how to reach you. No health details needed; the office will call you.
            </p>
            <ButtonLink href="/contact" className="mt-5 w-full">Request an appointment</ButtonLink>
          </div>
        </aside>
      </Container>

      <section aria-labelledby="related" className="border-t border-line py-14">
        <Container>
          <h2 id="related" className="font-serif text-2xl font-semibold text-indigo-950">Other guides</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/conditions/${o.slug}`} className="block h-full rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-indigo-700/40">
                  <span className="block font-bold text-indigo-950">{o.name}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{o.symptom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
