import { Container, Eyebrow, Placeholder } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "For referring physicians",
  description: "Referral process, information to include, and contact routes for physicians referring to Dr. Purnell Traverso.",
  alternates: { canonical: "/physicians" },
};

// Professional audience: denser, list-led, no reassurance copy.
export default function PhysiciansPage() {
  return (
    <>
      <div className="bg-indigo-950 text-white on-dark grain">
        <Container className="py-14 sm:py-20">
          <Eyebrow dark>For referring physicians and partners</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold sm:text-5xl">Referring to {site.surgeon}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Hand and wrist surgery, {site.city}. This page sets out how to refer, what to include, and how we report back.
          </p>
          <dl className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              ["Referral fax", site.placeholders.fax],
              ["Secure referral", site.placeholders.referralEmail],
              ["Physician line", "Direct line for clinician-to-clinician calls"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/15">
                <dt className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">{k}</dt>
                <dd className="mt-2">
                  <Placeholder>{v}</Placeholder>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      <Container className="grid gap-14 py-14 sm:py-20 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-6 space-y-2 border-l border-line pl-4 text-[15px]">
            <li><a href="#scope" className="hover:underline">Scope of practice</a></li>
            <li><a href="#how-to-refer" className="hover:underline">How to refer</a></li>
            <li><a href="#include" className="hover:underline">What to include</a></li>
            <li><a href="#urgent" className="hover:underline">Urgent referrals</a></li>
            <li><a href="#reporting" className="hover:underline">Reporting back</a></li>
          </ul>
        </nav>

        <div className="prose-clinical">
          <h2 id="scope" style={{ marginTop: 0 }}>Scope of practice</h2>
          <p>
            <Placeholder>Conditions and procedures the practice accepts referrals for, as confirmed by Dr. Traverso</Placeholder>
          </p>
          <p>
            <Placeholder>Age range seen, and any conditions referred elsewhere</Placeholder>
          </p>

          <h2 id="how-to-refer">How to refer</h2>
          <ul>
            <li>Send the referral through the practice&apos;s secure channel: <Placeholder>{site.placeholders.referralEmail}</Placeholder></li>
            <li>Or fax it to <Placeholder>{site.placeholders.fax}</Placeholder></li>
            <li>The office contacts the patient directly to schedule. <Placeholder>Typical time from referral to first appointment</Placeholder></li>
          </ul>
          <p className="text-sm text-ink-soft">
            This website does not accept patient information. Please do not send clinical details through any form on this site.
          </p>

          <h2 id="include">What to include</h2>
          <p className="text-sm text-draft">Proposed list, to confirm with the practice.</p>
          <ul>
            <li>Reason for referral and the question you would like answered</li>
            <li>Relevant history, examination findings and current treatment</li>
            <li>Imaging reports, and where to access the images</li>
            <li>Nerve conduction study results, if done</li>
            <li>Insurance details and any authorization numbers</li>
          </ul>

          <h2 id="urgent">Urgent referrals</h2>
          <p>
            <Placeholder>How to request an urgent or same-week review, and what counts as urgent for the practice</Placeholder>
          </p>

          <h2 id="reporting">Reporting back</h2>
          <p>
            <Placeholder>What the referring clinician receives after the first visit and after any procedure, and how</Placeholder>
          </p>
        </div>
      </Container>
    </>
  );
}
