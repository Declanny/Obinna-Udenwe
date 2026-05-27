import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Story, slugify, storiesApi } from "../lib/api";
import { FALLBACK_STORIES } from "../lib/fallback";
import { absoluteUrl, jsonLdScript, SITE_URL } from "../lib/seo";
import { StoriesClient } from "./StoriesClient";

export const metadata: Metadata = {
  title: { absolute: "Short Stories by Obinna Udenwe — Prize-winning African Fiction" },
  description:
    "Read prize-winning short stories by Obinna Udenwe, including the Prairie Schooner — Glenna Luschei Prize winner and the Short Story is Dead Prize story. Literary fiction from contemporary Nigeria.",
  alternates: { canonical: "/stories" },
  openGraph: {
    type: "website",
    title: "Short Stories by Obinna Udenwe",
    description:
      "Read prize-winning short fiction by award-winning Nigerian author Obinna Udenwe.",
    url: "/stories",
    images: ["/Cinematic frame.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Short Stories by Obinna Udenwe",
    description:
      "Read prize-winning short fiction by award-winning Nigerian author Obinna Udenwe.",
    images: ["/Cinematic frame.png"],
  },
};

async function loadStories(): Promise<Story[]> {
  try {
    const all = await storiesApi.list();
    const published = all.filter((s) => s.status === "published");
    return published.length > 0 ? published : FALLBACK_STORIES;
  } catch {
    return FALLBACK_STORIES;
  }
}

export default async function StoriesPage() {
  const stories = await loadStories();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Short Stories by Obinna Udenwe",
    url: `${SITE_URL}/stories`,
    hasPart: stories.map((story) => ({
      "@type": "ShortStory",
      name: story.title,
      url: `${SITE_URL}/stories/${slugify(story.title)}`,
      image: story.cover ? absoluteUrl(story.cover) : undefined,
      author: { "@type": "Person", name: "Obinna Udenwe" },
      description: story.excerpt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionSchema) }}
      />
      <Navbar />
      <StoriesClient stories={stories} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
