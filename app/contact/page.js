import ContactForm from "./ContactForm";
import { Container, Copy, Eyebrow, Todo } from "@/components/ui";
import { text } from "@/lib/copy";
import { site } from "@/lib/site";

export const metadata = {
  title: text("pages.contact.eyebrow") || "Schedule",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <Eyebrow>
            <Copy path="pages.contact.eyebrow" />
          </Eyebrow>
          <h1 className="type-title mt-3">
            <Copy path="pages.contact.title" />
          </h1>
          <p className="reading mt-4 text-muted">
            <Copy path="site.reassurance" /> <Copy path="pages.contact.body" />
          </p>
          <p className="mt-3 text-small">
            <Todo>Whether some insurance plans need a referral first</Todo>
          </p>
        </Container>
      </div>

      <Container wide className="grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
        <div className="max-w-xl">
          <ContactForm />
        </div>

        <aside className="space-y-4" aria-label="Other ways to reach the office">
          <div id="call" className="scroll-mt-24 rounded-card border border-line bg-surface p-6">
            <h2 className="type-section">
              <Copy path="pages.contact.callTitle" />
            </h2>
            <p className="mt-3 text-muted">
              <Copy path="pages.contact.callBody" />
            </p>
            <p className="mt-5">
              <Copy path="site.phone" />
            </p>
            <p className="mt-3 text-small">
              <Todo>{site.placeholders.hours}</Todo>
            </p>
          </div>
          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="font-medium">
              <Copy path="pages.contact.visiting" />
            </h2>
            <p className="mt-2">
              <Todo>{site.placeholders.address}</Todo>
            </p>
            <p className="mt-2 text-small">
              <Todo>Parking and step-free access details</Todo>
            </p>
          </div>
          <p className="text-small text-muted">
            <Copy path="site.emergency" />
          </p>
        </aside>
      </Container>
    </>
  );
}
