"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getToken, login } from "../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid login details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <section className="px-6 md:px-8 lg:px-16 py-16 md:py-24">
          <div className="max-w-md mx-auto bg-white border border-dark-green/10 rounded-sm p-7 md:p-8">
            <p className="text-gold text-[10px] uppercase tracking-widest font-semibold mb-3">
              Restricted Access
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-dark-green font-bold mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-foreground/70 mb-6">
              Sign in to access the content management dashboard.
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-sm"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-sm"
                  autoComplete="current-password"
                />
              </div>
              {error ? <p className="text-xs text-rose-700">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-dark-green text-white text-xs uppercase tracking-widest font-semibold px-4 py-3 rounded-sm hover:bg-dark-green/90 transition-colors disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Login"}
              </button>
            </form>

            <Link
              href="/"
              className="inline-block mt-4 text-xs uppercase tracking-widest text-dark-green/70 hover:text-gold transition-colors"
            >
              Back to site
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
