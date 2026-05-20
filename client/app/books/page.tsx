import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Book, booksApi, slugify } from "../lib/api";
import { FALLBACK_BOOKS } from "../lib/fallback";

async function loadBooks(): Promise<Book[]> {
  try {
    const all = await booksApi.list();
    const published = all.filter((b) => b.status === "published");
    return published.length > 0 ? published : FALLBACK_BOOKS;
  } catch {
    return FALLBACK_BOOKS;
  }
}

function BookRow({ book, reverse }: { book: Book; reverse: boolean }) {
  const href = `/books/${slugify(book.title)}`;
  return (
    <div
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center justify-center gap-12 lg:gap-20 max-w-5xl mx-auto`}
    >
      <Link href={href} className="shrink-0 w-full max-w-[380px] block">
        {book.image ? (
          <Image
            src={book.image}
            alt={`${book.title} book cover`}
            width={400}
            height={520}
            className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <div className="aspect-[4/5] bg-dark-green/10 rounded-sm" />
        )}
      </Link>
      <div className="flex-1 max-w-xl space-y-5">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold border border-gold px-3 py-1 rounded-full">
          {book.year}
        </span>
        <Link href={href}>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-dark-green hover:text-gold transition-colors">
            {book.title}
          </h2>
        </Link>
        {book.tagline ? (
          <p className="font-serif italic text-lg text-dark-green/70">
            {book.tagline}
          </p>
        ) : null}
        {book.description ? (
          <p className="font-sans text-[18px] leading-[39px] text-foreground/70 max-w-lg">
            {book.description}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={href}
            className="bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-dark-green/90 transition-colors"
          >
            Get the Book
          </Link>
          <Link
            href={href}
            className="border-2 border-dark-green text-dark-green text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-dark-green hover:text-white transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function BooksPage() {
  const books = await loadBooks();

  return (
    <>
      <Navbar />
      <section className="bg-cream relative">
        {books.map((book, i) => (
          <div
            key={book.id}
            className="sticky top-0 min-h-screen flex flex-col justify-center bg-cream px-6 md:px-8 lg:px-16 py-14 md:py-16"
          >
            {i === 0 && (
              <div className="w-full mb-12 md:mb-20 lg:mb-28">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-3">
                  Books
                </h1>
                <p className="font-serif italic text-base md:text-lg text-dark-green/70">
                  Novels, novellas, and collections.
                </p>
              </div>
            )}
            <BookRow book={book} reverse={i % 2 === 1} />
          </div>
        ))}
      </section>
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
