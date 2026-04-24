import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";
import { BOOKS, getBook, getOtherBooks, type BookDetail } from "../booksData";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

function BookHero({ book }: { book: BookDetail }) {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative overflow-hidden rounded-sm p-10 lg:p-16 flex items-center justify-center min-h-[560px]">
          <Image
            src={book.cover}
            alt=""
            fill
            aria-hidden
            className="object-cover scale-125 blur-2xl"
          />
          <div className="absolute inset-0 bg-black/30" />
          <Image
            src={book.cover}
            alt={`${book.title} book cover`}
            width={400}
            height={560}
            className="relative z-10 w-full max-w-[380px] h-auto drop-shadow-2xl"
            priority
          />
        </div>
        <div className="space-y-6">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold">
            {book.heroLabel}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-dark-green tracking-tight">
            SYNOPSIS
          </h1>
          <p className="font-serif italic text-lg text-dark-green/70">
            {book.genre}
          </p>
          <p className="font-sans text-[18px] leading-[39px] text-foreground/80 max-w-xl">
            {book.synopsis}
          </p>
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

function MilestonesSection({ book }: { book: BookDetail }) {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pb-16">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-8">
          Milestones &amp; Recognition
        </p>
        <div className="max-w-3xl divide-y divide-dark-green/10">
          {book.milestones.map((m, i) => (
            <div key={i} className="flex gap-10 py-5">
              <span className="font-serif text-lg text-dark-green/80 w-16 shrink-0">
                {m.year}
              </span>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthorQuote({ quote }: { quote: string }) {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pb-20">
        <div className="bg-[#F0EADD] rounded-sm p-10 lg:p-16 flex flex-col lg:flex-row items-start gap-10">
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/obinna.jpg"
                alt="Obinna Udenwe"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs uppercase tracking-widest text-dark-green/70">
              Obinna Udenwe
            </p>
          </div>
          <blockquote className="flex-1 font-serif italic text-xl lg:text-2xl text-dark-green leading-relaxed">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function LaunchSection({ photos }: { photos: string[] }) {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pb-20">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-green text-center mb-10 tracking-tight">
          THE LAUNCH
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {photos.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-sm overflow-hidden"
            >
              <Image
                src={src}
                alt={`Launch photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
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

function MoreFromAuthor({ slug }: { slug: string }) {
  const others = getOtherBooks(slug);
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
            <Link href={`/books/${b.slug}`} key={b.slug} className="group block">
              <Image
                src={b.cover}
                alt={b.title}
                width={400}
                height={520}
                className="w-full h-auto mb-4 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <p className="font-serif text-lg text-dark-green">{b.title}</p>
              <p className="text-xs uppercase tracking-widest text-foreground/50 mt-1">
                {b.heroLabel}
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
  const book = getBook(slug);
  if (!book) notFound();

  return (
    <>
      <Navbar />
      <BookHero book={book} />
      <MilestonesSection book={book} />
      <AuthorQuote quote={book.quote} />
      <LaunchSection photos={book.launchPhotos} />
      <GetYourCopy />
      <MoreFromAuthor slug={book.slug} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
