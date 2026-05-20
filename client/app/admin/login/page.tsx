"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getToken, login, resendOtp, verifyOtp } from "../../lib/api";

type Stage = "credentials" | "code";

export default function AdminLoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  async function onSubmitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await login(username, password);
      setStage("code");
      setInfo("We sent a 6-digit verification code to the admin email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid login details.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyOtp(username, code);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await resendOtp(username, password);
      setInfo("A new verification code has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setSubmitting(false);
    }
  }

  function backToCredentials() {
    setStage("credentials");
    setCode("");
    setError("");
    setInfo("");
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
              {stage === "credentials" ? "Admin Login" : "Verify Email"}
            </h1>
            <p className="text-sm text-foreground/70 mb-6">
              {stage === "credentials"
                ? "Sign in to access the content management dashboard."
                : "Enter the 6-digit code sent to the admin email to finish signing in."}
            </p>

            {stage === "credentials" ? (
              <form className="space-y-4" onSubmit={onSubmitCredentials}>
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
                  {submitting ? "Sending code…" : "Continue"}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={onSubmitCode}>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 block mb-1.5">
                    Verification Code
                  </label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    className="w-full border border-dark-green/20 rounded-sm px-3 py-2.5 text-center text-lg tracking-[0.5em] font-semibold"
                  />
                </div>
                {info ? <p className="text-xs text-dark-green/70">{info}</p> : null}
                {error ? <p className="text-xs text-rose-700">{error}</p> : null}
                <button
                  type="submit"
                  disabled={submitting || code.length !== 6}
                  className="w-full bg-dark-green text-white text-xs uppercase tracking-widest font-semibold px-4 py-3 rounded-sm hover:bg-dark-green/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? "Verifying…" : "Verify & Sign in"}
                </button>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={backToCredentials}
                    disabled={submitting}
                    className="text-[10px] uppercase tracking-widest text-dark-green/70 hover:text-gold transition-colors disabled:opacity-60"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={submitting}
                    className="text-[10px] uppercase tracking-widest text-dark-green/70 hover:text-gold transition-colors disabled:opacity-60"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

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
