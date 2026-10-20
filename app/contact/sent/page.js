import { ButtonLink, Container, Eyebrow, Placeholder } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = { title: "Request received" };

export default function SentPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>Thank you</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-indigo-950 sm:text-5xl">Your request is with the office</h1>
        <p className="mt-5 text-lg text-ink-soft">
          Someone will call or email you to find a time. <Placeholder>{site.placeholders.callback}</Placeholder>
        </p>
        <p className="mt-4 rounded-2xl bg-draft-bg px-5 py-4 text-draft">Prototype note: this preview does not send or store anything you type.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/conditions">Keep reading the guides</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
