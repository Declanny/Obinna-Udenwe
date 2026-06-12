"use client";

import { useEffect, useState } from "react";
import { Prize } from "../lib/fallback";

export function AwardsTicker({ prizes }: { prizes: Prize[] }) {
  const [selected, setSelected] = useState<Prize | null>(null);

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

  return (
    <>
      <div
        className="bg-white"
        style={{
          borderTop: "1px solid #C2C8C11A",
          borderBottom: "1px solid #C2C8C11A",
        }}
      >
        <div className="px-6 md:px-8 lg:px-16 py-8 md:py-12 grid grid-cols-2 md:flex md:items-center md:justify-between gap-x-6 gap-y-5">
          {prizes.map((prize) => (
            <button
              key={prize.label}
              type="button"
              onClick={() => setSelected(prize)}
              className="font-sans font-bold text-[11px] md:text-xs uppercase text-black pb-1 text-center md:text-left hover:text-gold focus-visible:text-gold transition-colors cursor-pointer outline-none"
              style={{
                letterSpacing: "2.4px",
                lineHeight: "16px",
                borderBottom: "2px solid #C8922A",
              }}
            >
              {prize.label}
            </button>
          ))}
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
