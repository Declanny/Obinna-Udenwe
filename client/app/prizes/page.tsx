import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { slugify } from "../lib/api";
import { FALLBACK_PRIZES, Prize } from "../lib/fallback";
import { jsonLdScript, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Awards & Prizes — Obinna Udenwe" },
  description:
    "A complete record of literary prizes and honours awarded to Obinna Udenwe, including the Chinua Achebe Prize for Literature, the ANA Prize for Prose Fiction, and the Prairie Schooner — Glenna Luschei Prize.",
  alternates: { canonical: "/prizes" },
  openGraph: {
    type: "website",
    title: "Awards & Prizes — Obinna Udenwe",
    description:
      "Literary prizes and honours awarded to Nigerian novelist Obinna Udenwe.",
    url: "/prizes",
    images: ["/obinna.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards & Prizes — Obinna Udenwe",
    description:
      "Literary prizes and honours awarded to Nigerian novelist Obinna Udenwe.",
    images: ["/obinna.jpg"],
  },
};

function PrizeCard({ prize }: { prize: Prize }) {
  return (
    <article className="bg-white border border-dark-green/10 rounded-sm p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-dark-green leading-tight">
          {prize.title}
        </h2>
        {prize.year ? (
          <span className="text-gold text-xs uppercase tracking-widest font-semibold shrink-0">
            {prize.year}
          </span>
        ) : null}
      </div>

      {prize.work ? (
        <p className="font-serif italic text-base md:text-lg text-dark-green/70 mb-4">
          Awarded for{" "}
          <span className="not-italic font-semibold text-dark-green">
            {prize.work}
          </span>
        </p>
      ) : null}

      <p className="text-sm md:text-[15px] text-foreground/80 leading-relaxed">
        {prize.detail}
      </p>

      {prize.items && prize.items.length > 0 ? (
        <div className="border-t border-dark-green/10 mt-6 pt-5">
          <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-3">
            Highlights
          </p>
          <ul className="space-y-2">
            {prize.items.map((item) => (
              <li
                key={item}
                className="text-sm text-foreground/80 leading-relaxed flex gap-2"
              >
                <span className="text-gold mt-1.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="border-t border-dark-green/10 mt-6 pt-5">
        <Link
          href={`/prizes/${slugify(prize.label)}`}
          className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
        >
          Read Full Detail →
        </Link>
      </div>
    </article>
  );
}

export default function PrizesPage() {
  const prizes = FALLBACK_PRIZES;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Awards & Prizes — Obinna Udenwe",
    url: `${SITE_URL}/prizes`,
    hasPart: prizes.map((prize) => ({
      "@type": "Award",
      name: prize.title,
      description: prize.detail,
      ...(prize.year ? { dateAwarded: String(prize.year) } : {}),
      recipient: { "@type": "Person", name: "Obinna Udenwe" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionSchema) }}
      />
      <Navbar />
      <main className="bg-cream">
        <section className="px-6 md:px-8 lg:px-16 py-14 md:py-20">
          <div className="max-w-4xl mx-auto">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Awards & Honours
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight mb-4">
              Prizes
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mb-10 md:mb-12">
              A record of the literary prizes and honours Obinna Udenwe&apos;s
              work has received over the years — from his inaugural Chinua
              Achebe Prize win to his international recognition at Prairie
              Schooner.
            </p>

            <div className="space-y-6 md:space-y-8">
              {prizes.map((prize) => (
                <PrizeCard key={prize.label} prize={prize} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
