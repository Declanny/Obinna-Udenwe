import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Blog, blogsApi, slugify } from "../lib/api";
import { FALLBACK_BLOGS } from "../lib/fallback";
import { absoluteUrl, jsonLdScript, SITE_URL } from "../lib/seo";
import { NewsClient } from "./NewsClient";

export const metadata: Metadata = {
  title: { absolute: "News & Essays by Obinna Udenwe — Reflections on Nigerian Literature" },
  description:
    "Essays, dispatches, and announcements from Obinna Udenwe — reflections on Nigerian literature, craft, AI and creative writing, awards, and upcoming work.",
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    title: "News & Essays by Obinna Udenwe",
    description:
      "Essays, dispatches, and announcements from award-winning Nigerian novelist Obinna Udenwe.",
    url: "/news",
    images: ["/Obinna Udenwe Portrait.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Essays by Obinna Udenwe",
    description:
      "Essays, dispatches, and announcements from award-winning Nigerian novelist Obinna Udenwe.",
    images: ["/Obinna Udenwe Portrait.png"],
  },
};

async function loadBlogs(): Promise<Blog[]> {
  try {
    const all = await blogsApi.list();
    const published = all.filter((b) => b.status === "published");
    return published.length > 0 ? published : FALLBACK_BLOGS;
  } catch {
    return FALLBACK_BLOGS;
  }
}

export default async function NewsPage() {
  const blogs = await loadBlogs();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Obinna Udenwe — News & Essays",
    url: `${SITE_URL}/news`,
    author: { "@type": "Person", name: "Obinna Udenwe", url: SITE_URL },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      url: `${SITE_URL}/news/${slugify(blog.title)}`,
      datePublished: blog.published_on || blog.created_at || undefined,
      image: blog.cover ? absoluteUrl(blog.cover) : undefined,
      description: blog.excerpt,
      author: { "@type": "Person", name: "Obinna Udenwe" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogSchema) }}
      />
      <Navbar />
      <NewsClient blogs={blogs} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
