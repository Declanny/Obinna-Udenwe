import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { BOOKS, type BookDetail } from "./booksData";

function BookRow({ book, reverse }: { book: BookDetail; reverse: boolean }) {
  const href = `/books/${book.slug}`;
  return (
    <div
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center justify-center gap-12 lg:gap-20 max-w-5xl mx-auto`}
    >
      <Link href={href} className="shrink-0 w-full max-w-[380px] block">
        <Image
          src={book.cover}
          alt={`${book.title} book cover`}
          width={400}
          height={520}
          className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
        />
      </Link>
      <div className="flex-1 max-w-xl space-y-5">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold border border-gold px-3 py-1 rounded-full">
          {book.listLabel}
        </span>
        <Link href={href}>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-dark-green hover:text-gold transition-colors">
            {book.title}
          </h2>
        </Link>
        <p className="font-serif italic text-lg text-dark-green/70">
          {book.listTagline}
        </p>
        <p className="font-sans text-[18px] leading-[39px] text-foreground/70 max-w-lg">
          {book.listDescription}
        </p>
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

function BooksList() {
  return (
    <section className="bg-cream relative">
      {BOOKS.map((book, i) => (
        <div
          key={book.slug}
          className="sticky top-0 min-h-screen flex flex-col justify-center bg-cream px-8 lg:px-16 py-16"
        >
          {i === 0 && (
            <div className="max-w-5xl mx-auto w-full mb-12 lg:mb-16">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-dark-green mb-3">
                Books
              </h1>
              <p className="font-serif italic text-lg text-dark-green/70">
                Novels, novellas, and collections.
              </p>
            </div>
          )}
          <BookRow book={book} reverse={i % 2 === 1} />
        </div>
      ))}
    </section>
  );
}

export default function BooksPage() {
  return (
    <>
      <Navbar />
      <BooksList />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
