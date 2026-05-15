import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Story, storiesApi } from "../lib/api";
import { StoriesClient } from "./StoriesClient";

async function loadStories(): Promise<Story[]> {
  try {
    const all = await storiesApi.list();
    return all.filter((s) => s.status === "published");
  } catch {
    return [];
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
