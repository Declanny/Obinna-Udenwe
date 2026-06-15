"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { GalleryItemApi } from "../lib/api";

export function GalleryLightbox({ items }: { items: GalleryItemApi[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, prev, next]);

  const active = index === null ? null : items[index];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open ${photo.title}`}
            className="group relative aspect-4/3 overflow-hidden rounded-sm bg-dark-green/10 outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {photo.image ? (
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : null}
            <span className="absolute inset-0 bg-dark-green/0 group-hover:bg-dark-green/20 transition-colors" />
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={close}
            className="absolute inset-0 bg-dark-green/85 backdrop-blur-sm cursor-default"
          />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none flex items-center justify-center transition-colors"
          >
            ×
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              >
                →
              </button>
            </>
          ) : null}

          <div className="relative z-0 w-full max-w-5xl mx-auto px-4 md:px-16 py-12">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
              {active.image ? (
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              ) : null}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-white/85">
              <p className="font-serif italic text-base md:text-lg">{active.title}</p>
              {items.length > 1 ? (
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/60">
                  {(index ?? 0) + 1} / {items.length}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
