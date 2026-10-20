import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileActionBar from "@/components/MobileActionBar";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Motion from "@/components/motion/Motion";
import { site } from "@/lib/site";

const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body", display: "swap" });
const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-display", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Hand and wrist surgeon in Coral Springs, FL | Dr. Purnell Traverso",
    template: "%s | Traverso Hand",
  },
  description:
    "Plain-language guides to hand and wrist symptoms, and how to reach Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida.",
  // Pre-launch: keep the site out of search indexes until approved.
  robots: { index: false, follow: false },
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
};

export const viewport = {
  themeColor: "#0e0a3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-cyan-300 px-5 py-3 font-bold text-indigo-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <SmoothScroll />
        <Motion />
      </body>
    </html>
  );
}
