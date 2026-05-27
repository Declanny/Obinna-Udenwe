"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Blog,
  Book,
  GalleryItemApi,
  MediaAssetApi,
  SiteContent,
  Story,
  blogsApi,
  booksApi,
  clearToken,
  confirmChangePassword,
  galleryApi,
  getToken,
  mediaApi,
  requestChangePasswordOtp,
  siteContentApi,
  storiesApi,
} from "../lib/api";

type AdminTab =
  | "overview"
  | "site"
  | "books"
  | "blogs"
  | "stories"
  | "gallery"
  | "media";

type UiStatus = "Draft" | "Published";

function toApiStatus(s: UiStatus): "draft" | "published" {
  return s === "Published" ? "published" : "draft";
}

function fromApiStatus(s: string): UiStatus {
  return s === "published" ? "Published" : "Draft";
}

// ----------------- Small UI atoms -----------------

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

function StatusPill({ status }: { status: UiStatus }) {
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
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="bg-dark-green text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-sm hover:bg-dark-green/90 transition-colors disabled:opacity-60"
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
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "default" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls =
    tone === "danger"
      ? "border border-rose-300 text-rose-700 hover:bg-rose-50"
      : "border border-dark-green/30 text-dark-green hover:bg-dark-green/5";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-sm transition-colors disabled:opacity-60 ${cls}`}
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

// `file` is the pending upload for the parent form; `url` is the currently
// persisted image URL on the entity (display-only — the backend only accepts
// new images via file upload, not URL references).
type ImagePickerValue = { url: string; file: File | null };

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ImagePickerValue;
  onChange: (next: ImagePickerValue) => void;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const localPreview = useMemo(
    () => (value.file ? URL.createObjectURL(value.file) : null),
    [value.file]
  );
  useEffect(() => {
    if (!localPreview) return;
    return () => URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onChange({ url: value.url, file });
  }

  const previewSrc = localPreview ?? (value.url || null);

  return (
    <div>
      <span className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-20 h-20 border border-dark-green/15 rounded-sm overflow-hidden bg-dark-green/5 shrink-0">
          {previewSrc ? (
            <Image src={previewSrc} alt="preview" fill className="object-cover" unoptimized />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-foreground/40">
              No image
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="text-[11px] uppercase tracking-widest font-semibold text-dark-green border border-dark-green/30 px-3 py-2 rounded-sm hover:bg-dark-green/5 self-start"
          >
            {value.file ? "Replace file" : value.url ? "Upload new" : "Upload"}
          </button>
          {value.file ? (
            <span className="text-[10px] uppercase tracking-widest text-foreground/60">
              New: {value.file.name}
            </span>
          ) : null}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

// ----------------- Dashboard -----------------

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [gallery, setGallery] = useState<GalleryItemApi[]>([]);
  const [media, setMedia] = useState<MediaAssetApi[]>([]);
  const [site, setSite] = useState<SiteContent | null>(null);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItemApi | null>(null);
  const [creating, setCreating] = useState<null | "book" | "blog" | "story" | "gallery">(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksRes, blogsRes, storiesRes, galleryRes, mediaRes, siteRes] = await Promise.all([
        booksApi.list(),
        blogsApi.list(),
        storiesApi.list(),
        galleryApi.list(),
        mediaApi.list(),
        siteContentApi.get(),
      ]);
      setBooks(booksRes);
      setBlogs(blogsRes);
      setStories(storiesRes);
      setGallery(galleryRes);
      setMedia(mediaRes);
      setSite(siteRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setAuthChecked(true);
    void refreshAll();
  }, [router, refreshAll]);

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

  function logout() {
    clearToken();
    router.push("/admin/login");
  }

  async function togglePublish<T extends { id: number; status: string }>(
    item: T,
    apiUpdate: (id: number, form: FormData) => Promise<T>,
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) {
    const next = item.status === "published" ? "draft" : "published";
    const form = new FormData();
    form.append("status", next);
    try {
      const updated = await apiUpdate(item.id, form);
      setList((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  }

  if (!authChecked) return null;

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
            gallery, and uploaded media.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={logout}
              className="text-xs uppercase tracking-widest font-semibold text-dark-green/70 hover:text-gold transition-colors"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={() => void refreshAll()}
              className="text-xs uppercase tracking-widest font-semibold text-dark-green/70 hover:text-gold transition-colors"
            >
              Refresh
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
          {error ? (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-sm text-sm text-rose-800">
              {error}
            </div>
          ) : null}
          {loading ? (
            <p className="text-sm text-foreground/60">Loading…</p>
          ) : (
            <>
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

              {tab === "site" && site && (
                <SiteContentEditor
                  site={site}
                  onSaved={(next) => setSite(next)}
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
                                  {book.image ? (
                                    <Image src={book.image} alt={book.title} fill className="object-cover" unoptimized />
                                  ) : null}
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
                              <StatusPill status={fromApiStatus(book.status)} />
                            </td>
                            <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => void togglePublish(book, booksApi.update, setBooks)}
                                className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                              >
                                {book.status === "published" ? "Unpublish" : "Publish"}
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
                                onClick={async () => {
                                  if (!confirm(`Delete "${book.title}"?`)) return;
                                  try {
                                    await booksApi.remove(book.id);
                                    setBooks((prev) => prev.filter((b) => b.id !== book.id));
                                  } catch (err) {
                                    alert(err instanceof Error ? err.message : "Delete failed");
                                  }
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
                            {blog.category} · {blog.published_on}
                          </p>
                          <h3 className="font-serif text-xl text-dark-green">{blog.title}</h3>
                          <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{blog.excerpt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <StatusPill status={fromApiStatus(blog.status)} />
                          <button
                            type="button"
                            onClick={() => void togglePublish(blog, blogsApi.update, setBlogs)}
                            className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                          >
                            {blog.status === "published" ? "Unpublish" : "Publish"}
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
                            onClick={async () => {
                              if (!confirm(`Delete "${blog.title}"?`)) return;
                              try {
                                await blogsApi.remove(blog.id);
                                setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
                              } catch (err) {
                                alert(err instanceof Error ? err.message : "Delete failed");
                              }
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
                            Short Fiction · {story.read_time} read
                          </p>
                          <h3 className="font-serif text-xl text-dark-green">{story.title}</h3>
                          <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{story.excerpt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <StatusPill status={fromApiStatus(story.status)} />
                          <button
                            type="button"
                            onClick={() => void togglePublish(story, storiesApi.update, setStories)}
                            className="text-xs uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                          >
                            {story.status === "published" ? "Unpublish" : "Publish"}
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
                            onClick={async () => {
                              if (!confirm(`Delete "${story.title}"?`)) return;
                              try {
                                await storiesApi.remove(story.id);
                                setStories((prev) => prev.filter((s) => s.id !== story.id));
                              } catch (err) {
                                alert(err instanceof Error ? err.message : "Delete failed");
                              }
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
                              onClick={async () => {
                                if (!confirm(`Remove "${item.title}"?`)) return;
                                try {
                                  await galleryApi.remove(item.id);
                                  setGallery((prev) => prev.filter((g) => g.id !== item.id));
                                } catch (err) {
                                  alert(err instanceof Error ? err.message : "Delete failed");
                                }
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
            </>
          )}
        </section>

        <div className="px-6 md:px-8 lg:px-16 pb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            aria-label="Change password"
            title="Change password"
            className="text-2xl opacity-40 hover:opacity-100 transition-opacity"
          >
            🔑
          </button>
        </div>
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
          onCancel={() => {
            setCreating(null);
            setEditingBook(null);
          }}
          onSaved={(saved) => {
            setBooks((prev) =>
              editingBook
                ? prev.map((b) => (b.id === saved.id ? saved : b))
                : [saved, ...prev]
            );
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
          onCancel={() => {
            setCreating(null);
            setEditingBlog(null);
          }}
          onSaved={(saved) => {
            setBlogs((prev) =>
              editingBlog
                ? prev.map((b) => (b.id === saved.id ? saved : b))
                : [saved, ...prev]
            );
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
          onCancel={() => {
            setCreating(null);
            setEditingStory(null);
          }}
          onSaved={(saved) => {
            setStories((prev) =>
              editingStory
                ? prev.map((s) => (s.id === saved.id ? saved : s))
                : [saved, ...prev]
            );
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
          onCancel={() => {
            setCreating(null);
            setEditingGallery(null);
          }}
          onSaved={(saved) => {
            setGallery((prev) =>
              editingGallery
                ? prev.map((g) => (g.id === saved.id ? saved : g))
                : [saved, ...prev]
            );
            setCreating(null);
            setEditingGallery(null);
          }}
        />
      </Modal>

      <Modal
        open={showPasswordModal}
        title="Change Password"
        onClose={() => setShowPasswordModal(false)}
      >
        <ChangePasswordForm onClose={() => setShowPasswordModal(false)} />
      </Modal>
    </>
  );
}

// ----------------- Change password -----------------

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"request" | "form" | "done">("request");
  const [otpCode, setOtpCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function sendCode() {
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await requestChangePasswordOtp();
      setStage("form");
      setInfo("We sent a 6-digit verification code to the admin email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resendCode() {
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await requestChangePasswordOtp();
      setInfo("A new verification code has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otpCode)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await confirmChangePassword({
        otp_code: otpCode,
        old_password: oldPassword,
        new_password: newPassword,
      });
      setStage("done");
      setInfo("Password updated.");
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "request") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-foreground/70">
          We&apos;ll email a 6-digit verification code to the admin address. You&apos;ll use it
          along with your current password to set a new one.
        </p>
        {error ? <p className="text-xs text-rose-700">{error}</p> : null}
        <div className="flex items-center gap-3">
          <PrimaryButton onClick={sendCode} disabled={submitting}>
            {submitting ? "Sending…" : "Send verification code"}
          </PrimaryButton>
          <GhostButton onClick={onClose} disabled={submitting}>
            Cancel
          </GhostButton>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-dark-green">Password updated.</p>
        <p className="text-xs text-foreground/60">You remain signed in with your existing session.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
          Current Password
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-sm"
          autoComplete="current-password"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-sm"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-sm"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
          Verification Code
        </label>
        <input
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-center text-lg tracking-[0.5em] font-semibold"
        />
      </div>
      {info ? <p className="text-xs text-dark-green/70">{info}</p> : null}
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={resendCode}
          disabled={submitting}
          className="text-[10px] uppercase tracking-widest text-dark-green/70 hover:text-gold transition-colors disabled:opacity-60"
        >
          Resend code
        </button>
        <div className="flex items-center gap-3">
          <GhostButton onClick={onClose} disabled={submitting}>
            Cancel
          </GhostButton>
          <PrimaryButton
            type="submit"
            disabled={
              submitting ||
              otpCode.length !== 6 ||
              !oldPassword ||
              !newPassword ||
              !confirmPassword
            }
          >
            {submitting ? "Updating…" : "Update password"}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}

// ----------------- Site content editor -----------------

function SiteContentEditor({
  site,
  onSaved,
}: {
  site: SiteContent;
  onSaved: (next: SiteContent) => void;
}) {
  const [draft, setDraft] = useState<SiteContent>(site);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(site);
  }, [site]);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("hero_kicker", draft.hero_kicker);
      form.append("hero_title", draft.hero_title);
      form.append("hero_subtitle", draft.hero_subtitle);
      form.append("hero_cta_label", draft.hero_cta_label);
      if (heroFile) form.append("hero_image", heroFile);
      form.append("awards", JSON.stringify(draft.awards));
      form.append("featured_kicker", draft.featured_kicker);
      form.append("featured_title", draft.featured_title);
      form.append("featured_tagline", draft.featured_tagline);
      form.append("featured_description", draft.featured_description);
      if (featuredFile) form.append("featured_image", featuredFile);
      form.append("newsletter_headline", draft.newsletter_headline);
      form.append("newsletter_body", draft.newsletter_body);
      form.append("contact_email", draft.contact_email);

      const next = await siteContentApi.update(form);
      onSaved(next);
      setHeroFile(null);
      setFeaturedFile(null);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Site Content"
        subtitle="Edit the homepage hero, featured book, awards strip, and global text."
        action={
          <div className="flex items-center gap-3">
            {message ? <span className="text-xs text-foreground/70">{message}</span> : null}
            <PrimaryButton onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </PrimaryButton>
          </div>
        }
      />
      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Hero Section</h3>
        <Field label="Kicker">
          <input value={draft.hero_kicker} onChange={(e) => update("hero_kicker", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Title">
          <input value={draft.hero_title} onChange={(e) => update("hero_title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Subtitle">
          <textarea
            value={draft.hero_subtitle}
            onChange={(e) => update("hero_subtitle", e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="CTA Label">
          <input value={draft.hero_cta_label} onChange={(e) => update("hero_cta_label", e.target.value)} className={inputCls} />
        </Field>
        <ImagePicker
          label="Hero Portrait"
          value={{ url: draft.hero_image, file: heroFile }}
          onChange={(next) => {
            setHeroFile(next.file);
          }}
        />
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Awards Strip</h3>
        <div className="space-y-2">
          {draft.awards.map((award, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={award}
                onChange={(e) => {
                  const next = [...draft.awards];
                  next[i] = e.target.value;
                  update("awards", next);
                }}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => update("awards", draft.awards.filter((_, idx) => idx !== i))}
                className="text-xs uppercase tracking-widest font-semibold text-rose-700 px-3 border border-rose-200 rounded-sm hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          ))}
          <GhostButton onClick={() => update("awards", [...draft.awards, "New Award"])}>Add Award</GhostButton>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Featured Book Section</h3>
        <Field label="Kicker">
          <input value={draft.featured_kicker} onChange={(e) => update("featured_kicker", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Title">
          <input value={draft.featured_title} onChange={(e) => update("featured_title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Tagline">
          <textarea
            value={draft.featured_tagline}
            onChange={(e) => update("featured_tagline", e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={draft.featured_description}
            onChange={(e) => update("featured_description", e.target.value)}
            rows={4}
            className={inputCls}
          />
        </Field>
        <ImagePicker
          label="Cover Image"
          value={{ url: draft.featured_image, file: featuredFile }}
          onChange={(next) => {
            setFeaturedFile(next.file);
          }}
        />
      </div>

      <div className="bg-white rounded-sm border border-dark-green/10 p-5 md:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-dark-green">Newsletter & Contact</h3>
        <Field label="Newsletter Headline">
          <input value={draft.newsletter_headline} onChange={(e) => update("newsletter_headline", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Newsletter Body">
          <textarea
            value={draft.newsletter_body}
            onChange={(e) => update("newsletter_body", e.target.value)}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Contact Email">
          <input
            type="email"
            value={draft.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

// ----------------- Entity forms -----------------

function BookForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Book | null;
  onSaved: (book: Book) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [imageUrl] = useState(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<UiStatus>(initial ? fromApiStatus(initial.status) : "Draft");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const form = new FormData();
      if (initial) {
        if (title !== initial.title) form.append("title", title.trim());
        if (Number(year) !== initial.year) form.append("year", String(Number(year) || new Date().getFullYear()));
        if (tagline !== initial.tagline) form.append("tagline", tagline);
        if (description !== initial.description) form.append("description", description);
        if (toApiStatus(status) !== initial.status) form.append("status", toApiStatus(status));
        if (imageFile) form.append("image", imageFile);
        const saved = await booksApi.update(initial.id, form);
        onSaved(saved);
      } else {
        form.append("title", title.trim());
        form.append("year", String(Number(year) || new Date().getFullYear()));
        form.append("tagline", tagline);
        form.append("description", description);
        form.append("status", toApiStatus(status));
        if (imageFile) form.append("image", imageFile);
        const saved = await booksApi.create(form);
        onSaved(saved);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
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
            onChange={(e) => setStatus(e.target.value as UiStatus)}
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
      <ImagePicker
        label="Cover Image"
        value={{ url: imageUrl, file: imageFile }}
        onChange={(next) => setImageFile(next.file)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Book"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function BlogForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Blog | null;
  onSaved: (blog: Blog) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<"blog" | "news">(initial?.category ?? "blog");
  const [publishedOn, setPublishedOn] = useState(initial?.published_on ?? new Date().toLocaleDateString());
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverUrl] = useState(initial?.cover ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UiStatus>(initial ? fromApiStatus(initial.status) : "Draft");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const form = new FormData();
      if (initial) {
        if (title !== initial.title) form.append("title", title.trim());
        if (category !== initial.category) form.append("category", category);
        if (publishedOn !== initial.published_on) form.append("published_on", publishedOn);
        if (excerpt !== initial.excerpt) form.append("excerpt", excerpt);
        if (body !== initial.body) form.append("body", body);
        if (toApiStatus(status) !== initial.status) form.append("status", toApiStatus(status));
        if (coverFile) form.append("cover", coverFile);
        const saved = await blogsApi.update(initial.id, form);
        onSaved(saved);
      } else {
        form.append("title", title.trim());
        form.append("category", category);
        form.append("published_on", publishedOn);
        form.append("excerpt", excerpt);
        form.append("body", body);
        form.append("status", toApiStatus(status));
        if (coverFile) form.append("cover", coverFile);
        const saved = await blogsApi.create(form);
        onSaved(saved);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "blog" | "news")}
            className={inputCls}
          >
            <option value="blog">Blog</option>
            <option value="news">News</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UiStatus)}
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
      <ImagePicker
        label="Cover Image"
        value={{ url: coverUrl, file: coverFile }}
        onChange={(next) => setCoverFile(next.file)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Post"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function StoryForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Story | null;
  onSaved: (story: Story) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [readTime, setReadTime] = useState(initial?.read_time ?? "5 min");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverUrl] = useState(initial?.cover ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UiStatus>(initial ? fromApiStatus(initial.status) : "Draft");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const form = new FormData();
      if (initial) {
        if (title !== initial.title) form.append("title", title.trim());
        if (readTime !== initial.read_time) form.append("read_time", readTime);
        if (excerpt !== initial.excerpt) form.append("excerpt", excerpt);
        if (body !== initial.body) form.append("body", body);
        if (toApiStatus(status) !== initial.status) form.append("status", toApiStatus(status));
        if (coverFile) form.append("cover", coverFile);
        const saved = await storiesApi.update(initial.id, form);
        onSaved(saved);
      } else {
        form.append("title", title.trim());
        form.append("read_time", readTime);
        form.append("excerpt", excerpt);
        form.append("body", body);
        form.append("status", toApiStatus(status));
        if (coverFile) form.append("cover", coverFile);
        const saved = await storiesApi.create(form);
        onSaved(saved);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
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
            onChange={(e) => setStatus(e.target.value as UiStatus)}
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
      <ImagePicker
        label="Cover Image"
        value={{ url: coverUrl, file: coverFile }}
        onChange={(next) => setCoverFile(next.file)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Story"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function GalleryForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: GalleryItemApi | null;
  onSaved: (item: GalleryItemApi) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [imageUrl] = useState(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const form = new FormData();
      if (initial) {
        if (title !== initial.title) form.append("title", title.trim());
        if (imageFile) form.append("image", imageFile);
        const saved = await galleryApi.update(initial.id, form);
        onSaved(saved);
      } else {
        form.append("title", title.trim());
        if (imageFile) form.append("image", imageFile);
        const saved = await galleryApi.create(form);
        onSaved(saved);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Caption / Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
      </Field>
      <ImagePicker
        label="Photo"
        value={{ url: imageUrl, file: imageFile }}
        onChange={(next) => setImageFile(next.file)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Add Photo"}
        </PrimaryButton>
      </div>
    </form>
  );
}

// ----------------- Media library -----------------

function MediaLibrary({
  media,
  setMedia,
}: {
  media: MediaAssetApi[];
  setMedia: React.Dispatch<React.SetStateAction<MediaAssetApi[]>>;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const asset = await mediaApi.upload(file);
        setMedia((prev) => [asset, ...prev]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Media Library"
        subtitle="Upload, copy URLs, and remove images used across the site."
        action={
          <PrimaryButton onClick={() => fileInput.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload Image"}
          </PrimaryButton>
        }
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((asset) => (
          <div key={asset.id} className="bg-white border border-dark-green/10 rounded-sm overflow-hidden">
            <div className="relative aspect-square bg-dark-green/5">
              {asset.file_type === "video" ? (
                <video src={asset.url} className="w-full h-full object-cover" controls />
              ) : (
                <Image src={asset.url} alt={asset.filename} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-semibold text-dark-green truncate" title={asset.filename}>
                {asset.filename}
              </p>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(asset.url).catch(() => {});
                    }
                  }}
                  className="text-[10px] uppercase tracking-widest font-semibold text-dark-green hover:text-gold"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Remove "${asset.filename}"?`)) return;
                    try {
                      await mediaApi.remove(asset.id);
                      setMedia((prev) => prev.filter((m) => m.id !== asset.id));
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Delete failed");
                    }
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
