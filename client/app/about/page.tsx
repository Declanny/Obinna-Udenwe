import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";

function AboutHero() {
  return (
    <section className="bg-[#1B1B1B] text-white">
      <div className="px-8 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 space-y-4">
          <p className="font-sans text-lg text-[#FFCA64]">
            Novelist. Story-teller. Civil engineer.
          </p>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight">
            Obinna Udenwe
          </h1>
          <p className="text-base text-white/80 max-w-md leading-relaxed">
            Award-winning Nigerian author of power, faith, and consequence. He
            is a co-founder of The Village Square Journal &mdash; a magazine of
            contemporary literature and politics.
          </p>
        </div>
        <div className="shrink-0">
          <div className="relative w-[380px] h-[460px] rounded-sm overflow-hidden">
            <Image
              src="/aboutpageimages/91084808d77bf681ec8af12c4180ad9f45acbddf.jpg"
              alt="Obinna Udenwe portrait"
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

function BioSection() {
  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-[57px]">
          <div className="flex-1 max-w-[921px]">
            <h2 className="font-serif text-5xl lg:text-6xl font-bold text-dark-green mb-10">
              Bio
            </h2>
            <p className="font-sans font-normal text-[18px] leading-[39px] text-foreground/80">
              Obinna Udenwe&rsquo;s works address themes of power and
              manipulation, love, politics, mysticism and religion. He is the
              winner of the first edition of The Chinua Achebe Prize for
              Literature in 2021 for his second book, Colours of Hatred which
              was also a finalist for the NLNG Nigeria Prize for Literature.
              His first book, Satans &amp; Shaitans, set against the backdrop of
              Nigeria&rsquo;s terrorism tension won the ANA Prize for Prose
              Fiction in 2015. His short stories have won a Prairie
              Schooner&mdash;Glenna Luschei Prize of the University of Nebraska,
              Lincoln in 2020 and The Short Story is Dead Prize in 2016. His
              collection of stories, Men Are Fools was a finalist in the
              Prairie Schooner-Raz Shumaker Book Prize. It is now published in
              Nigeria as The Widow Who Died With Flowers in Her Mouth. His
              story, It Has to do with Emilia, was made into a film in 2022 by
              Bump films, South Africa and produced by Bridget Pickering,
              co-producer of the film, Hotel Rwanda.
            </p>
          </div>
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[10px] overflow-hidden shrink-0">
            <Image
              src="/aboutpageimages/IMG_0401.JPG 1.png"
              alt="Obinna Udenwe"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorksSection() {
  const portraits = [
    "/aboutpageimages/0d4db9a65324072ecbb440bb7064c47e21f392e7.jpg",
    "/aboutpageimages/7e9cc46bfa2d88c960508705a5207e8009069dfe.jpg",
    "/aboutpageimages/beea2c53b9337b5240ad938259a9d134014fda82 (1).jpg",
  ];

  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pt-0 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-[57px] mb-20">
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-[10px] overflow-hidden shrink-0 lg:-mt-12">
            <Image
              src="/aboutpageimages/beea2c53b9337b5240ad938259a9d134014fda82.jpg"
              alt="Obinna Udenwe reading"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 max-w-[921px] font-sans font-normal text-[18px] leading-[39px] text-foreground/80">
            <p>
              Obinna Udenwe&rsquo;s fifth book is Years of Shame, a poignant
              tale of an Abakaliki man, who strives to escape both the brutal
              domineering influence of his revered Arochukwu boss and the
              debilitating powers of his community&rsquo;s dreaded
              oath-of-loss-of-wealth-and-children which he&rsquo;s taken to
              prove himself a man, the two working to destroy not just his life
              but those of his children and grandson. Years of Shame was
              published in 2025, with over a thousand copies sold on the launch
              day alone, its themes sparking off commentaries and debates. In
              2020, 845 Press Canada published his chapbook, The Brief Story of
              the New Love Software. His Holy Sex series, now a novella
              available only as e-book on Amazon, remains the most widely read
              stories on Brittle Paper since 2014. His works have appeared in
              Gutter Magazine, Lolwe Magazine, Prairie Schooner, Munyori
              Literary Journal, Afreada, The Temz Review, KTravula, Yimu
              Central, The Kalahari Review, Expound Magazine, ANA Reviews, Ake
              Review, Tribe-write, Outside In Magazine, Brittle Paper, and The
              Shallow Tales Review etc. In 2015, Obinna partnered with Nora
              Vasconselos to produce twenty stories for the Crossover
              Mexico&ndash;Nigeria project which they both initiated. He founded
              and co-edited the Ebedi Review between 2014 &ndash; 2023 and
              co-edited the anthology Voices From My Clan with Mukoma wa Ngugi.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portraits.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-sm overflow-hidden"
            >
              <Image
                src={src}
                alt={`Obinna Udenwe portrait ${i + 1}`}
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

function HonorsSection() {
  const honors = [
    { year: "2023", title: "The NLNG Prize for Literature (Shortlist)" },
    { year: "2018", title: "ANA Prose Prize (Winner)" },
    { year: "2016", title: "The African Writers' Prize (Winner)" },
    { year: "2014", title: "Shortlisted for the Caine Prize for African Writing" },
  ];

  return (
    <section className="bg-cream">
      <div className="px-8 lg:px-16 pt-0 pb-20">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-green">
              Honors &amp;<br />Distinctions
            </h2>
          </div>
          <div className="lg:w-2/3 space-y-6">
            {honors.map((h, i) => (
              <div
                key={i}
                className="border-t border-dark-green/20 pt-5 pl-5"
                style={{ borderLeft: "1px solid #0c281933" }}
              >
                <p className="text-xs text-foreground/60 mb-2">{h.year}</p>
                <p className="font-serif text-xl text-dark-green">{h.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-[#1B1B1B] text-white px-8 lg:px-16 py-20">
        <h3 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
          For Press &amp; Media
        </h3>
        <p className="text-sm text-white/70 mb-8 max-w-sm leading-relaxed">
          Requests for interviews, speaking engagements, and official
          photography can be directed here.
        </p>
        <Link
          href="/#contact"
          className="inline-block bg-white text-dark-green text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-white/90 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
      <div className="bg-cream text-dark-green px-8 lg:px-16 py-20">
        <h3 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
          Read the Work
        </h3>
        <p className="text-sm text-foreground/70 mb-8 max-w-sm leading-relaxed">
          Explore the full bibliography including novels, short story
          collections, and anthologies.
        </p>
        <Link
          href="/#books"
          className="inline-block bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-dark-green/90 transition-colors"
        >
          View Books
        </Link>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <BioSection />
      <WorksSection />
      <HonorsSection />
      <CTASection />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
