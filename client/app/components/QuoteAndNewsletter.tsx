"use client";

import { useState } from "react";

import { subscribersApi } from "../lib/api";

export function QuoteAndNewsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await subscribersApi.subscribe({ name, email });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(
        message.includes("409") ? "You're already subscribed." : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-14 md:py-20 flex flex-col lg:flex-row gap-10 md:gap-16 items-start lg:items-center">
        <div className="flex-1">
          <span className="text-gold text-4xl leading-none">&ldquo;</span>
          <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl italic leading-relaxed mt-2">
            Literature is the only tool we have to interrogate the silence of
            history.
          </blockquote>
          <p className="text-gold text-xs uppercase tracking-widest font-semibold mt-6">
            Obinna Udenwe
          </p>
        </div>
        <div className="w-full lg:flex-1 bg-cream text-foreground p-6 md:p-8 rounded-sm lg:max-w-md">
          <h3 className="font-serif text-2xl font-bold text-dark-green mb-2">
            Stay Informed
          </h3>
          <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
            Join the inner circle for exclusive updates on new releases,
            readings, and literary reflections.
          </p>
          {success ? (
            <p className="text-dark-green font-semibold text-sm">
              You&apos;re subscribed! Thank you for joining.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="FULL NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 text-xs tracking-widest border border-foreground/20 rounded-sm bg-transparent placeholder:text-foreground/40 focus:outline-none focus:border-gold"
              />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-xs tracking-widest border border-foreground/20 rounded-sm bg-transparent placeholder:text-foreground/40 focus:outline-none focus:border-gold"
              />
              {error && (
                <p className="text-red-600 text-xs">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-white text-xs font-semibold uppercase tracking-widest py-3 rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
