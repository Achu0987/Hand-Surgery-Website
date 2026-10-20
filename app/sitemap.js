import { conditions } from "@/lib/conditions";
import { site } from "@/lib/site";

export default function sitemap() {
  const pages = ["", "/conditions", "/about", "/physicians", "/contact", "/accessibility"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 })),
    ...conditions.map((c) => ({ url: `${site.url}/conditions/${c.slug}`, changeFrequency: "monthly", priority: 0.8 })),
  ];
}
