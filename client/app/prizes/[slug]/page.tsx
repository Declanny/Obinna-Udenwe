import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";
import { slugify } from "../../lib/api";
import { FALLBACK_PRIZES } from "../../lib/fallback";
import {
  absoluteUrl,
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  jsonLdScript,
  SITE_URL,
  truncate,
} from "../../lib/seo";

export function generateStaticParams() {
  return FALLBACK_PRIZES.map((p) => ({ slug: slugify(p.label) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prize = FALLBACK_PRIZES.find((p) => slugify(p.label) === slug);
  if (!prize) {
    return { title: "Prize not found", robots: { index: false, follow: false } };
  }
  const description = truncate(prize.detail, 160);
  const canonical = `/prizes/${slug}`;
  return {
    title: prize.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: prize.title,
      description,
      url: canonical,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
      authors: [AUTHOR_NAME],
    },
    twitter: {
      card: "summary_large_image",
      title: prize.title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
  };
}

export default async function PrizeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prize = FALLBACK_PRIZES.find((p) => slugify(p.label) === slug);
  if (!prize) notFound();

  const awardSchema = {
    "@context": "https://schema.org",
    "@type": "Award",
    name: prize.title,
    description: truncate(prize.detail, 200),
    ...(prize.year ? { dateAwarded: String(prize.year) } : {}),
    recipient: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    url: `${SITE_URL}/prizes/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(awardSchema) }}
      />
      <Navbar />
      <section className="bg-cream">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-8"
          >
            <Link href="/" className="hover:text-dark-green transition-colors">
              Home
            </Link>
            <span>&rsaquo;</span>
            <Link href="/prizes" className="hover:text-dark-green transition-colors">
              Prizes
            </Link>
            <span>&rsaquo;</span>
            <span className="text-dark-green">{prize.title}</span>
          </nav>

          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-gold text-[11px] md:text-xs uppercase tracking-widest font-semibold">
              Awards &amp; Honours
            </p>
            {prize.year ? (
              <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-foreground/50 whitespace-nowrap">
                Awarded {prize.year}
              </span>
            ) : null}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight mb-6">
            {prize.title}
          </h1>

          {prize.work ? (
            <p className="font-serif italic text-lg md:text-xl text-dark-green/70 max-w-2xl">
              Awarded for{" "}
              <span className="not-italic font-semibold text-dark-green">
                {prize.work}
              </span>
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-cream">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-10 md:pb-14">
          <p className="text-base md:text-[17px] leading-8 text-foreground/85 whitespace-pre-line">
            {prize.detail}
          </p>
        </div>
      </section>

      {prize.items && prize.items.length > 0 ? (
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 md:px-8 pb-14 md:pb-20">
            <div className="bg-white border border-dark-green/10 rounded-sm p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-4">
                Highlights
              </p>
              <ul className="space-y-3">
                {prize.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm md:text-base text-foreground/80 leading-relaxed flex gap-3"
                  >
                    <span className="text-gold mt-2 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-cream">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-16 md:pb-20">
          <Link
            href="/prizes"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            ← All Prizes
          </Link>
        </div>
      </section>

      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
