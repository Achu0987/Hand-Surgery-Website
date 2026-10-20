import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="font-serif text-4xl font-semibold text-indigo-950">This page is not here</h1>
      <p className="mt-4 text-lg text-ink-soft">It may have moved. You can start again from what you are feeling.</p>
      <ButtonLink href="/#explore" className="mt-8">Start with a symptom</ButtonLink>
    </Container>
  );
}
