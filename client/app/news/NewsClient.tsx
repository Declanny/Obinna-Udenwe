"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog, slugify } from "../lib/api";

type Filter = "All" | "News" | "Blog";

const FILTERS: Filter[] = ["All", "News", "Blog"];

function tagLabel(category: Blog["category"]): "News" | "Blog" {
  return category === "news" ? "News" : "Blog";
}

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

function FeaturedCard({ blog }: { blog: Blog }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-sm overflow-hidden">
      <div className="relative w-full aspect-4/3 lg:aspect-auto bg-dark-green/10">
        {blog.cover ? (
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="bg-dark-green text-white p-10 lg:p-14 flex flex-col justify-center">
        <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-gold bg-gold/10 border border-gold/60 px-2 py-1 rounded-sm mb-6">
          {tagLabel(blog.category)}
        </span>
        <h2 className="font-serif italic text-3xl lg:text-4xl mb-4 leading-tight">
          {blog.title}
        </h2>
        {blog.published_on ? (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-6">
            {blog.published_on}
          </p>
        ) : null}
        {blog.excerpt ? (
          <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-md">
            {blog.excerpt}
          </p>
        ) : null}
        <Link
          href={`/news/${slugify(blog.title)}`}
          className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-white transition-colors"
        >
          Read the Full Story &rarr;
        </Link>
      </div>
    </div>
  );
}

function ArticleCard({ blog }: { blog: Blog }) {
  return (
    <article className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
        {tagLabel(blog.category)}
      </p>
      <h3 className="font-serif text-xl lg:text-2xl text-dark-green leading-snug">
        {blog.title}
      </h3>
      {blog.published_on ? (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/50">
          {blog.published_on}
        </p>
      ) : null}
      {blog.excerpt ? (
        <p className="text-sm text-foreground/70 leading-relaxed">
          {blog.excerpt}
        </p>
      ) : null}
      <Link
        href={`/news/${slugify(blog.title)}`}
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

export function NewsClient({ blogs }: { blogs: Blog[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return blogs;
    const wanted = filter === "News" ? "news" : "blog";
    return blogs.filter((b) => b.category === wanted);
  }, [filter, blogs]);

  const [featured, ...rest] = filtered;

  return (
    <>
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
                <FeaturedCard blog={featured} />
              </div>
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {rest.map((b) => (
                    <ArticleCard key={b.id} blog={b} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
