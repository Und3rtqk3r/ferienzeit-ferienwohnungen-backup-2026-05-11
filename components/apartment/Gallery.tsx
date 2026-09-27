"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setOpen((i) =>
          i === null ? null : (i - 1 + images.length) % images.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  if (images.length === 0) return null;
  const [hero, ...rest] = images;

  return (
    <>
      <div className="grid md:grid-cols-5 gap-3 md:gap-4">
        {/* Hauptbild */}
        <button
          onClick={() => setOpen(0)}
          className="md:col-span-3 relative aspect-[4/3] overflow-hidden rounded-sm group"
        >
          <Image
            src={hero}
            alt={`${alt} — Ansicht 1`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </button>

        {/* Thumbnails */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
          {rest.slice(0, 4).map((src, idx) => (
            <button
              key={src}
              onClick={() => setOpen(idx + 1)}
              className="relative aspect-[4/3] overflow-hidden rounded-sm group"
            >
              <Image
                src={src}
                alt={`${alt} — Ansicht ${idx + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-ink/60 text-parchment flex items-center justify-center text-sm">
                  + {images.length - 5} mehr
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 text-parchment/80 hover:text-parchment text-3xl leading-none"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(null);
            }}
            aria-label="Galerie schließen"
          >
            ×
          </button>

          <button
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-parchment/70 hover:text-parchment text-4xl px-3 py-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) =>
                i === null ? null : (i - 1 + images.length) % images.length
              );
            }}
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>

          <div
            className="relative w-full max-w-5xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={`${alt} — Ansicht ${open + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-parchment/70 hover:text-parchment text-4xl px-3 py-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i === null ? null : (i + 1) % images.length));
            }}
            aria-label="Nächstes Bild"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-parchment/60 text-xs">
            {open + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
