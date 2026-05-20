import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { QuoteAndNewsletter } from "./components/QuoteAndNewsletter";
import {
  Blog,
  Book,
  GalleryItemApi,
  SiteContent,
  blogsApi,
  booksApi,
  galleryApi,
  siteContentApi,
  slugify,
} from "./lib/api";
import {
  FALLBACK_BLOGS,
  FALLBACK_BOOKS,
  FALLBACK_GALLERY,
  FALLBACK_SITE,
} from "./lib/fallback";

async function loadData() {
  const [siteRes, booksRes, blogsRes, galleryRes] = await Promise.allSettled([
    siteContentApi.get(),
    booksApi.list(),
    blogsApi.list(),
    galleryApi.list(),
  ]);
  return {
    site: siteRes.status === "fulfilled" ? siteRes.value : null,
    books: booksRes.status === "fulfilled" ? booksRes.value : [],
    blogs: blogsRes.status === "fulfilled" ? blogsRes.value : [],
    gallery: galleryRes.status === "fulfilled" ? galleryRes.value : [],
  };
}

function HeroSection({ site }: { site: SiteContent | null }) {
  const kicker = site?.hero_kicker || FALLBACK_SITE.hero_kicker;
  const title = site?.hero_title || FALLBACK_SITE.hero_title;
  const subtitle = site?.hero_subtitle || FALLBACK_SITE.hero_subtitle;
  const cta = site?.hero_cta_label || FALLBACK_SITE.hero_cta_label;
  const heroImg = site?.hero_image || FALLBACK_SITE.hero_image;

  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-12 md:py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-12 lg:gap-8">
        <div className="flex-1 space-y-3">
          <p className="font-sans text-base md:text-lg leading-7 md:leading-9 text-[#FFCA64] mt-2 md:mt-6">
            {kicker}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed">
            {subtitle}
          </p>
          <Link
            href="/about"
            className="inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-gold/90 transition-colors mt-2"
          >
            {cta}
          </Link>
        </div>
        <div className="shrink-0 w-full lg:w-auto">
          <div
            className="relative overflow-hidden
                       w-full aspect-[430/500]
                       sm:w-[420px] sm:h-[488px] sm:aspect-auto
                       lg:w-[430px] lg:h-[500px]
                       rounded-t-[20px] md:rounded-t-[24px] lg:rounded-[30px]
                       border-[6px] md:border-[7px] lg:border-[9px]"
            style={{ borderColor: "#C8922A" }}
          >
            <Image
              src={heroImg}
              alt={title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardsTicker({ awards }: { awards: string[] }) {
  const items = awards.length > 0 ? awards : FALLBACK_SITE.awards;
  return (
    <div
      className="bg-white"
      style={{
        borderTop: "1px solid #C2C8C11A",
        borderBottom: "1px solid #C2C8C11A",
      }}
    >
      <div className="px-6 md:px-8 lg:px-16 py-8 md:py-12 grid grid-cols-2 md:flex md:items-center md:justify-between gap-x-6 gap-y-5">
        {items.map((award, i) => (
          <span
            key={i}
            className="font-sans font-bold text-[11px] md:text-xs uppercase text-black pb-1 text-center md:text-left"
            style={{ letterSpacing: "2.4px", lineHeight: "16px", borderBottom: "2px solid #C8922A" }}
          >
            {award}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturedBook({ site }: { site: SiteContent | null }) {
  const kicker = site?.featured_kicker || FALLBACK_SITE.featured_kicker;
  const title = site?.featured_title || FALLBACK_SITE.featured_title;
  const tagline = site?.featured_tagline || FALLBACK_SITE.featured_tagline;
  const description = site?.featured_description || FALLBACK_SITE.featured_description;
  const image = site?.featured_image || FALLBACK_SITE.featured_image;

  return (
    <section className="bg-cream sticky top-0 min-h-screen flex items-center">
      <div className="w-full px-6 md:px-8 lg:px-16 py-14 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 lg:gap-24">
          <div className="shrink-0 flex justify-center lg:block">
            <Image
              src={image}
              alt={`${title} book cover`}
              width={449}
              height={573}
              className="w-[260px] md:w-[340px] lg:w-[440px] h-auto"
              unoptimized
            />
          </div>
          <div className="flex-1 space-y-5 md:space-y-6 max-w-full lg:max-w-2xl">
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest text-gold border border-gold px-4 py-1.5 rounded-full">
              {kicker}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight">
              {title}
            </h2>
            <p className="font-serif italic text-lg md:text-xl lg:text-2xl text-dark-green/70 leading-snug">
              {tagline}
            </p>
            <p className="text-base md:text-[17px] text-foreground/70 leading-relaxed max-w-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-3">
              <Link
                href="/books"
                className="bg-dark-green text-white text-xs md:text-sm font-semibold uppercase tracking-widest px-6 md:px-7 py-3.5 md:py-4 rounded-sm hover:bg-dark-green/90 transition-colors"
              >
                Get the Book
              </Link>
              <Link
                href="/books"
                className="border-2 border-dark-green text-dark-green text-xs md:text-sm font-semibold uppercase tracking-widest px-6 md:px-7 py-3.5 md:py-4 rounded-sm hover:bg-dark-green hover:text-white transition-colors"
              >
                Read an Excerpt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BooksSection({ books }: { books: Book[] }) {
  const published = books.filter((b) => b.status === "published");
  const items = (published.length > 0 ? published : FALLBACK_BOOKS).slice(0, 4);

  return (
    <section id="books" className="bg-cream sticky top-0 min-h-screen flex items-start lg:items-center">
      <div className="w-full px-6 md:px-8 lg:px-16 pt-20 md:pt-24 lg:pt-16 pb-10 md:pb-12 lg:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Journal
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green">
              The Books
            </h2>
          </div>
          <Link
            href="/books"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            View Archive →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((book) => (
            <Link href={`/books/${slugify(book.title)}`} key={book.id} className="group block">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  width={400}
                  height={520}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="aspect-4/5 bg-dark-green/10 rounded-sm" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ gallery }: { gallery: GalleryItemApi[] }) {
  const items = (gallery.length > 0 ? gallery : FALLBACK_GALLERY).slice(0, 4);
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pt-6 md:pt-8 lg:pt-12 pb-0">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
          Where the Story Began
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-8 md:mb-10">
          Literary and atmospheric
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((photo) => (
            <div
              key={photo.id}
              className="aspect-4/3 relative overflow-hidden rounded-sm bg-dark-green/10"
            >
              {photo.image ? (
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestWriting({ blogs }: { blogs: Blog[] }) {
  const published = blogs.filter((b) => b.status === "published");
  const items = (published.length > 0 ? published : FALLBACK_BLOGS).slice(0, 3);
  return (
    <section id="blog" className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 py-14 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Journal
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green">
              Latest Writing
            </h2>
          </div>
          <Link
            href="/news"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {items.map((article) => (
            <Link
              href={`/news/${slugify(article.title)}`}
              key={article.id}
              className="group bg-white p-6 rounded-sm border border-foreground/10 hover:shadow-md transition-shadow"
            >
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">
                {article.category === "news" ? "News" : "Blog"}
              </p>
              <h3 className="font-serif text-xl font-semibold text-dark-green mb-8 group-hover:text-gold transition-colors">
                {article.title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-foreground/50">
                Read More →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const { site, books, blogs, gallery } = await loadData();
  return (
    <>
      <Navbar />
      <HeroSection site={site} />
      <AwardsTicker awards={site?.awards ?? []} />
      <div className="relative">
        <FeaturedBook site={site} />
        <BooksSection books={books} />
      </div>
      <GallerySection gallery={gallery} />
      <LatestWriting blogs={blogs} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
