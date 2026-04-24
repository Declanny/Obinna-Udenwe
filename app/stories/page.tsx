"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";

type StoryTag = "Fiction" | "Essay" | "Prize-winning" | "Adaptation";
type Filter = "All" | StoryTag;

type Story = {
  tag: StoryTag;
  title: string;
  excerpt: string;
  publication: string;
  year: string;
  prize?: boolean;
};

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "All" },
  { label: "Fiction", value: "Fiction" },
  { label: "Essays", value: "Essay" },
  { label: "Award-winning", value: "Prize-winning" },
  { label: "Adaptations", value: "Adaptation" },
];

const STORIES: Story[] = [
  {
    tag: "Adaptation",
    title: "It Has to Do with Emilia",
    excerpt: "The complexities of memory and betrayal unfold in a small town…",
    publication: "Gutter Magazine",
    year: "2022",
    prize: true,
  },
  {
    tag: "Prize-winning",
    title: "Prairie Schooner Prize Story",
    excerpt: "An odyssey of spirits and shadows across the Nigerian landscape…",
    publication: "Prairie Schooner",
    year: "2021",
    prize: true,
  },
  {
    tag: "Essay",
    title: "Crossover Mexico-Nigeria Stories",
    excerpt:
      "Reflections on the cultural bridges between two disparate yet connected worlds…",
    publication: "Lolwe",
    year: "2020",
  },
  {
    tag: "Fiction",
    title: "Holy Sex (Series)",
    excerpt:
      "A provocative exploration of the sacred and the profane in modern Lagos…",
    publication: "Munyori Literary Journal",
    year: "2018",
  },
  {
    tag: "Prize-winning",
    title: "The Short Story is Dead Prize Story",
    excerpt:
      "The final moments of a dying tradition told through multiple perspectives…",
    publication: "The Short Story is Dead",
    year: "2015",
    prize: true,
  },
];

function StoriesHeader({
  filter,
  onChange,
}: {
  filter: Filter;
  onChange: (f: Filter) => void;
}) {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pt-14 md:pt-20 pb-8 md:pb-10">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-4">
          Short Fiction &amp; Essays
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-4">
          The Stories
        </h1>
        <p className="font-sans text-sm md:text-base text-foreground/70 max-w-2xl mb-8 md:mb-10">
          Published across literary journals in Nigeria and worldwide since 2014.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:gap-8 border-b border-dark-green/15 pb-3">
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange(f.value)}
                className={`text-[11px] md:text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  active
                    ? "text-dark-green border-b-2 border-dark-green pb-3 -mb-[13px]"
                    : "text-foreground/50 hover:text-dark-green"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedAdaptation({ story }: { story: Story }) {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-14 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="relative shrink-0 w-full lg:max-w-[420px] rounded-sm overflow-hidden">
            <Image
              src="/Cinematic frame.png"
              alt={story.title}
              width={600}
              height={450}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
          <div className="flex-1 space-y-4 md:space-y-5 w-full">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold">
              {story.tag} &mdash; Short Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green">
              {story.title}
            </h2>
            <p className="text-sm text-foreground/70 max-w-xl leading-relaxed">
              Made into a film in 2022 by Bump Films, South Africa. Produced by
              Bridget Pickering, co-producer of Hotel Rwanda.
            </p>
            <blockquote className="font-serif italic text-base text-dark-green/80 border-l-2 border-gold pl-5 max-w-xl leading-relaxed">
              &ldquo;The air in the room was thick with the scent of old
              mahogany and unsaid truths. Emilia sat by the window, her
              silhouette a sharp contrast against the rising Nigerian
              sun.&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-5 md:gap-6 pt-2">
              <Link
                href="#"
                className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
              >
                Read the Story &rarr;
              </Link>
              <Link
                href="#"
                className="text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-gold transition-colors"
              >
                About the Film &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrizeWinningStories() {
  const prizeStories = STORIES.filter((s) => s.prize).slice(0, 3);
  if (prizeStories.length === 0) return null;
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-12 md:pb-16 border-l-2 border-gold pl-5 md:pl-6 lg:pl-10">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-6 md:mb-8">
          Prize-winning Stories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {prizeStories.map((s) => (
            <div key={s.title} className="space-y-3">
              <h3 className="font-serif text-xl text-dark-green">{s.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {s.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesTable({ stories }: { stories: Story[] }) {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-14 md:pb-20">
        <div className="hidden md:grid grid-cols-12 gap-6 text-[10px] uppercase tracking-widest text-foreground/50 pb-4 border-b border-dark-green/15">
          <div className="col-span-7">Story Title &amp; Excerpt</div>
          <div className="col-span-3">Publication</div>
          <div className="col-span-2 text-right">Year</div>
        </div>
        {stories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif italic text-lg text-dark-green/60">
              No stories matching that filter.
            </p>
          </div>
        ) : (
          stories.map((r, i) => (
            <div
              key={`${r.title}-${i}`}
              className="grid grid-cols-12 gap-x-4 gap-y-3 py-6 md:py-8 border-b border-dark-green/10 items-start"
            >
              <div className="col-span-12 md:col-span-7 space-y-2">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-foreground/60 bg-dark-green/5 px-2 py-1 rounded-sm">
                  {r.tag}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-dark-green">
                  {r.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {r.excerpt}
                </p>
              </div>
              <div className="col-span-7 md:col-span-3 text-sm text-foreground/70">
                <span className="md:hidden block text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                  Publication
                </span>
                {r.publication}
              </div>
              <div className="col-span-5 md:col-span-2 text-sm text-foreground/70 text-right flex items-center justify-end gap-2">
                {r.prize && <span className="text-gold">★</span>}
                {r.year}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function CollectionsSection() {
  const items = [
    {
      title: "Voices From My Clan",
      description:
        "A comprehensive anthology featuring diverse voices of modern West Africa fiction.",
      tag: "Anthology",
    },
    {
      title: "Ebedi Review",
      description:
        "The official journal for the Ebedi International Writers Residency.",
      tag: "Literary Journal",
    },
    {
      title: "The Village Square Journal",
      description:
        "Where global narratives meet local perspectives in literary excellence.",
      tag: "Digital Archive",
    },
  ];
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-14 md:pb-20">
        <p className="text-dark-green text-xs uppercase tracking-widest font-semibold mb-6 md:mb-8">
          Collections &amp; Anthologies
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="border border-dark-green/15 rounded-sm p-6 md:p-8 flex flex-col gap-4 md:gap-5"
            >
              <h3 className="font-serif text-xl md:text-2xl text-dark-green">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed flex-1">
                {item.description}
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-dark-green">
                {item.tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StoriesPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return STORIES;
    if (filter === "Prize-winning")
      return STORIES.filter((s) => s.prize || s.tag === "Prize-winning");
    return STORIES.filter((s) => s.tag === filter);
  }, [filter]);

  const featured = filtered.find((s) => s.tag === "Adaptation") ?? filtered[0];
  const tableRows = filtered.filter((s) => s !== featured);
  const showPrizeSection = filter === "All" || filter === "Prize-winning";

  return (
    <>
      <Navbar />
      <StoriesHeader filter={filter} onChange={setFilter} />
      {featured ? (
        <FeaturedAdaptation story={featured} />
      ) : (
        <section className="bg-cream">
          <div className="px-6 md:px-8 lg:px-16 pb-20 text-center">
            <p className="font-serif italic text-xl text-dark-green/60">
              No stories in this category yet.
            </p>
          </div>
        </section>
      )}
      {showPrizeSection && <PrizeWinningStories />}
      <StoriesTable stories={tableRows} />
      {filter === "All" && <CollectionsSection />}
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
