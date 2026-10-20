import { Container, Eyebrow, Placeholder } from "@/components/ui";

export const metadata = { title: "Accessibility", alternates: { canonical: "/accessibility" } };

export default function AccessibilityPage() {
  return (
    <Container className="py-14 sm:py-20">
      <Eyebrow>Accessibility</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-indigo-950 sm:text-5xl">Using this site</h1>
      <div className="prose-clinical mt-8">
        <p>We aim for this site to meet WCAG 2.2 at level AA.</p>
        <h2>The 3D hand</h2>
        <ul>
          <li>Everything the 3D hand shows is also written out in the text next to it.</li>
          <li>Choosing a symptom from the list turns the hand. You never need to use the hand itself.</li>
          <li>With the viewer focused, use the arrow keys to rotate, plus and minus to zoom, L to switch between skin and inner layers, and R to reset.</li>
          <li>If your device is set to reduce motion, the hand does not animate. You can also pause motion with the button under the viewer.</li>
          <li>Without JavaScript, or on devices without 3D support, a still image is shown instead.</li>
        </ul>
        <h2>Contact</h2>
        <p>
          If something on this site does not work for you, please tell us: <Placeholder>Accessibility contact</Placeholder>
        </p>
      </div>
    </Container>
  );
}
