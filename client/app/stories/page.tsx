import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Story, storiesApi } from "../lib/api";
import { FALLBACK_STORIES } from "../lib/fallback";
import { StoriesClient } from "./StoriesClient";

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
  return (
    <>
      <Navbar />
      <StoriesClient stories={stories} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
