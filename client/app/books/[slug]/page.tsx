import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";
import { Book, booksApi, slugify } from "../../lib/api";
import { FALLBACK_BOOKS } from "../../lib/fallback";
import {
  absoluteUrl,
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  jsonLdScript,
  SITE_URL,
  truncate,
} from "../../lib/seo";

async function loadBooks(): Promise<Book[]> {
  try {
    const all = await booksApi.list();
    const published = all.filter((b) => b.status === "published");
    return published.length > 0 ? published : FALLBACK_BOOKS;
  } catch {
    return FALLBACK_BOOKS;
  }
}

export async function generateStaticParams() {
  const books = await loadBooks();
  return books.map((b) => ({ slug: slugify(b.title) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const books = await loadBooks();
  const book = books.find((b) => slugify(b.title) === slug);
  if (!book) {
    return { title: "Book not found", robots: { index: false, follow: false } };
  }
  const description = truncate(book.description || book.tagline || "", 160);
  const image = book.image || DEFAULT_OG_IMAGE;
  const canonical = `/books/${slug}`;
  return {
    title: `${book.title} (${book.year}) — A Novel by Obinna Udenwe`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "book",
      title: book.title,
      description,
      url: canonical,
      images: [absoluteUrl(image)],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

function BookHero({ book }: { book: Book }) {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative overflow-hidden rounded-sm p-10 lg:p-16 flex items-center justify-center min-h-[560px]">
          {book.image ? (
            <>
              <Image
                src={book.image}
                alt=""
                fill
                aria-hidden
                className="object-cover scale-125 blur-2xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/30" />
              <Image
                src={book.image}
                alt={`${book.title} book cover`}
                width={400}
                height={560}
                className="relative z-10 w-full max-w-[380px] h-auto drop-shadow-2xl"
                priority
                unoptimized
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-dark-green/10" />
          )}
        </div>
        <div className="space-y-6">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold">
            Published {book.year}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-dark-green tracking-tight">
            {book.title}
          </h1>
          {book.tagline ? (
            <p className="font-serif italic text-lg text-dark-green/70">
              {book.tagline}
            </p>
          ) : null}
          {book.description ? (
            <p className="font-sans text-[18px] leading-[39px] text-foreground/80 max-w-xl">
              {book.description}
            </p>
          ) : null}
          <Link
            href="#"
            className="inline-block bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-dark-green/90 transition-colors mt-2"
          >
            Get the Book
          </Link>
        </div>
      </div>
    </section>
  );
}

function GetYourCopy() {
  const options = [
    { label: "Amazon Kindle", href: "#" },
    { label: "Okadabooks", href: "#" },
    { label: "Signed Copy", href: "#" },
  ];

  return (
    <section className="bg-[#1B1B1B] text-white">
      <div className="px-8 lg:px-16 py-20 text-center">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-10">
          Get Your Copy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {options.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              className="border border-white/20 rounded-sm py-6 text-sm uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              {o.label}
            </Link>
          ))}
        </div>
        <Link
          href="/books"
          className="text-xs uppercase tracking-widest text-white/70 hover:text-gold transition-colors"
        >
          View all books &rarr;
        </Link>
      </div>
    </section>
  );
}

function MoreFromAuthor({ others }: { others: Book[] }) {
  if (others.length === 0) return null;
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-green">
            More from Obinna Udenwe
          </h2>
          <Link
            href="/books"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            View Bibliography &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {others.map((b) => (
            <Link href={`/books/${slugify(b.title)}`} key={b.id} className="group block">
              {b.image ? (
                <Image
                  src={b.image}
                  alt={b.title}
                  width={400}
                  height={520}
                  className="w-full h-auto mb-4 group-hover:scale-[1.02] transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="aspect-[4/5] bg-dark-green/10 rounded-sm mb-4" />
              )}
              <p className="font-serif text-lg text-dark-green">{b.title}</p>
              <p className="text-xs uppercase tracking-widest text-foreground/50 mt-1">
                {b.year}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const books = await loadBooks();
  const book = books.find((b) => slugify(b.title) === slug);
  if (!book) notFound();

  const others = books.filter((b) => b.id !== book.id);

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    bookFormat: "https://schema.org/Hardcover",
    image: absoluteUrl(book.image || DEFAULT_OG_IMAGE),
    description: truncate(book.description || book.tagline || "", 500),
    datePublished: String(book.year),
    inLanguage: "en",
    author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    url: `${SITE_URL}/books/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bookSchema) }}
      />
      <Navbar />
      <BookHero book={book} />
      <GetYourCopy />
      <MoreFromAuthor others={others} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
