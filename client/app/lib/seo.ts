// Centralised SEO constants and helpers.
// Edit SITE_URL or NEXT_PUBLIC_SITE_URL to point at the deployed domain.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://obinnaudenwe.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Obinna Udenwe";
export const AUTHOR_NAME = "Obinna Udenwe";
export const DEFAULT_OG_IMAGE = "/Obinna Udenwe Portrait.png";

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(value: string, max = 160): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function jsonLdScript(data: unknown): string {
  // Escape closing script tags to keep the inline JSON safe.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: SITE_URL,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  jobTitle: "Novelist",
  nationality: "Nigerian",
  description:
    "Award-winning Nigerian novelist and storyteller, author of Satans & Shaitans, Colours of Hatred, and Years of Shame.",
  sameAs: [
    "https://en.wikipedia.org/wiki/Obinna_Udenwe",
  ],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/news?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
} as const;
