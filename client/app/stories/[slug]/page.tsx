import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";
import { Story, slugify, storiesApi } from "../../lib/api";

async function loadStories(): Promise<Story[]> {
  try {
    return await storiesApi.list();
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const stories = await loadStories();
  return stories
    .filter((s) => s.status === "published")
    .map((s) => ({ slug: slugify(s.title) }));
}

function BackRail() {
  return (
    <div className="hidden lg:flex fixed left-6 xl:left-10 top-28 z-30 flex-col items-center gap-5">
      <Link
        href="/stories"
        aria-label="Back to Stories"
        className="w-11 h-11 rounded-full bg-dark-green text-white flex items-center justify-center hover:bg-dark-green/90 transition-colors"
      >
        <span aria-hidden>&larr;</span>
      </Link>
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dark-green/70 font-semibold"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Back to Library
      </p>
    </div>
  );
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stories = await loadStories();
  const story = stories.find((s) => slugify(s.title) === slug && s.status === "published");
  if (!story) notFound();

  return (
    <>
      <Navbar />
      <BackRail />
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
            <Link href="/stories" className="hover:text-dark-green transition-colors">
              Stories
            </Link>
            <span>&rsaquo;</span>
            <span className="text-dark-green">{story.title}</span>
          </nav>
          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-gold text-[11px] md:text-xs uppercase tracking-widest font-semibold">
              Short Fiction
            </p>
            {story.read_time ? (
              <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-foreground/50 whitespace-nowrap">
                {story.read_time} read
              </span>
            ) : null}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight mb-6">
            “{story.title}”
          </h1>
          {story.excerpt ? (
            <p className="font-serif italic text-lg text-dark-green/70 max-w-2xl">
              {story.excerpt}
            </p>
          ) : null}
        </div>
      </section>

      {story.cover ? (
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 md:px-8 pb-8">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm">
              <Image
                src={story.cover}
                alt={story.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-cream">
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-16">
          {story.body ? (
            <div className="text-base md:text-[17px] leading-8 text-foreground/85 space-y-5 whitespace-pre-line">
              {story.body}
            </div>
          ) : (
            <p className="font-serif italic text-dark-green/60">
              The full story is not available yet. Check back soon.
            </p>
          )}
        </div>
      </section>

      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
