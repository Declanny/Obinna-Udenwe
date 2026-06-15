import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { jsonLdScript, personSchema } from "../lib/seo";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: { absolute: "About Obinna Udenwe — Award-winning Nigerian Novelist" },
  description:
    "Meet Obinna Udenwe — Nigerian novelist, short-story writer, and civil engineer. Winner of the Chinua Achebe Prize, ANA Prize, and Prairie Schooner — Glenna Luschei Prize.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "About Obinna Udenwe",
    description:
      "Nigerian novelist and storyteller. Author of Satans & Shaitans, Colours of Hatred, and Years of Shame.",
    url: "/about",
    images: ["/Obinna Udenwe Portrait.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Obinna Udenwe",
    description:
      "Nigerian novelist and storyteller. Author of Satans & Shaitans, Colours of Hatred, and Years of Shame.",
    images: ["/Obinna Udenwe Portrait.png"],
  },
};

function AboutHero() {
  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-14 md:py-20 lg:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-12 lg:gap-16">
        <div className="flex-1 space-y-4 order-2 lg:order-1">
          <p className="font-sans text-base md:text-lg text-[#FFCA64]">
            Novelist. Story-teller. Civil engineer.
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95]">
            Obinna Udenwe
          </h1>
          <div className="h-px w-16 bg-gold" />
          <p className="text-base md:text-lg text-white/80 max-w-md leading-relaxed">
            Award-winning Nigerian author of power, faith, and consequence. He
            is a co-founder of The Village Square Journal &mdash; a magazine of
            contemporary literature and politics.
          </p>
          <Link
            href="#bio"
            className="inline-block text-xs font-semibold uppercase tracking-widest text-gold border-b border-gold/40 hover:border-gold pt-3 transition-colors"
          >
            Read the Bio ↓
          </Link>
        </div>
        <div className="shrink-0 w-full lg:w-auto order-1 lg:order-2">
          <div
            className="relative overflow-hidden w-full aspect-[380/460] sm:w-[380px] sm:h-[460px] sm:aspect-auto rounded-[24px] border-[8px]"
            style={{ borderColor: "#C8922A" }}
          >
            <Image
              src="/aboutpageimages/91084808d77bf681ec8af12c4180ad9f45acbddf.jpg"
              alt="Obinna Udenwe portrait"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HonorsSection() {
  const honors = [
    { year: "2024", title: "Legacy FM Literary Excellence Award", note: "Winner" },
    { year: "2021", title: "The NLNG Nigeria Prize for Literature", note: "Shortlist" },
    { year: "2021", title: "The Chinua Achebe Prize for Literature", note: "Winner" },
    { year: "2020", title: "The Prairie Schooner-Glenna Luschei Prize", note: "Winner" },
    { year: "2020", title: "The Prairie Schooner-Raz Shumaker Book Prize", note: "Finalist" },
    { year: "2016", title: "The Short Story is Dead Prize", note: "Winner" },
    { year: "2015", title: "ANA Prize for Prose Fiction", note: "Winner" },
    { year: "2014", title: "Ebonyi State Literary Icon Award", note: "Winner" },
    { year: "2009", title: "National Top12 Honours Award", note: "Winner" },
  ];

  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-1/3">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
              Recognition
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Honors &amp;<br />
              Distinctions
            </h2>
            <div className="h-px w-16 bg-gold mt-6" />
          </div>
          <ol className="lg:w-2/3">
            {honors.map((h, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-6 md:py-8 border-t border-white/15 first:border-t-0"
              >
                <p className="font-serif text-3xl md:text-4xl text-gold leading-none">
                  {h.year}
                </p>
                <div>
                  <p className="font-serif text-xl md:text-2xl text-white leading-snug">
                    {h.title}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-white/60 mt-2">
                    {h.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-[#1B1B1B] text-white px-6 md:px-8 lg:px-16 py-16 md:py-20">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
          Press &amp; Media
        </p>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          For interviews &amp; engagements.
        </h3>
        <p className="text-sm md:text-base text-white/70 mb-8 max-w-sm leading-relaxed">
          Requests for interviews, speaking engagements, and official
          photography can be directed here.
        </p>
        <Link
          href="/#contact"
          className="inline-block bg-white text-dark-green text-xs font-semibold uppercase tracking-widest px-7 py-3.5 rounded-sm hover:bg-white/90 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
      <div className="bg-cream text-dark-green px-6 md:px-8 lg:px-16 py-16 md:py-20">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
          Bibliography
        </p>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Read the work.
        </h3>
        <p className="text-sm md:text-base text-foreground/70 mb-8 max-w-sm leading-relaxed">
          Explore the full bibliography including novels, short story
          collections, and anthologies.
        </p>
        <Link
          href="/books"
          className="inline-block bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-7 py-3.5 rounded-sm hover:bg-dark-green/90 transition-colors"
        >
          View Books
        </Link>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personSchema) }}
      />
      <Navbar />
      <AboutHero />
      <AboutContent />
      <HonorsSection />
      <CTASection />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
