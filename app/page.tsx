import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { QuoteAndNewsletter } from "./components/QuoteAndNewsletter";

function HeroSection() {
  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-12 md:py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-12 lg:gap-8">
        <div className="flex-1 space-y-3">
          <p className="font-sans text-base md:text-lg leading-7 md:leading-9 text-[#FFCA64] mt-2 md:mt-6">
            Novelist. Story-teller. Civil engineer.
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Obinna Udenwe
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed">
            Award-winning Nigerian author of power, faith, and consequence.
          </p>
          <Link
            href="#books"
            className="inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-gold/90 transition-colors mt-2"
          >
            Explore Bibliography
          </Link>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:block">
          <div
            className="relative overflow-hidden mx-auto lg:mx-0
                       w-[280px] h-[326px]
                       sm:w-[340px] sm:h-[395px]
                       lg:w-[430px] lg:h-[500px]
                       rounded-[20px] md:rounded-[24px] lg:rounded-[30px]
                       border-[6px] md:border-[7px] lg:border-[9px]"
            style={{ borderColor: "#C8922A" }}
          >
            <Image
              src="/obinna.jpg"
              alt="Obinna Udenwe"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardsTicker() {
  const awards = [
    "Chinua Achebe Prize 2021",
    "ANA Prize 2019",
    "Prairie Schooner Prize 2020",
    "NLNG Finalist",
  ];

  return (
    <div
      className="bg-white"
      style={{
        borderTop: "1px solid #C2C8C11A",
        borderBottom: "1px solid #C2C8C11A",
      }}
    >
      <div className="px-6 md:px-8 lg:px-16 py-8 md:py-12 grid grid-cols-2 md:flex md:items-center md:justify-between gap-x-6 gap-y-5">
        {awards.map((award, i) => (
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

function FeaturedBook() {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pt-14 md:pt-20 pb-0 flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-20">
        <div className="shrink-0 flex justify-center lg:block">
          <Image
            src="/book1.png"
            alt="Years of Shame book cover"
            width={449}
            height={573}
            className="w-[240px] md:w-[300px] lg:w-[350px] h-auto"
          />
        </div>
        <div className="flex-1 space-y-4 md:space-y-5 max-w-full lg:max-w-none">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold border border-gold px-3 py-1 rounded-full">
            New Release 2025
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green">
            Years of Shame
          </h2>
          <p className="font-serif italic text-base md:text-lg text-dark-green/70">
            A sweeping saga of legacy and redemption in the heart of the
            savannah.
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-lg">
            In his most ambitious work to date, Udenwe weaves a tapestry of
            political intrigue and personal sacrifice that redefines the modern
            West African epic.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
            <Link
              href="#"
              className="bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-5 md:px-6 py-3 rounded-sm hover:bg-dark-green/90 transition-colors"
            >
              Get the Book
            </Link>
            <Link
              href="#"
              className="border-2 border-dark-green text-dark-green text-xs font-semibold uppercase tracking-widest px-5 md:px-6 py-3 rounded-sm hover:bg-dark-green hover:text-white transition-colors"
            >
              Read an Excerpt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BooksSection() {
  const books = [
    { title: "Years of Shame", cover: "/books/Group 1 (1).png" },
    { title: "Satans and Shaitans", cover: "/books/Frame 15 (1).png" },
    { title: "Colours of Hatred", cover: "/books/Group 5 (1).png" },
    { title: "Satans & Shaitans (2nd Ed.)", cover: "/books/Group 4 (1).png" },
  ];

  return (
    <section id="books" className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pt-14 md:pt-20 pb-0">
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
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            View Archive →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {books.map((book) => (
            <Link href="#" key={book.title} className="group block">
              <Image
                src={book.cover}
                alt={book.title}
                width={400}
                height={520}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const photos = [
    "/books/IMG_0552 1.png",
    "/books/IMG_0294 1.png",
    "/books/IMG_3219 1.png",
    "/books/IMG_3219 1 (1).png",
  ];

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pt-14 md:pt-20 pb-0">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
          Where the Story Began
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-8 md:mb-10">
          Literary and atmospheric
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="aspect-4/3 relative overflow-hidden rounded-sm bg-dark-green/10"
            >
              <Image
                src={photo}
                alt={`Gallery photo ${i + 1}`}
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

function LatestWriting() {
  const articles = [
    {
      category: "Short Fiction",
      title: "The Shadows of Enugu: A Tale of Two Souls",
      link: "#",
    },
    {
      category: "Essay",
      title: "The Architecture of Memory in Contemporary Fiction",
      link: "#",
    },
    {
      category: "Essay",
      title: "On Faith, Power, and the Responsibility of the Author",
      link: "#",
    },
  ];

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
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article) => (
            <Link
              href={article.link}
              key={article.title}
              className="group bg-white p-6 rounded-sm border border-foreground/10 hover:shadow-md transition-shadow"
            >
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">
                {article.category}
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

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AwardsTicker />
      <FeaturedBook />
      <BooksSection />
      <GallerySection />
      <LatestWriting />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
