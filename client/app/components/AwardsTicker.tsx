"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { slugify } from "../lib/api";
import { Prize } from "../lib/fallback";

const MOBILE_VISIBLE_THRESHOLD = 2;
const DESKTOP_VISIBLE_THRESHOLD = 4;
const MOBILE_SCROLL_SPEED_PX_PER_MS = 0.04;
const MOBILE_RESUME_DELAY_MS = 2000;

export function AwardsTicker({ prizes }: { prizes: Prize[] }) {
  const [selected, setSelected] = useState<Prize | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  const needsMobileScroll = prizes.length > MOBILE_VISIBLE_THRESHOLD;
  const needsDesktopScroll = prizes.length > DESKTOP_VISIBLE_THRESHOLD;

  useEffect(() => {
    if (!needsMobileScroll) return;
    const el = mobileScrollRef.current;
    if (!el) return;

    let raf = 0;
    let lastTime = 0;
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (time: number) => {
      if (!paused && lastTime) {
        const dt = time - lastTime;
        el.scrollLeft += dt * MOBILE_SCROLL_SPEED_PX_PER_MS;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      lastTime = time;
      raf = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        lastTime = 0;
      }, MOBILE_RESUME_DELAY_MS);
    };

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", scheduleResume, { passive: true });
    el.addEventListener("touchcancel", scheduleResume, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", scheduleResume);
      el.removeEventListener("touchcancel", scheduleResume);
    };
  }, [needsMobileScroll, prizes.length]);

  const renderButton = (prize: Prize, key: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setSelected(prize)}
      className="font-sans font-bold text-[11px] md:text-xs uppercase text-black pb-1 text-center hover:text-gold focus-visible:text-gold transition-colors cursor-pointer outline-none whitespace-nowrap shrink-0"
      style={{
        letterSpacing: "2.4px",
        lineHeight: "16px",
        borderBottom: "2px solid #C8922A",
      }}
    >
      {prize.label}
    </button>
  );

  return (
    <>
      <div
        className="bg-white"
        style={{
          borderTop: "1px solid #C2C8C11A",
          borderBottom: "1px solid #C2C8C11A",
        }}
      >
        <div className="md:hidden py-8">
          {needsMobileScroll ? (
            <div
              ref={mobileScrollRef}
              className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex w-max gap-x-8 px-6">
                {prizes.map((prize) => renderButton(prize, `m-a-${prize.label}`))}
                {prizes.map((prize) => renderButton(prize, `m-b-${prize.label}`))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-6">
              {prizes.map((prize) => renderButton(prize, prize.label))}
            </div>
          )}
        </div>

        <div className="hidden md:block px-8 lg:px-16 py-12">
          {needsDesktopScroll ? (
            <div className="overflow-hidden group">
              <div className="flex w-max gap-x-12 animate-marquee group-hover:[animation-play-state:paused]">
                {prizes.map((prize) => renderButton(prize, `d-a-${prize.label}`))}
                {prizes.map((prize) => renderButton(prize, `d-b-${prize.label}`))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-x-6">
              {prizes.map((prize) => renderButton(prize, prize.label))}
            </div>
          )}
        </div>
      </div>

      {selected ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prize-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
        >
          <button
            type="button"
            aria-label="Close prize details"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-dark-green/60 backdrop-blur-sm cursor-default"
          />
          <div className="relative bg-cream w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-sm border border-dark-green/15 shadow-xl">
            <div className="px-6 md:px-8 py-7 md:py-9">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <p className="text-gold text-[10px] uppercase tracking-widest font-semibold mb-2">
                    {selected.year ? `Awarded ${selected.year}` : "Recognition"}
                  </p>
                  <h2
                    id="prize-modal-title"
                    className="font-serif text-2xl md:text-3xl font-bold text-dark-green leading-tight"
                  >
                    {selected.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="text-dark-green/60 hover:text-dark-green text-3xl leading-none -mt-2 shrink-0"
                >
                  ×
                </button>
              </div>

              {selected.work ? (
                <p className="font-serif italic text-base md:text-lg text-dark-green/70 mb-5">
                  Awarded for{" "}
                  <span className="not-italic font-semibold text-dark-green">
                    {selected.work}
                  </span>
                </p>
              ) : null}

              <p className="text-sm md:text-[15px] text-foreground/80 leading-relaxed">
                {selected.detail}
              </p>

              {selected.items && selected.items.length > 0 ? (
                <div className="border-t border-dark-green/10 mt-6 pt-5">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-3">
                    Highlights
                  </p>
                  <ul className="space-y-2">
                    {selected.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-foreground/80 leading-relaxed flex gap-2"
                      >
                        <span className="text-gold mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="border-t border-dark-green/10 mt-6 pt-5">
                <Link
                  href={`/prizes/${slugify(selected.label)}`}
                  onClick={() => setSelected(null)}
                  className="inline-block bg-dark-green text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-sm hover:bg-dark-green/90 transition-colors"
                >
                  View Prize Detail →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
