import type { MetadataRoute } from "next";
import { blogsApi, booksApi, slugify, storiesApi } from "./lib/api";
import { FALLBACK_BLOGS, FALLBACK_BOOKS, FALLBACK_STORIES } from "./lib/fallback";
import { SITE_URL } from "./lib/seo";

async function safeList<T>(fetcher: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const all = await fetcher();
    return all.length > 0 ? all : fallback;
  } catch {
    return fallback;
  }
}

function toDate(value: string | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, blogs, stories] = await Promise.all([
    safeList(() => booksApi.list(), FALLBACK_BOOKS),
    safeList(() => blogsApi.list(), FALLBACK_BLOGS),
    safeList(() => storiesApi.list(), FALLBACK_STORIES),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/books`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stories`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const bookRoutes: MetadataRoute.Sitemap = books
    .filter((b) => b.status === "published")
    .map((b) => ({
      url: `${SITE_URL}/books/${slugify(b.title)}`,
      lastModified: toDate(b.updated_at || b.created_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => b.status === "published")
    .map((b) => ({
      url: `${SITE_URL}/news/${slugify(b.title)}`,
      lastModified: toDate(b.updated_at || b.created_at || b.published_on),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const storyRoutes: MetadataRoute.Sitemap = stories
    .filter((s) => s.status === "published")
    .map((s) => ({
      url: `${SITE_URL}/stories/${slugify(s.title)}`,
      lastModified: toDate(s.updated_at || s.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...bookRoutes, ...blogRoutes, ...storyRoutes];
}
