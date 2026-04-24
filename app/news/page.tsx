"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";

type Tag = "News" | "Blog";
type Filter = "All" | Tag;

type Article = {
  tag: Tag;
  title: string;
  date: string;
  description: string;
  image?: string;
};

const ARTICLES: Article[] = [
  {
    tag: "News",
    title: "The Satirist's Burden: A New Chapter in Nigerian Political Fiction",
    date: "October 12, 2024",
    description:
      "In his recent dispatch, Udenwe explores the delicate balance between satirical license and the contemporary pulse of Nigerian governance, marking a pivotal shift in his upcoming anthology.",
    image: "/Obinna Udenwe Portrait.png",
  },
  {
    tag: "Blog",
    title: "The Silence of the Archives: Why We Must Write What We Forget",
    date: "September 5, 2024",
    description:
      "History is often a collection of what was convenient to record. For the Nigerian writer, the archive is not just a place of discovery but a site of excavation and reconstruction of the suppressed voice.",
  },
  {
    tag: "News",
    title: "Obinna Udenwe Wins the Prestigious Heritage Lit Prize",
    date: "August 30, 2024",
    description:
      "The judging panel cited The Colors of Hatred as a masterpiece of contemporary African literature during the ceremony in Lagos.",
    image: "/books/IMG_0552 1.png",
  },
  {
    tag: "Blog",
    title: "Morning Tea in Abakaliki",
    date: "August 30, 2024",
    description:
      "Finding the rhythm of prose outside the bustle of Lagos at Mount Sinai.",
  },
  {
    tag: "Blog",
    title: "Reflections on Chinua Achebe",
    date: "July 22, 2024",
    description:
      "Rereading Arrow of God in the 21st century and finding new echoes of power and age.",
  },
  {
    tag: "Blog",
    title: "Upcoming Workshop: The Art of Suspense",
    date: "August 10, 2024",
    description:
      "Join Obinna for an intensive 5-day digital masterclass on crafting political thrillers.",
  },
];

const FILTERS: Filter[] = ["All", "News", "Blog"];

function Tabs({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (f: Filter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-8 border-b border-dark-green/15 pb-3">
      {FILTERS.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
              active
                ? "text-dark-green border-b-2 border-dark-green pb-3 -mb-[13px]"
                : "text-foreground/50 hover:text-dark-green"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-sm overflow-hidden">
      <div className="relative w-full aspect-[4/3] lg:aspect-auto bg-dark-green/10">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="bg-dark-green text-white p-10 lg:p-14 flex flex-col justify-center">
        <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-gold bg-gold/10 border border-gold/60 px-2 py-1 rounded-sm mb-6">
          {article.tag}
        </span>
        <h2 className="font-serif italic text-3xl lg:text-4xl mb-4 leading-tight">
          {article.title}
        </h2>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-6">
          {article.date}
        </p>
        <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-md">
          {article.description}
        </p>
        <Link
          href="#"
          className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-white transition-colors"
        >
          Read the Full Story &rarr;
        </Link>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
        {article.tag}
      </p>
      <h3 className="font-serif text-xl lg:text-2xl text-dark-green leading-snug">
        {article.title}
      </h3>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/50">
        {article.date}
      </p>
      <p className="text-sm text-foreground/70 leading-relaxed">
        {article.description}
      </p>
      <Link
        href="#"
        className="inline-block text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors pt-1"
      >
        Read More &rarr;
      </Link>
    </article>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="py-20 text-center">
      <p className="font-serif italic text-xl text-dark-green/60">
        No {filter.toLowerCase()} articles yet. Check back soon.
      </p>
    </div>
  );
}

export default function NewsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? ARTICLES : ARTICLES.filter((a) => a.tag === filter)),
    [filter]
  );

  const [featured, ...rest] = filtered;

  return (
    <>
      <Navbar />
      <section className="bg-cream">
        <div className="px-8 lg:px-16 pt-20 pb-10">
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-dark-green mb-4">
            News &amp; Writing
          </h1>
          <p className="font-sans text-base text-foreground/70 max-w-2xl mb-10">
            Press coverage, announcements, and reflections on writing, politics,
            and the literary life.
          </p>
          <Tabs value={filter} onChange={setFilter} />
        </div>
      </section>

      <section className="bg-cream">
        <div className="px-8 lg:px-16 pb-20">
          {!featured ? (
            <EmptyState filter={filter} />
          ) : (
            <>
              <div className="pb-12">
                <FeaturedCard article={featured} />
              </div>
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {rest.map((a, i) => (
                    <ArticleCard key={`${a.title}-${i}`} article={a} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
