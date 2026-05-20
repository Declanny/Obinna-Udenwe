// Typed client for the Obinna Udenwe admin API.
// Server-rendered reads use absolute URLs; admin writes use the bearer token in localStorage.

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://obinna-udenwe.onrender.com";
export const API_BASE = `${RAW_BASE.replace(/\/+$/, "")}/api/v1`;

export const ADMIN_TOKEN_KEY = "obinna_admin_token";

// ---------------- Types ----------------

export type ApiStatus = "draft" | "published";

export type Book = {
  id: number;
  title: string;
  year: number;
  image: string;
  tagline: string;
  description: string;
  status: ApiStatus;
  created_at: string;
  updated_at: string;
};

export type Blog = {
  id: number;
  title: string;
  category: "blog" | "news";
  published_on: string;
  excerpt: string;
  body: string;
  cover: string;
  status: ApiStatus;
  created_at: string;
  updated_at: string;
};

export type Story = {
  id: number;
  title: string;
  read_time: string;
  excerpt: string;
  body: string;
  cover: string;
  status: ApiStatus;
  created_at: string;
  updated_at: string;
};

export type GalleryItemApi = {
  id: number;
  title: string;
  image: string;
  created_at: string;
  updated_at: string;
};

export type MediaAssetApi = {
  id: number;
  filename: string;
  public_id: string;
  url: string;
  file_type: string;
  size: number;
  created_at: string;
};

export type ContactInquiryType = "reader" | "press" | "publishers" | "events";

export type ContactSubmissionCreate = {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiry_type: ContactInquiryType;
  organization?: string;
  schedule?: string;
};

export type ContactSubmission = ContactSubmissionCreate & {
  id: number;
  created_at: string;
};

export type SiteContent = {
  id: number;
  hero_kicker: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_label: string;
  hero_image: string;
  awards: string[];
  featured_kicker: string;
  featured_title: string;
  featured_tagline: string;
  featured_description: string;
  featured_image: string;
  newsletter_headline: string;
  newsletter_body: string;
  contact_email: string;
  updated_at: string;
};

// ---------------- Auth ----------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail ?? "Login failed");
  }
}

export async function resendOtp(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail ?? "Could not resend code");
  }
}

export async function verifyOtp(username: string, code: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail ?? "Verification failed");
  }
  const data = (await res.json()) as { access_token: string };
  setToken(data.access_token);
  return data.access_token;
}

// ---------------- Fetch helper ----------------

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---------------- Books ----------------

export const booksApi = {
  list: () => request<Book[]>("/books/"),
  get: (id: number) => request<Book>(`/books/${id}`),
  create: (form: FormData) =>
    request<Book>("/books/", { method: "POST", headers: authHeaders(), body: form }),
  update: (id: number, form: FormData) =>
    request<Book>(`/books/${id}`, { method: "PUT", headers: authHeaders(), body: form }),
  remove: (id: number) =>
    request<void>(`/books/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Blogs ----------------

export const blogsApi = {
  list: () => request<Blog[]>("/blogs/"),
  get: (id: number) => request<Blog>(`/blogs/${id}`),
  create: (form: FormData) =>
    request<Blog>("/blogs/", { method: "POST", headers: authHeaders(), body: form }),
  update: (id: number, form: FormData) =>
    request<Blog>(`/blogs/${id}`, { method: "PUT", headers: authHeaders(), body: form }),
  remove: (id: number) =>
    request<void>(`/blogs/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Stories ----------------

export const storiesApi = {
  list: () => request<Story[]>("/stories/"),
  get: (id: number) => request<Story>(`/stories/${id}`),
  create: (form: FormData) =>
    request<Story>("/stories/", { method: "POST", headers: authHeaders(), body: form }),
  update: (id: number, form: FormData) =>
    request<Story>(`/stories/${id}`, { method: "PUT", headers: authHeaders(), body: form }),
  remove: (id: number) =>
    request<void>(`/stories/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Gallery ----------------

export const galleryApi = {
  list: () => request<GalleryItemApi[]>("/gallery/"),
  get: (id: number) => request<GalleryItemApi>(`/gallery/${id}`),
  create: (form: FormData) =>
    request<GalleryItemApi>("/gallery/", { method: "POST", headers: authHeaders(), body: form }),
  update: (id: number, form: FormData) =>
    request<GalleryItemApi>(`/gallery/${id}`, { method: "PUT", headers: authHeaders(), body: form }),
  remove: (id: number) =>
    request<void>(`/gallery/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Media ----------------

export const mediaApi = {
  list: () => request<MediaAssetApi[]>("/media/"),
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<MediaAssetApi>("/media/upload", {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });
  },
  remove: (id: number) =>
    request<void>(`/media/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Site content ----------------

export const siteContentApi = {
  get: () => request<SiteContent>("/site-content/"),
  update: (form: FormData) =>
    request<SiteContent>("/site-content/", {
      method: "PUT",
      headers: authHeaders(),
      body: form,
    }),
};

// ---------------- Subscribers ----------------

export const subscribersApi = {
  subscribe: (data: { name: string; email: string }) =>
    request<{ id: number; name: string; email: string; subscribed_at: string }>(
      "/subscribers/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    ),
};

// ---------------- Contact ----------------

export const contactsApi = {
  create: (payload: ContactSubmissionCreate) =>
    request<ContactSubmission>("/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  list: () =>
    request<ContactSubmission[]>("/contact/", { headers: authHeaders() }),
  remove: (id: number) =>
    request<void>(`/contact/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ---------------- Slug helper ----------------

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
