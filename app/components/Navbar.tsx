"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/stories", label: "Stories" },
  { href: "/news", label: "News & Blogs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [trackedPath, setTrackedPath] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setOpen(false);
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className={`sticky top-0 z-50 transition-[padding] duration-300 text-dark-green ${
        open
          ? "py-5 md:py-6 bg-white border-b border-dark-green/10"
          : scrolled
            ? "py-3 md:py-4 bg-white/85 backdrop-blur-md border-b border-dark-green/5 shadow-[0_1px_0_rgba(12,40,25,0.04)]"
            : "py-5 md:py-6 bg-white border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-8 lg:px-16">
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl font-bold text-[#0B2919]"
          onClick={() => setOpen(false)}
        >
          Obinna Udenwe
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-serif text-base lg:text-lg font-bold text-black">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                isActive(l.href) ? "text-gold" : "hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden md:inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-sm hover:bg-gold/90 transition-colors"
        >
          Contact
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center text-dark-green"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span
            className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
              open ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
              open ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-white transition-[opacity,transform] duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ top: 72 }}
      >
        <div className="flex flex-col h-full px-6 pt-8 pb-10">
          <div className="flex flex-col gap-6 font-serif text-2xl font-bold text-black">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`transition-colors ${
                  isActive(l.href) ? "text-gold" : "hover:text-gold"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-auto inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-6 py-4 rounded-sm hover:bg-gold/90 transition-colors text-center"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
