import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Blog, blogsApi } from "../lib/api";
import { FALLBACK_BLOGS } from "../lib/fallback";
import { NewsClient } from "./NewsClient";

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
  return (
    <>
      <Navbar />
      <NewsClient blogs={blogs} />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
