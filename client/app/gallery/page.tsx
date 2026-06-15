import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { GalleryItemApi, galleryApi } from "../lib/api";
import { FALLBACK_GALLERY } from "../lib/fallback";
import { absoluteUrl, jsonLdScript, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Gallery — Obinna Udenwe" },
  description:
    "Photographs from the life and literary work of Obinna Udenwe — readings, ceremonies, and atmospheric portraits.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    title: "Gallery — Obinna Udenwe",
    description:
      "Photographs from the life and literary work of Nigerian novelist Obinna Udenwe.",
    url: "/gallery",
    images: ["/Obinna Udenwe Portrait.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Obinna Udenwe",
    description:
      "Photographs from the life and literary work of Nigerian novelist Obinna Udenwe.",
    images: ["/Obinna Udenwe Portrait.png"],
  },
};

async function loadGallery(): Promise<GalleryItemApi[]> {
  try {
    const all = await galleryApi.list();
    return all.length > 0 ? all : FALLBACK_GALLERY;
  } catch {
    return FALLBACK_GALLERY;
  }
}

export default async function GalleryPage() {
  const items = await loadGallery();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Gallery — Obinna Udenwe",
    url: `${SITE_URL}/gallery`,
    image: items.map((photo) => ({
      "@type": "ImageObject",
      name: photo.title,
      contentUrl: absoluteUrl(photo.image),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionSchema) }}
      />
      <Navbar />
      <main className="bg-cream">
        <section className="px-6 md:px-8 lg:px-16 py-14 md:py-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Where the Story Began
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight mb-4">
              Gallery
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mb-10 md:mb-12">
              A visual companion to the work — moments from readings,
              ceremonies, and the everyday landscapes that shape the writing.
              Click any photograph to view it full size.
            </p>

            <GalleryLightbox items={items} />
          </div>
        </section>
      </main>
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
