import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";

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

function Breadcrumb() {
  return (
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
      <span className="text-dark-green">It Has to Do with Emilia</span>
    </nav>
  );
}

function StoryHead() {
  return (
    <section className="bg-cream">
      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-8">
        <Breadcrumb />
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-gold text-[11px] md:text-xs uppercase tracking-widest font-semibold">
            Prize-winning Fiction
          </p>
          <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-foreground/50 whitespace-nowrap">
            8 Min Read
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight mb-6">
          &ldquo;It Has to Do with Emilia&rdquo;
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-gold mb-2">
          Prairie Schooner&mdash;Glenna Luschei Prize, 2020
        </p>
        <p className="text-sm text-foreground/60 mb-8">
          First published in Gutter Magazine &middot; 2022
        </p>
        <div className="bg-dark-green text-white/90 rounded-sm border-l-4 border-gold px-5 md:px-6 py-4 md:py-5 text-sm leading-relaxed flex items-start gap-3">
          <span aria-hidden className="text-gold shrink-0 text-base mt-0.5">
            &#9733;
          </span>
          <p>
            This story was adapted into a film by{" "}
            <span className="text-gold font-semibold">Bump Films</span>, South
            Africa (2022) &mdash; produced by Bridget Pickering, co-producer of
            Hotel Rwanda.
          </p>
        </div>
      </div>
    </section>
  );
}

function StoryBody() {
  const tags = ["Nigeria", "Love", "Power"];
  return (
    <section className="bg-cream">
      <div className="max-w-4xl mx-auto px-6 md:px-8 pb-12 md:pb-16">
        <div className="font-sans text-[17px] md:text-[18px] leading-[32px] md:leading-[36px] text-foreground/85 space-y-6 pt-6">
          <p>
            I remember the way the heat clung to the corridors of the Enugu
            library, a thick, stagnant air that tasted of dust and old bindings.
            Emilia sat three tables away, her presence a Weeks passed before we
            spoke. The rain had finally broken the heat, a sudden tropical
            downpour that turned the red earth into a slick, treacherous canvas.
            We stood under the concrete overhang of the library entrance,
            watching the world turn grey. She asked for a light, though she had
            no cigarette. It was an opening, a bridge built of thin air and
            shared proximity.
          </p>
        </div>

        <div className="mt-14 pt-6 border-t border-dark-green/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
              Originally Published
            </p>
            <p className="font-serif italic text-sm md:text-base text-dark-green">
              Gutter Magazine, Issue 25
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-widest text-foreground/60 bg-dark-green/5 px-3 py-1.5 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Share"
              className="w-8 h-8 rounded-sm border border-dark-green/20 flex items-center justify-center text-dark-green hover:border-gold hover:text-gold transition-colors"
            >
              &#8599;
            </button>
            <button
              aria-label="Copy link"
              className="w-8 h-8 rounded-sm border border-dark-green/20 flex items-center justify-center text-dark-green hover:border-gold hover:text-gold transition-colors"
            >
              &#128279;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilmAdaptation() {
  return (
    <section className="bg-[#0C0C0C] text-white">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-white/5">
          <Image
            src="/Cinematic film still.png"
            alt="Film still from It Has to Do with Emilia"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-5">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            It Has to Do with Emilia
          </h2>
          <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-lg">
            A haunting visual translation of Udenwe&rsquo;s prose. Directed by
            award-winning visionaries, the film captures the atmospheric tension
            of Enugu through a lens of modern African noir.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                Director
              </p>
              <p className="text-sm md:text-base">Bridget Pickering</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                Studio
              </p>
              <p className="text-sm md:text-base">Bump Films, SA</p>
            </div>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-sm hover:bg-white/10 transition-colors mt-4"
          >
            <span>&#9654;</span>
            <span>Watch Trailer</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AuthorQuote() {
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-20">
        <div className="bg-[#F0EADD] rounded-sm p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-start gap-8 md:gap-10 max-w-5xl mx-auto">
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
              <Image
                src="/obinna.jpg"
                alt="Obinna Udenwe"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-dark-green/70">
              Obinna Udenwe
            </p>
          </div>
          <blockquote className="flex-1 font-serif italic text-lg md:text-xl lg:text-2xl text-dark-green/90 leading-relaxed">
            &ldquo;With this work, I wanted to confront the ghosts we inherit.
            It is not just a story of a family, but a meditation on how history
            breathes down our necks, demanding to be acknowledged before it can
            ever be truly laid to rest.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ArchivalIndex() {
  const stories = [
    { title: "The First Lady's Midnight Confession", meta: "Fiction · 2024" },
    { title: "A Memory of Dust and Gold", meta: "Fiction · 2023" },
    { title: "Whispers from the Delta", meta: "Essay · 2022" },
  ];
  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 pb-16 md:pb-20">
        <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-6 md:mb-8">
          Archival Index &middot; More Stories
        </p>
        <div className="divide-y divide-dark-green/10 border-t border-dark-green/10">
          {stories.map((s) => (
            <Link
              href="#"
              key={s.title}
              className="flex items-center justify-between gap-6 py-5 md:py-6 group"
            >
              <h3 className="font-serif text-lg md:text-xl text-dark-green group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <div className="flex items-center gap-4 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 hidden sm:block">
                  {s.meta}
                </p>
                <span className="text-dark-green group-hover:text-gold transition-colors">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EmiliaStoryPage() {
  return (
    <>
      <Navbar />
      <BackRail />
      <StoryHead />
      <StoryBody />
      <FilmAdaptation />
      <AuthorQuote />
      <ArchivalIndex />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
