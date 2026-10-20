import ContactForm from "./ContactForm";
import { Container, Eyebrow, Placeholder } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "Request an appointment",
  description: "Ask the Traverso Hand office to call you. Contact details only, no health information.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
      <div>
        <Eyebrow>Request an appointment</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-indigo-950 sm:text-5xl">The office will call you</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          You do not need a diagnosis to ask. Leave a name and a way to reach you, and someone from the office will get in touch to
          find a time. <Placeholder>Confirm whether some insurance plans need a referral first</Placeholder>
        </p>
        <div className="mt-10 max-w-xl">
          <ContactForm />
        </div>
      </div>

      <aside className="space-y-4 lg:pt-16" aria-label="Other ways to reach the office">
        <div id="call" className="scroll-mt-6 rounded-[28px] bg-indigo-950 p-7 text-white on-dark">
          <h2 className="font-serif text-2xl font-semibold">Prefer to call?</h2>
          <p className="mt-3 text-white/80">Talking to a person is often easier. The number will be a tap-to-call link.</p>
          <p className="mt-5 text-xl">
            <Placeholder>{site.placeholders.phone}</Placeholder>
          </p>
          <p className="mt-3 text-sm text-white/70">
            <Placeholder>{site.placeholders.hours}</Placeholder>
          </p>
        </div>
        <div className="rounded-[28px] bg-white p-7 ring-1 ring-line">
          <h2 className="font-bold text-indigo-950">Visiting</h2>
          <p className="mt-2">
            <Placeholder>{site.placeholders.address}</Placeholder>
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            <Placeholder>Parking and step-free access details</Placeholder>
          </p>
        </div>
        <p className="px-2 text-sm text-ink-soft">If you think you need urgent care, contact emergency services.</p>
      </aside>
    </Container>
  );
}
