"use client";

import Image from "next/image";
import Link from "next/link";
import { Story, slugify } from "../lib/api";

function StoriesHeader() {
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
      </div>
    </section>
  );
}

function FeaturedStory({ story }: { story: Story }) {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-14 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="relative shrink-0 w-full lg:max-w-[420px] rounded-sm overflow-hidden">
            {story.cover ? (
              <Image
                src={story.cover}
                alt={story.title}
                width={600}
                height={450}
                className="w-full h-auto"
                unoptimized
              />
            ) : (
              <div className="aspect-[4/3] bg-dark-green/10 rounded-sm" />
            )}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
          <div className="flex-1 space-y-4 md:space-y-5 w-full">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold">
              Short Story
              {story.read_time ? ` · ${story.read_time}` : ""}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green">
              {story.title}
            </h2>
            {story.excerpt ? (
              <p className="text-sm text-foreground/70 max-w-xl leading-relaxed">
                {story.excerpt}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-5 md:gap-6 pt-2">
              <Link
                href={`/stories/${slugify(story.title)}`}
                className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
              >
                Read the Story &rarr;
              </Link>
            </div>
          </div>
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
          <div className="col-span-9">Story Title &amp; Excerpt</div>
          <div className="col-span-3 text-right">Read Time</div>
        </div>
        {stories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif italic text-lg text-dark-green/60">
              No stories yet. Check back soon.
            </p>
          </div>
        ) : (
          stories.map((r) => (
            <Link
              href={`/stories/${slugify(r.title)}`}
              key={r.id}
              className="grid grid-cols-12 gap-x-4 gap-y-3 py-6 md:py-8 border-b border-dark-green/10 items-start hover:bg-dark-green/5 transition-colors"
            >
              <div className="col-span-12 md:col-span-9 space-y-2">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-foreground/60 bg-dark-green/5 px-2 py-1 rounded-sm">
                  Short Story
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-dark-green">
                  {r.title}
                </h3>
                {r.excerpt ? (
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {r.excerpt}
                  </p>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3 text-sm text-foreground/70 md:text-right">
                <span className="md:hidden block text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                  Read Time
                </span>
                {r.read_time || "—"}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export function StoriesClient({ stories }: { stories: Story[] }) {
  const [featured, ...rest] = stories;
  return (
    <>
      <StoriesHeader />
      {featured ? (
        <FeaturedStory story={featured} />
      ) : (
        <section className="bg-cream">
          <div className="px-6 md:px-8 lg:px-16 pb-20 text-center">
            <p className="font-serif italic text-xl text-dark-green/60">
              No stories yet. Check back soon.
            </p>
          </div>
        </section>
      )}
      {rest.length > 0 ? <StoriesTable stories={rest} /> : null}
    </>
  );
}
