import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";
import { Blog, blogsApi } from "../lib/api";
import { NewsClient } from "./NewsClient";

async function loadBlogs(): Promise<Blog[]> {
  try {
    const all = await blogsApi.list();
    return all.filter((b) => b.status === "published");
  } catch {
    return [];
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
