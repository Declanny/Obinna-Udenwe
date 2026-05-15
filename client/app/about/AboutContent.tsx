"use client";

import { useState } from "react";
import Image from "next/image";

const galleryImages = [
  {
    src: "/aboutpageimages/IMG_0401.JPG 1.png",
    alt: "Obinna Udenwe portrait",
  },
  {
    src: "/aboutpageimages/beea2c53b9337b5240ad938259a9d134014fda82.jpg",
    alt: "Obinna Udenwe reading",
  },
  {
    src: "/aboutpageimages/0d4db9a65324072ecbb440bb7064c47e21f392e7.jpg",
    alt: "Obinna Udenwe in conversation",
  },
  {
    src: "/aboutpageimages/7e9cc46bfa2d88c960508705a5207e8009069dfe.jpg",
    alt: "Obinna Udenwe at a reading",
  },
  {
    src: "/aboutpageimages/beea2c53b9337b5240ad938259a9d134014fda82 (1).jpg",
    alt: "Obinna Udenwe portrait",
  },
];

export function AboutContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="bio" className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3 text-center">
            About
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-10 md:mb-12 leading-[1.05] text-center">
            A life in letters.
          </h2>

          <div className="relative">
            <div
              className={`font-sans text-base md:text-[17px] leading-[1.85] text-foreground/85 space-y-6 overflow-hidden transition-[max-height] duration-700 ease-in-out ${
                expanded ? "max-h-[5000px]" : "max-h-[360px] md:max-h-[330px]"
              }`}
            >
              <p>
                Obinna Udenwe&rsquo;s works address themes of power and
                manipulation, love, politics, mysticism and religion. He is the
                winner of the first edition of The Chinua Achebe Prize for
                Literature in 2021 for his second book, Colours of Hatred,
                which was also a finalist for the NLNG Nigeria Prize for
                Literature. His first book, Satans &amp; Shaitans, set against
                the backdrop of Nigeria&rsquo;s terrorism tension, won the ANA
                Prize for Prose Fiction in 2015. His short stories have won a
                Prairie Schooner&mdash;Glenna Luschei Prize of the University
                of Nebraska, Lincoln in 2020 and The Short Story is Dead Prize
                in 2016. His collection of stories, Men Are Fools, was a
                finalist in the Prairie Schooner-Raz Shumaker Book Prize. It is
                now published in Nigeria as The Widow Who Died With Flowers in
                Her Mouth. His story, It Has to do with Emilia, was made into a
                film in 2022 by Bump Films, South Africa and produced by
                Bridget Pickering, co-producer of the film, Hotel Rwanda.
              </p>
              <p>
                Obinna Udenwe&rsquo;s fifth book is Years of Shame, a poignant
                tale of an Abakaliki man, who strives to escape both the brutal
                domineering influence of his revered Arochukwu boss and the
                debilitating powers of his community&rsquo;s dreaded
                oath-of-loss-of-wealth-and-children which he&rsquo;s taken to
                prove himself a man, the two working to destroy not just his
                life but those of his children and grandson. Years of Shame was
                published in 2025, with over a thousand copies sold on the
                launch day alone, its themes sparking off commentaries and
                debates. In 2020, 845 Press Canada published his chapbook, The
                Brief Story of the New Love Software. His Holy Sex series, now
                a novella available only as e-book on Amazon, remains the most
                widely read stories on Brittle Paper since 2014. His works have
                appeared in Gutter Magazine, Lolwe Magazine, Prairie Schooner,
                Munyori Literary Journal, Afreada, The Temz Review, KTravula,
                Yimu Central, The Kalahari Review, Expound Magazine, ANA
                Reviews, Ake Review, Tribe-write, Outside In Magazine, Brittle
                Paper, and The Shallow Tales Review etc. In 2015, Obinna
                partnered with Nora Vasconselos to produce twenty stories for
                the Crossover Mexico&ndash;Nigeria project which they both
                initiated. He founded and co-edited the Ebedi Review between
                2014 &ndash; 2023 and co-edited the anthology Voices From My
                Clan with Mukoma wa Ngugi.
              </p>
            </div>

            {!expanded && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream to-transparent"
              />
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dark-green border border-dark-green/30 hover:border-dark-green hover:bg-dark-green hover:text-white transition-colors px-6 py-3 rounded-sm"
              aria-expanded={expanded}
            >
              {expanded ? "Read Less" : "Read More"}
              <span aria-hidden className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                ↓
              </span>
            </button>
          </div>
        </div>

        <div className="mt-20 md:mt-24 max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              In Frame
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-dark-green">
              From readings and conversations.
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className={`relative w-full aspect-[3/4] overflow-hidden rounded-[10px] bg-dark-green/5 ${
                  i === 0 ? "md:col-span-1 lg:col-span-2 lg:row-span-2 lg:aspect-[3/4]" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
