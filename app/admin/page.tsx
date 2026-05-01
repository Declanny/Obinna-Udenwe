"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

type AdminTab =
  | "overview"
  | "site"
  | "books"
  | "blogs"
  | "stories"
  | "gallery"
  | "media";

type ItemStatus = "Draft" | "Published";

type BookItem = {
  id: string;
  title: string;
  year: number;
  image: string;
  tagline: string;
  description: string;
  status: ItemStatus;
};

type BlogItem = {
  id: string;
  title: string;
  category: "Blog" | "News";
  publishedOn: string;
  excerpt: string;
  body: string;
  cover: string;
  status: ItemStatus;
};

type StoryItem = {
  id: string;
  title: string;
  readTime: string;
  excerpt: string;
  body: string;
  cover: string;
  status: ItemStatus;
};

type GalleryItem = {
  id: string;
  title: string;
  image: string;
};

type MediaAsset = {
  id: string;
  fileName: string;
  path: string;
  type: "Image";
};

type SiteContent = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroImage: string;
  awards: string[];
  featuredKicker: string;
  featuredTitle: string;
  featuredTagline: string;
  featuredDescription: string;
  featuredImage: string;
  newsletterHeadline: string;
  newsletterBody: string;
  contactEmail: string;
};

const ADMIN_AUTH_KEY = "obinna_admin_auth";
const STORE_KEY = "obinna_admin_store_v1";

const initialBooks: BookItem[] = [
  {
    id: "b1",
    title: "Years of Shame",
    year: 2025,
    image: "/book1.png",
    tagline: "A sweeping saga of legacy and redemption in the heart of the savannah.",
    description:
      "In his most ambitious work to date, Udenwe weaves a tapestry of political intrigue and personal sacrifice that redefines the modern West African epic.",
    status: "Published",
  },
  {
    id: "b2",
    title: "Satans & Shaitans",
    year: 2014,
    image: "/books/Frame 15 (1).png",
    tagline: "A thriller set against Nigeria's terrorism tension.",
    description:
      "A powerful saga of love and betrayal set against the backdrop of political unrest.",
    status: "Published",
  },
  {
    id: "b3",
    title: "Colours of Hatred",
    year: 2018,
    image: "/books/Group 5 (1).png",
    tagline: "A gripping tale of love, loss, and the price of ambition.",
    description:
      "Winner of the inaugural Chinua Achebe Prize for Literature; finalist, NLNG Nigeria Prize.",
    status: "Published",
  },
];

const initialBlogs: BlogItem[] = [
  {
    id: "n1",
    title: "Why I Set Years of Shame in Abakaliki",
    category: "Blog",
    publishedOn: "October 24, 2024",
    excerpt:
      "On the geography of memory, the weight of place, and why this story could not have been written elsewhere.",
    body:
      "Abakaliki holds the cadence of a people whose history I have spent a decade trying to listen to closely. This essay walks through the streets, the rituals, and the silences that became Years of Shame.",
    cover: "/books/IMG_3219 1.png",
    status: "Published",
  },
  {
    id: "n2",
    title: "The Satirist's Burden: A New Chapter in Nigerian Political Fiction",
    category: "News",
    publishedOn: "October 12, 2024",
    excerpt:
      "Reflections on craft, politics, and the writers who came before.",
    body:
      "What does it mean to write satire in a country whose news already reads like fiction? A short manifesto on the satirist's burden today.",
    cover: "/books/IMG_0552 1.png",
    status: "Draft",
  },
];

const initialStories: StoryItem[] = [
  {
    id: "s1",
    title: "It Has to Do with Emilia",
    readTime: "8 min",
    excerpt: "A short story of memory, rivalry, and a marriage held together by what is left unsaid.",
    body:
      "Emilia did not ask why I came back. That, in itself, was the answer she had been preparing for years.",
    cover: "/books/IMG_0294 1.png",
    status: "Published",
  },
  {
    id: "s2",
    title: "The First Lady's Midnight Confession",
    readTime: "6 min",
    excerpt: "Power, prayer, and the long corridors of Aso Rock at 2 a.m.",
    body:
      "The chapel was empty except for the cleaner, who pretended not to see her, and the saint on the wall, who could not.",
    cover: "/books/IMG_0552 1.png",
    status: "Draft",
  },
];

const initialGallery: GalleryItem[] = [
  { id: "g1", title: "Literary Event 01", image: "/books/IMG_0552 1.png" },
  { id: "g2", title: "Writers Circle", image: "/books/IMG_0294 1.png" },
  { id: "g3", title: "Book Reading", image: "/books/IMG_3219 1.png" },
];

const initialMedia: MediaAsset[] = [
  { id: "m1", fileName: "book1.png", path: "/book1.png", type: "Image" },
  { id: "m2", fileName: "obinna.jpg", path: "/obinna.jpg", type: "Image" },
  { id: "m3", fileName: "Cinematic frame.png", path: "/Cinematic frame.png", type: "Image" },
];

const initialSite: SiteContent = {
  heroKicker: "Novelist. Story-teller. Civil engineer.",
  heroTitle: "Obinna Udenwe",
  heroSubtitle: "Award-winning Nigerian author of power, faith, and consequence.",
  heroCtaLabel: "Explore Bibliography",
  heroImage: "/obinna.jpg",
  awards: [
    "Chinua Achebe Prize 2021",
    "ANA Prize 2019",
    "Prairie Schooner Prize 2020",
    "NLNG Finalist",
  ],
  featuredKicker: "New Release 2025",
  featuredTitle: "Years of Shame",
  featuredTagline:
    "A sweeping saga of legacy and redemption in the heart of the savannah.",
  featuredDescription:
    "In his most ambitious work to date, Udenwe weaves a tapestry of political intrigue and personal sacrifice that redefines the modern West African epic.",
  featuredImage: "/book1.png",
  newsletterHeadline: "Stay in the story.",
  newsletterBody:
    "Receive launch news, essays, and event invitations directly from the author.",
  contactEmail: "hello@obinnaudenwe.com",
};

type AdminStore = {
  books: BookItem[];
  blogs: BlogItem[];
  stories: StoryItem[];
  gallery: GalleryItem[];
  media: MediaAsset[];
  site: SiteContent;
};

const defaultStore: AdminStore = {
  books: initialBooks,
  blogs: initialBlogs,
  stories: initialStories,
  gallery: initialGallery,
  media: initialMedia,
  site: initialSite,
};

function loadStore(): AdminStore {
  if (typeof window === "undefined") return defaultStore;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore;
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    return {
      books: parsed.books ?? defaultStore.books,
      blogs: parsed.blogs ?? defaultStore.blogs,
      stories: parsed.stories ?? defaultStore.stories,
      gallery: parsed.gallery ?? defaultStore.gallery,
      media: parsed.media ?? defaultStore.media,
      site: { ...defaultStore.site, ...(parsed.site ?? {}) },
    };
  } catch {
    return defaultStore;
  }
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h2 className="font-serif text-3xl md:text-4xl text-dark-green font-bold">{title}</h2>
        <p className="text-sm text-foreground/70 mt-2">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-dark-green/10 bg-white p-5">
      <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">{label}</p>
      <p className="font-serif text-3xl text-dark-green">{value}</p>
    </div>
  );
}

function TabButton({
  id,
  current,
  onClick,
  label,
}: {
  id: AdminTab;
  current: AdminTab;
  onClick: (tab: AdminTab) => void;
  label: string;
}) {
  const active = current === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`px-3 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors ${
        active
          ? "bg-dark-green text-white"
          : "bg-dark-green/5 text-dark-green hover:bg-dark-green/10"
      }`}
    >
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-sm ${
        status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-dark-green text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-sm hover:bg-dark-green/90 transition-colors"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  tone = "default",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "default" | "danger";
  type?: "button" | "submit";
}) {
  const cls =
    tone === "danger"
      ? "border border-rose-300 text-rose-700 hover:bg-rose-50"
      : "border border-dark-green/30 text-dark-green hover:bg-dark-green/5";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-sm transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-dark-green/20 px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-dark-green";

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-2xl max-h-full overflow-y-auto rounded-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-green/10">
          <h3 className="font-serif text-2xl text-dark-green">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-dark-green/60 hover:text-dark-green"
          >
            Close
          </button>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}

function ImagePicker({
  label,
  value,
  onChange,
  media,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  media: MediaAsset[];
  onUpload: (asset: MediaAsset) => void;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const path = String(reader.result || "");
      const asset: MediaAsset = {
        id: crypto.randomUUID(),
        fileName: file.name,
        path,
        type: "Image",
      };
      onUpload(asset);
      onChange(path);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div>
      <Field label={label}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/path/to/image.png"
          className={inputCls}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {value ? (
          <div className="relative w-16 h-16 border border-dark-green/15 rounded-sm overflow-hidden bg-dark-green/5">
            <Image src={value} alt="preview" fill className="object-cover" unoptimized />
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="text-[11px] uppercase tracking-widest font-semibold text-dark-green border border-dark-green/30 px-3 py-2 rounded-sm hover:bg-dark-green/5"
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen((p) => !p)}
          className="text-[11px] uppercase tracking-widest font-semibold text-dark-green border border-dark-green/30 px-3 py-2 rounded-sm hover:bg-dark-green/5"
        >
          Pick from library
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {pickerOpen ? (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 border border-dark-green/10 rounded-sm bg-dark-green/5 max-h-60 overflow-y-auto">
          {media.length === 0 ? (
            <p className="col-span-full text-xs text-foreground/60">
              No media uploaded yet.
            </p>
          ) : (
            media.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onChange(asset.path);
                  setPickerOpen(false);
                }}
                className={`relative aspect-square rounded-sm overflow-hidden border ${
                  asset.path === value ? "border-gold" : "border-dark-green/10"
                }`}
                title={asset.fileName}
              >
                <Image src={asset.path} alt={asset.fileName} fill className="object-cover" unoptimized />
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [hydrated, setHydrated] = useState(false);

  const [books, setBooks] = useState<BookItem[]>(defaultStore.books);
  const [blogs, setBlogs] = useState<BlogItem[]>(defaultStore.blogs);
  const [stories, setStories] = useState<StoryItem[]>(defaultStore.stories);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultStore.gallery);
  const [media, setMedia] = useState<MediaAsset[]>(defaultStore.media);
  const [site, setSite] = useState<SiteContent>(defaultStore.site);

  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [creating, setCreating] = useState<null | "book" | "blog" | "story" | "gallery">(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAuthed = window.localStorage.getItem(ADMIN_AUTH_KEY) === "1";
    if (!isAuthed) {
      router.replace("/admin/login");
      return;
    }
    const store = loadStore();
    // Hydrating React state from localStorage on mount — legitimate
    // external-system sync that this rule's docs explicitly carve out.
    /* eslint-disable react-hooks/set-state-in-effect */
    setAuthChecked(true);
    setBooks(store.books);
    setBlogs(store.blogs);
    setStories(store.stories);
    setGallery(store.gallery);
    setMedia(store.media);
    setSite(store.site);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    const payload: AdminStore = { books, blogs, stories, gallery, media, site };
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota errors – uploaded images may exceed limit
    }
  }, [hydrated, books, blogs, stories, gallery, media, site]);

  const metrics = useMemo(
    () => [
      { label: "Books", value: String(books.length) },
      { label: "Blog & News", value: String(blogs.length) },
      { label: "Stories", value: String(stories.length) },
      { label: "Gallery", value: String(gallery.length) },
      { label: "Media Assets", value: String(media.length) },
    ],
    [books.length, blogs.length, stories.length, gallery.length, media.length]
  );

  function addMedia(asset: MediaAsset) {
    setMedia((prev) => [asset, ...prev]);
  }

  function resetAll() {
    if (!confirm("Reset all admin data to defaults? This cannot be undone.")) return;
    setBooks(defaultStore.books);
    setBlogs(defaultStore.blogs);
    setStories(defaultStore.stories);
    setGallery(defaultStore.gallery);
    setMedia(defaultStore.media);
    setSite(defaultStore.site);
  }

  if (!authChecked) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <section className="px-6 md:px-8 lg:px-16 pt-10 md:pt-14 pb-8 border-b border-dark-green/10">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
            Content Management
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark-green font-bold">
            Admin Dashboard
          </h1>
          <p className="text-foreground/70 max-w-2xl mt-4">
            Manage every section of the website: homepage text, books, stories, blog & news,
            gallery, and uploaded media. All changes save automatically.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem(ADMIN_AUTH_KEY);
                router.push("/admin/login");
              }}
              className="text-xs uppercase tracking-widest font-semibold text-dark-green/70 hover:text-gold transition-colors"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs uppercase tracking-widest font-semibold text-rose-700/80 hover:text-rose-700 transition-colors"
            >
              Reset to defaults
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-7">
            <TabButton id="overview" current={tab} onClick={setTab} label="Overview" />
            <TabButton id="site" current={tab} onClick={setTab} label="Site Content" />
            <TabButton id="books" current={tab} onClick={setTab} label="Books" />
            <TabButton id="blogs" current={tab} onClick={setTab} label="Blogs & News" />
            <TabButton id="stories" current={tab} onClick={setTab} label="Stories" />
            <TabButton id="gallery" current={tab} onClick={setTab} label="Gallery" />
            <TabButton id="media" current={tab} onClick={setTab} label="Media Library" />
          </div>
        </section>

        <section className="px-6 md:px-8 lg:px-16 py-10 md:py-12">
          {tab === "overview" && (
            <div className="space-y-8">
              <SectionHeader
                title="Site At A Glance"
                subtitle="Quick stats and shortcuts across all content types."
              />
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} label={metric.label} value={metric.value} />
                ))}
              </div>
              <div className="rounded-sm border border-dark-green/10 bg-white p-6">
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-3">
                  Quick Actions
                </p>
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => { setTab("books"); setCreating("book"); }}>
                    New Book
                  </PrimaryButton>
                  <PrimaryButton onClick={() => { setTab("blogs"); setCreating("blog"); }}>
                    New Blog / News Post
                  </PrimaryButton>
                  <PrimaryButton onClick={() => { setTab("stories"); setCreating("story"); }}>
                    New Story
                  </PrimaryButton>
                  <GhostButton onClick={() => { setTab("gallery"); setCreating("gallery"); }}>
                    Add Gallery Photo
                  </GhostButton>
                  <GhostButton onClick={() => setTab("media")}>Open Media Library</GhostButton>
                </div>
              </div>
            </div>
          )}

          {tab === "site" && (
            <SiteContentEditor
              site={site}
              onChange={setSite}
              media={media}
              onUploadMedia={addMedia}
            />
          )}

          {tab === "books" && (
            <div className="space-y-6">
              <SectionHeader
                title="Books Manager"
                subtitle="Edit, delete, or publish books shown on the bibliography."
                action={<PrimaryButton onClick={() => setCreating("book")}>Add Book</PrimaryButton>}
              />
              <div className="rounded-sm border border-dark-green/10 bg-white overflow-x-auto">
                <table className="w-full text-left min-w-[640px]">
                  <thead className="bg-dark-green/5 text-[10px] uppercase tracking-widest text-foreground/60">
                    <tr>
                      <th className="px-4 py-3">Book</th>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-t border-dark-green/10">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-12 rounded-[2px] overflow-hidden bg-dark-green/5">
                              <Image src={book.image} alt={book.title} fill className="object-cover" unoptimized />
                            </div>
                            <div>
                              <p className="font-semibold text-dark-green">{book.title}</p>
                              <p className="text-xs text-foreground/60 line-clamp-1 max-w-md">
                                {book.tagline}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground/70">{book.year}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={book.status} />
                        </td>
                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setBooks((prev) =>
                                prev.map((item) =>
                                  item.id === book.id
                                    ? { ...item, status: item.status === "Published" ? "Draft" : "Published" }
                                    : item
                                )
                              )
                            }
                            className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                          >
                            {book.status === "Published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm(`Delete "${book.title}"?`)) return;
                              setBooks((prev) => prev.filter((b) => b.id !== book.id));
                            }}
                            className="text-xs uppercase tracking-widest font-semibold text-rose-700 hover:text-rose-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {books.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-foreground/60">
                          No books yet. Click “Add Book”.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "blogs" && (
            <div className="space-y-6">
              <SectionHeader
                title="Blog & News Manager"
                subtitle="Create, edit, schedule, and publish posts shown across the site."
                action={<PrimaryButton onClick={() => setCreating("blog")}>New Post</PrimaryButton>}
              />
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white border border-dark-green/10 rounded-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="relative w-full md:w-32 h-32 md:h-24 bg-dark-green/5 rounded-sm overflow-hidden shrink-0">
                      {blog.cover ? (
                        <Image src={blog.cover} alt={blog.title} fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gold mb-1">
                        {blog.category} · {blog.publishedOn}
                      </p>
                      <h3 className="font-serif text-xl text-dark-green">{blog.title}</h3>
                      <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{blog.excerpt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <StatusPill status={blog.status} />
                      <button
                        type="button"
                        onClick={() =>
                          setBlogs((prev) =>
                            prev.map((item) =>
                              item.id === blog.id
                                ? { ...item, status: item.status === "Published" ? "Draft" : "Published" }
                                : item
                            )
                          )
                        }
                        className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                      >
                        {blog.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBlog(blog)}
                        className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm(`Delete "${blog.title}"?`)) return;
                          setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
                        }}
                        className="text-xs uppercase tracking-widest font-semibold text-rose-700 hover:text-rose-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 ? (
                  <p className="text-sm text-foreground/60">No posts yet.</p>
                ) : null}
              </div>
            </div>
          )}

          {tab === "stories" && (
            <div className="space-y-6">
              <SectionHeader
                title="Stories Manager"
                subtitle="Manage short fiction shown on the Stories page."
                action={<PrimaryButton onClick={() => setCreating("story")}>New Story</PrimaryButton>}
              />
              <div className="grid gap-4">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-dark-green/10 rounded-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="relative w-full md:w-32 h-32 md:h-24 bg-dark-green/5 rounded-sm overflow-hidden shrink-0">
                      {story.cover ? (
                        <Image src={story.cover} alt={story.title} fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                        Short Fiction · {story.readTime} read
                      </p>
                      <h3 className="font-serif text-xl text-dark-green">{story.title}</h3>
                      <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{story.excerpt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <StatusPill status={story.status} />
                      <button
                        type="button"
                        onClick={() =>
                          setStories((prev) =>
                            prev.map((item) =>
                              item.id === story.id
                                ? { ...item, status: item.status === "Published" ? "Draft" : "Published" }
                                : item
                            )
                          )
                        }
                        className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                      >
                        {story.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingStory(story)}
                        className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm(`Delete "${story.title}"?`)) return;
                          setStories((prev) => prev.filter((s) => s.id !== story.id));
                        }}
                        className="text-xs uppercase tracking-widest font-semibold text-rose-700 hover:text-rose-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {stories.length === 0 ? (
                  <p className="text-sm text-foreground/60">No stories yet.</p>
                ) : null}
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div className="space-y-6">
              <SectionHeader
                title="Gallery Manager"
                subtitle="Curate the photo grid on the homepage and gallery section."
                action={<PrimaryButton onClick={() => setCreating("gallery")}>Add Photo</PrimaryButton>}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white border border-dark-green/10 rounded-sm overflow-hidden">
                    <div className="relative aspect-4/3 bg-dark-green/5">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-semibold text-dark-green truncate">{item.title}</p>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingGallery(item)}
                          className="text-[10px] uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm(`Remove "${item.title}"?`)) return;
                            setGallery((prev) => prev.filter((g) => g.id !== item.id));
                          }}
                          className="text-[10px] uppercase tracking-widest font-semibold text-rose-700 hover:text-rose-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 ? (
                  <p className="col-span-full text-sm text-foreground/60">No gallery photos yet.</p>
                ) : null}
              </div>
            </div>
          )}

          {tab === "media" && (
            <MediaLibrary media={media} setMedia={setMedia} />
          )}
        </section>
      </main>
      <Footer />

      <Modal
        open={creating === "book" || editingBook !== null}
        title={editingBook ? "Edit Book" : "Add Book"}
        onClose={() => {
          setCreating(null);
          setEditingBook(null);
        }}
      >
        <BookForm
          initial={editingBook}
          media={media}
          onUploadMedia={addMedia}
          onCancel={() => {
            setCreating(null);
            setEditingBook(null);
          }}
          onSubmit={(data) => {
            if (editingBook) {
              setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? { ...editingBook, ...data } : b)));
            } else {
              setBooks((prev) => [{ id: crypto.randomUUID(), ...data }, ...prev]);
            }
            setCreating(null);
            setEditingBook(null);
          }}
        />
      </Modal>

      <Modal
        open={creating === "blog" || editingBlog !== null}
        title={editingBlog ? "Edit Post" : "New Post"}
        onClose={() => {
          setCreating(null);
          setEditingBlog(null);
        }}
      >
        <BlogForm
          initial={editingBlog}
          media={media}
          onUploadMedia={addMedia}
          onCancel={() => {
            setCreating(null);
            setEditingBlog(null);
          }}
          onSubmit={(data) => {
            if (editingBlog) {
              setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? { ...editingBlog, ...data } : b)));
            } else {
              setBlogs((prev) => [{ id: crypto.randomUUID(), ...data }, ...prev]);
            }
            setCreating(null);
            setEditingBlog(null);
          }}
        />
      </Modal>

      <Modal
        open={creating === "story" || editingStory !== null}
        title={editingStory ? "Edit Story" : "New Story"}
        onClose={() => {
          setCreating(null);
          setEditingStory(null);
        }}
      >
        <StoryForm
          initial={editingStory}
          media={media}
          onUploadMedia={addMedia}
          onCancel={() => {
            setCreating(null);
            setEditingStory(null);
          }}
          onSubmit={(data) => {
            if (editingStory) {
              setStories((prev) => prev.map((s) => (s.id === editingStory.id ? { ...editingStory, ...data } : s)));
            } else {
              setStories((prev) => [{ id: crypto.randomUUID(), ...data }, ...prev]);
            }
            setCreating(null);
            setEditingStory(null);
          }}
        />
      </Modal>

      <Modal
        open={creating === "gallery" || editingGallery !== null}
        title={editingGallery ? "Edit Photo" : "Add Photo"}
        onClose={() => {
          setCreating(null);
          setEditingGallery(null);
        }}
      >
        <GalleryForm
          initial={editingGallery}
          media={media}
          onUploadMedia={addMedia}
          onCancel={() => {
            setCreating(null);
            setEditingGallery(null);
          }}
          onSubmit={(data) => {
            if (editingGallery) {
              setGallery((prev) =>
                prev.map((g) => (g.id === editingGallery.id ? { ...editingGallery, ...data } : g))
              );
            } else {
              setGallery((prev) => [{ id: crypto.randomUUID(), ...data }, ...prev]);
            }
            setCreating(null);
            setEditingGallery(null);
          }}
        />
      </Modal>
    </>
  );
}

function SiteContentEditor({
  site,
  onChange,
  media,
  onUploadMedia,
}: {
  site: SiteContent;
  onChange: (next: SiteContent) => void;
  media: MediaAsset[];
  onUploadMedia: (asset: MediaAsset) => void;
}) {
  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    onChange({ ...site, [key]: value });
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Site Content"
        subtitle="Edit the homepage hero, featured book, awards strip, and global text."
      />
      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Hero Section</h3>
        <Field label="Kicker">
          <input value={site.heroKicker} onChange={(e) => update("heroKicker", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Title">
          <input value={site.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Subtitle">
          <textarea
            value={site.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="CTA Label">
          <input
            value={site.heroCtaLabel}
            onChange={(e) => update("heroCtaLabel", e.target.value)}
            className={inputCls}
          />
        </Field>
        <ImagePicker
          label="Hero Portrait"
          value={site.heroImage}
          onChange={(v) => update("heroImage", v)}
          media={media}
          onUpload={onUploadMedia}
        />
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Awards Strip</h3>
        <p className="text-xs text-foreground/60">
          Reorder by editing in place. Use “Add” for new awards, the trash icon to remove.
        </p>
        <div className="space-y-2">
          {site.awards.map((award, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={award}
                onChange={(e) => {
                  const next = [...site.awards];
                  next[i] = e.target.value;
                  update("awards", next);
                }}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => {
                  const next = site.awards.filter((_, idx) => idx !== i);
                  update("awards", next);
                }}
                className="text-xs uppercase tracking-widest font-semibold text-rose-700 px-3 border border-rose-200 rounded-sm hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          ))}
          <GhostButton onClick={() => update("awards", [...site.awards, "New Award"])}>Add Award</GhostButton>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Featured Book Section</h3>
        <Field label="Kicker">
          <input
            value={site.featuredKicker}
            onChange={(e) => update("featuredKicker", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Title">
          <input
            value={site.featuredTitle}
            onChange={(e) => update("featuredTitle", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Tagline">
          <textarea
            value={site.featuredTagline}
            onChange={(e) => update("featuredTagline", e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={site.featuredDescription}
            onChange={(e) => update("featuredDescription", e.target.value)}
            rows={4}
            className={inputCls}
          />
        </Field>
        <ImagePicker
          label="Cover Image"
          value={site.featuredImage}
          onChange={(v) => update("featuredImage", v)}
          media={media}
          onUpload={onUploadMedia}
        />
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Newsletter & Contact</h3>
        <Field label="Newsletter Headline">
          <input
            value={site.newsletterHeadline}
            onChange={(e) => update("newsletterHeadline", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Newsletter Body">
          <textarea
            value={site.newsletterBody}
            onChange={(e) => update("newsletterBody", e.target.value)}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Contact Email">
          <input
            type="email"
            value={site.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function BookForm({
  initial,
  media,
  onUploadMedia,
  onSubmit,
  onCancel,
}: {
  initial: BookItem | null;
  media: MediaAsset[];
  onUploadMedia: (asset: MediaAsset) => void;
  onSubmit: (data: Omit<BookItem, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [image, setImage] = useState(initial?.image ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ItemStatus>(initial?.status ?? "Draft");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !image.trim()) return;
        onSubmit({
          title: title.trim(),
          year: Number(year) || new Date().getFullYear(),
          image: image.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          status,
        });
      }}
    >
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Year">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus)}
            className={inputCls}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </Field>
      </div>
      <Field label="Tagline">
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls}
          rows={4}
        />
      </Field>
      <ImagePicker label="Cover Image" value={image} onChange={setImage} media={media} onUpload={onUploadMedia} />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit">{initial ? "Save Changes" : "Create Book"}</PrimaryButton>
      </div>
    </form>
  );
}

function BlogForm({
  initial,
  media,
  onUploadMedia,
  onSubmit,
  onCancel,
}: {
  initial: BlogItem | null;
  media: MediaAsset[];
  onUploadMedia: (asset: MediaAsset) => void;
  onSubmit: (data: Omit<BlogItem, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<BlogItem["category"]>(initial?.category ?? "Blog");
  const [publishedOn, setPublishedOn] = useState(initial?.publishedOn ?? new Date().toLocaleDateString());
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [status, setStatus] = useState<ItemStatus>(initial?.status ?? "Draft");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), category, publishedOn, excerpt, body, cover, status });
      }}
    >
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BlogItem["category"])}
            className={inputCls}
          >
            <option value="Blog">Blog</option>
            <option value="News">News</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus)}
            className={inputCls}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </Field>
      </div>
      <Field label="Published On">
        <input value={publishedOn} onChange={(e) => setPublishedOn(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Excerpt">
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputCls} rows={2} />
      </Field>
      <Field label="Body">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className={inputCls} rows={8} />
      </Field>
      <ImagePicker label="Cover Image" value={cover} onChange={setCover} media={media} onUpload={onUploadMedia} />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit">{initial ? "Save Changes" : "Create Post"}</PrimaryButton>
      </div>
    </form>
  );
}

function StoryForm({
  initial,
  media,
  onUploadMedia,
  onSubmit,
  onCancel,
}: {
  initial: StoryItem | null;
  media: MediaAsset[];
  onUploadMedia: (asset: MediaAsset) => void;
  onSubmit: (data: Omit<StoryItem, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [readTime, setReadTime] = useState(initial?.readTime ?? "5 min");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [status, setStatus] = useState<ItemStatus>(initial?.status ?? "Draft");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), readTime, excerpt, body, cover, status });
      }}
    >
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Read Time">
          <input value={readTime} onChange={(e) => setReadTime(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus)}
            className={inputCls}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </Field>
      </div>
      <Field label="Excerpt">
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputCls} rows={2} />
      </Field>
      <Field label="Body">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className={inputCls} rows={10} />
      </Field>
      <ImagePicker label="Cover Image" value={cover} onChange={setCover} media={media} onUpload={onUploadMedia} />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit">{initial ? "Save Changes" : "Create Story"}</PrimaryButton>
      </div>
    </form>
  );
}

function GalleryForm({
  initial,
  media,
  onUploadMedia,
  onSubmit,
  onCancel,
}: {
  initial: GalleryItem | null;
  media: MediaAsset[];
  onUploadMedia: (asset: MediaAsset) => void;
  onSubmit: (data: Omit<GalleryItem, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [image, setImage] = useState(initial?.image ?? "");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !image.trim()) return;
        onSubmit({ title: title.trim(), image: image.trim() });
      }}
    >
      <Field label="Caption / Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <ImagePicker label="Photo" value={image} onChange={setImage} media={media} onUpload={onUploadMedia} />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit">{initial ? "Save Changes" : "Add Photo"}</PrimaryButton>
      </div>
    </form>
  );
}

function MediaLibrary({
  media,
  setMedia,
}: {
  media: MediaAsset[];
  setMedia: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const path = String(reader.result || "");
        setMedia((prev) => [
          { id: crypto.randomUUID(), fileName: file.name, path, type: "Image" },
          ...prev,
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Media Library"
        subtitle="Upload, replace, copy paths, and remove images used across the site."
        action={
          <PrimaryButton onClick={() => fileInput.current?.click()}>Upload Image</PrimaryButton>
        }
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((asset) => (
          <div key={asset.id} className="bg-white border border-dark-green/10 rounded-sm overflow-hidden">
            <div className="relative aspect-square bg-dark-green/5">
              <Image src={asset.path} alt={asset.fileName} fill className="object-cover" unoptimized />
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-semibold text-dark-green truncate" title={asset.fileName}>
                {asset.fileName}
              </p>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(asset.path).catch(() => {});
                    }
                  }}
                  className="text-[10px] uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                >
                  Copy Path
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm(`Remove "${asset.fileName}"?`)) return;
                    setMedia((prev) => prev.filter((m) => m.id !== asset.id));
                  }}
                  className="text-[10px] uppercase tracking-widest font-semibold text-rose-700 hover:text-rose-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 ? (
          <p className="col-span-full text-sm text-foreground/60">No media uploaded yet.</p>
        ) : null}
      </div>
    </div>
  );
}
