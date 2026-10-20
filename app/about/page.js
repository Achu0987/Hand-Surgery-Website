import { ButtonLink, Container, Eyebrow, Placeholder } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "About Dr. Purnell Traverso",
  description: "Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="grid gap-12 py-14 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-100 to-cyan-100 ring-1 ring-line">
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <Placeholder>Portrait, supplied by the practice</Placeholder>
        </div>
      </div>
      <div>
        <Eyebrow>About the surgeon</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-indigo-950 sm:text-5xl">{site.surgeon}</h1>
        <p className="mt-2 text-lg text-ink-soft">
          {site.role}, {site.city}
        </p>
        <div className="prose-clinical mt-8">
          <h2 style={{ marginTop: 0 }}>Approach to care</h2>
          <p>
            <Placeholder>In Dr. Traverso&apos;s own words: how they approach a first consultation and treatment decisions</Placeholder>
          </p>
          <h2>Training and certification</h2>
          <ul>
            <li><Placeholder>Medical school</Placeholder></li>
            <li><Placeholder>Residency</Placeholder></li>
            <li><Placeholder>Hand surgery fellowship</Placeholder></li>
            <li><Placeholder>Board certification</Placeholder></li>
          </ul>
          <h2>Hospital and surgery center affiliations</h2>
          <p><Placeholder>Affiliations, as confirmed by the practice</Placeholder></p>
          <h2>Professional memberships</h2>
          <p><Placeholder>Memberships, as confirmed by the practice</Placeholder></p>
        </div>
        <ButtonLink href="/contact" className="mt-10">Request an appointment</ButtonLink>
      </div>
    </Container>
  );
}
