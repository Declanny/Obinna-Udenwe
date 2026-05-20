import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { QuoteAndNewsletter } from "../../components/QuoteAndNewsletter";
import { Blog, blogsApi, slugify } from "../../lib/api";
import { FALLBACK_BLOGS } from "../../lib/fallback";

async function loadBlogs(): Promise<Blog[]> {
  try {
    const all = await blogsApi.list();
    const published = all.filter((b) => b.status === "published");
    return published.length > 0 ? published : FALLBACK_BLOGS;
  } catch {
    return FALLBACK_BLOGS;
  }
}

export async function generateStaticParams() {
  const blogs = await loadBlogs();
  return blogs.map((b) => ({ slug: slugify(b.title) }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogs = await loadBlogs();
  const blog = blogs.find((b) => slugify(b.title) === slug);
  if (!blog) notFound();

  const categoryLabel = blog.category === "news" ? "News" : "Blog";

  return (
    <>
      <Navbar />
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pt-12 md:pt-16 pb-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-8"
          >
            <Link href="/" className="hover:text-dark-green transition-colors">
              Home
            </Link>
            <span>&rsaquo;</span>
            <Link href="/news" className="hover:text-dark-green transition-colors">
              News &amp; Blog
            </Link>
            <span>&rsaquo;</span>
            <span className="text-dark-green">{blog.title}</span>
          </nav>

          <p className="text-gold text-[11px] font-semibold uppercase tracking-widest mb-4">
            {categoryLabel}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green leading-tight">
            {blog.title}
          </h1>

          <div className="mt-8 pt-5 border-t border-dark-green/10 flex items-center gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                Author
              </p>
              <p className="font-semibold text-dark-green">Obinna Udenwe</p>
            </div>
            {blog.published_on ? (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                  Published
                </p>
                <p className="font-semibold text-dark-green">{blog.published_on}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {blog.cover ? (
        <section className="bg-cream">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pb-10">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm">
              <Image
                src={blog.cover}
                alt={blog.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pb-12 md:pb-16">
          {blog.body ? (
            <div className="max-w-5xl text-base md:text-[17px] leading-8 text-foreground/85 space-y-5 whitespace-pre-line">
              {blog.body}
            </div>
          ) : blog.excerpt ? (
            <p className="max-w-5xl text-base md:text-[17px] leading-8 text-foreground/85">
              {blog.excerpt}
            </p>
          ) : null}

          <div className="mt-12 bg-[#F0EADD] border border-dark-green/10 p-5 md:p-7 max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-sm bg-dark-green/10">
                <Image src="/obinna.jpg" alt="Obinna Udenwe" fill className="object-cover" />
              </div>
              <div className="space-y-2.5">
                <h2 className="font-serif text-2xl font-semibold text-dark-green">Obinna Udenwe</h2>
                <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
                  Obinna Udenwe is an award-winning Nigerian novelist and short story
                  writer. He is the author of <em>Satans &amp; Shaitans</em>,{" "}
                  <em>Colours of Hatred</em>, and <em>Years of Shame</em>.
                </p>
                <Link
                  href="/about"
                  className="inline-block text-xs font-semibold uppercase tracking-widest text-dark-green hover:text-gold transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
