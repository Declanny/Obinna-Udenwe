import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";

const tags = ["Literature", "Ebonyi State", "Craft"];

export default function BlogDetailPage() {
  return (
    <>
      <Navbar />
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pt-12 md:pt-16 pb-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-8"
          >
            <Link href="/" className="hover:text-dark-green transition-colors">
              Home
            </Link>
            <span>&rsaquo;</span>
            <Link href="/news" className="hover:text-dark-green transition-colors">
              News &amp; Blog
            </Link>
            <span>&rsaquo;</span>
            <span className="text-dark-green">Why I Set Years of Shame in Abakaliki</span>
          </nav>

          <p className="text-gold text-[11px] font-semibold uppercase tracking-widest mb-4">
            Blog &middot; Craft &amp; Writing
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight">
            Why I Set Years of Shame in Abakaliki
          </h1>

          <div className="mt-8 pt-5 border-t border-dark-green/10 flex items-center gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                Author
              </p>
              <p className="font-semibold text-dark-green">Obinna Udenwe</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                Published
              </p>
              <p className="font-semibold text-dark-green">October 24, 2024</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pb-12 md:pb-16">
          <div className="max-w-5xl text-base md:text-[17px] leading-8 text-foreground/85 space-y-5">
            <p>
              There is a specific stillness in the Ebonyi landscape, a quiet that is
              not empty, but rather expectant. It is the silence of an archive. By
              entering the narrative here, I was able to tap into the specific
              socio-political tensions of the region, where the struggle for dignity
              often clashes with the cold reality of economic survival.
            </p>
            <p>
              Abakaliki, with its soil, its memory, and its contradictions, offered
              the right emotional and political terrain for this story. The city
              allows the novel to breathe in a way that feels both intimate and
              national at once.
            </p>
          </div>

          <div className="mt-16 border-y border-dark-green/10 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-dark-green bg-dark-green/5 px-3 py-1.5 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Share"
                className="w-8 h-8 rounded-sm border border-dark-green/20 flex items-center justify-center text-dark-green hover:border-gold hover:text-gold transition-colors"
              >
                &#8599;
              </button>
              <button
                type="button"
                aria-label="Copy link"
                className="w-8 h-8 rounded-sm border border-dark-green/20 flex items-center justify-center text-dark-green hover:border-gold hover:text-gold transition-colors"
              >
                &#128279;
              </button>
            </div>
          </div>

          <div className="mt-12 bg-[#F0EADD] border border-dark-green/10 p-5 md:p-7 max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-sm bg-dark-green/10">
                <Image src="/obinna.jpg" alt="Obinna Udenwe" fill className="object-cover" />
              </div>
              <div className="space-y-2.5">
                <h2 className="font-serif text-2xl font-semibold text-dark-green">Obinna Udenwe</h2>
                <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
                  Obinna Udenwe is an award-winning Nigerian novelist and short story
                  writer. He is the author of <em>Satans &amp; Shaitans</em>,{" "}
                  <em>Colours of Hatred</em>, and <em>Years of Shame</em>.
                </p>
                <Link
                  href="/about"
                  className="inline-block text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
