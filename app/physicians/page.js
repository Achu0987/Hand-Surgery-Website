import { Container, Copy, CopyList, Eyebrow, Todo } from "@/components/ui";
import { site } from "@/lib/site";
import { text } from "@/lib/copy";

export const metadata = {
  title: text("meta.physicians") || site.surgeon,
  description: text("meta.physiciansDescription") || undefined,
  alternates: { canonical: "/physicians" },
};

const TOC = ["scope", "how-to-refer", "include", "urgent", "reporting", "partners"];
const TOC_KEYS = { scope: "scope", "how-to-refer": "refer", include: "include", urgent: "urgent", reporting: "reporting", partners: "partners" };
const P = "pages.physicians";

// Professional audience: denser, list-led, no reassurance copy.
export default function PhysiciansPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <Eyebrow>
            <Copy path={`${P}.eyebrow`} />
          </Eyebrow>
          <h1 className="type-title mt-3 max-w-3xl">{site.surgeon}</h1>
          <p className="reading mt-4 text-muted">
            <Copy path={`${P}.intro`} />
          </p>
          <dl className="mt-8 grid max-w-4xl gap-x-10 sm:grid-cols-3">
            {[
              ["fax", site.placeholders.fax],
              ["secure", site.placeholders.referralEmail],
              ["line", "Direct line for clinician-to-clinician calls"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line py-4">
                <dt className="text-small text-muted">
                  <Copy path={`${P}.${k}`} />
                </dt>
                <dd className="mt-2">
                  <Todo>{v}</Todo>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      <Container wide className="grid gap-10 py-10 md:py-14 xl:grid-cols-[200px_minmax(0,680px)] xl:gap-16">
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-2 xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:block xl:space-y-1 xl:border-l xl:border-line">
            {TOC.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-line bg-surface px-3 text-small hover:border-ink xl:rounded-none xl:border-0 xl:bg-transparent xl:pl-4 xl:hover:underline xl:hover:underline-offset-4"
                >
                  <Copy path={`${P}.toc.${TOC_KEYS[id]}`} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="reading">
          <h2 id="scope" className="mt-0!">
            <Copy path={`${P}.toc.scope`} />
          </h2>
          <p>
            <Todo>Conditions and procedures the practice accepts referrals for, as confirmed by Dr. Traverso</Todo>
          </p>
          <p>
            <Todo>Age range seen, and any conditions referred elsewhere</Todo>
          </p>

          <h2 id="how-to-refer">
            <Copy path={`${P}.toc.refer`} />
          </h2>
          <ul>
            <li>
              <Copy path={`${P}.referSecure`} /> <Todo>{site.placeholders.referralEmail}</Todo>
            </li>
            <li>
              <Copy path={`${P}.referFax`} /> <Todo>{site.placeholders.fax}</Todo>
            </li>
            <li>
              <Copy path={`${P}.referContact`} /> <Todo>Typical time from referral to first appointment</Todo>
            </li>
          </ul>
          <p className="text-small text-muted">
            <Copy path={`${P}.noPatientInfo`} />
          </p>

          <h2 id="include">
            <Copy path={`${P}.toc.include`} />
          </h2>
          <p className="text-small text-muted">
            <Copy path={`${P}.includeNote`} />
          </p>
          <CopyList path={`${P}.include`} />

          <h2 id="urgent">
            <Copy path={`${P}.toc.urgent`} />
          </h2>
          <p>
            <Todo>How to request an urgent or same-week review, and what counts as urgent for the practice</Todo>
          </p>

          <h2 id="reporting">
            <Copy path={`${P}.toc.reporting`} />
          </h2>
          <p>
            <Todo>What the referring clinician receives after the first visit and after any procedure, and how</Todo>
          </p>

          {/* Partners are the brief's third audience (COPY-BRIEF.md §1) */}
          <h2 id="partners">
            <Copy path={`${P}.toc.partners`} />
          </h2>
          <p>
            <Copy path={`${P}.partnersIntro`} />
          </p>
          <p>
            <Todo>Who the practice partners with, and how a partner gets in touch</Todo>
          </p>
        </div>
      </Container>
    </>
  );
}
