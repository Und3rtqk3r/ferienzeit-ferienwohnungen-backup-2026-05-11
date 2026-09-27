"use client";

import { useRef } from "react";

type Category = "Natur" | "Museum" | "Wellness" | "Erlebnis" | "Restaurant" | "Ausflug";

interface Place {
  name: string;
  category: Category;
  distance: string;
  description: string;
  mapsQuery: string;
  rating?: string;
}

const PLACES: Place[] = [
  {
    name: "Spreewaldfahrt Familie Goertz",
    category: "Ausflug",
    distance: "12 km",
    description:
      "Traditionelle Kahnfahrt durch das UNESCO-Biosphärenreservat. Stille Fließe, Schilf und die Geschichte des Spreewalds — erzählt vom Kahnführer.",
    mapsQuery: "Spreewaldfahrt+Familie+Goertz+Lübbenau",
    rating: "4.7",
  },
  {
    name: "Spreewald Therme",
    category: "Wellness",
    distance: "15 km",
    description:
      "Entspannung nach einem Wandertag: große Saunalandschaft, Außenbecken und Ruhebereich mitten im Biosphärenreservat. Burg (Spreewald).",
    mapsQuery: "Spreewald+Therme+Burg",
    rating: "4.2",
  },
  {
    name: "Slawischer Burgwall Raddusch",
    category: "Museum",
    distance: "5 km",
    description:
      "Rekonstruierter Ringwall aus dem 9. Jahrhundert — das älteste sichtbare Baudenkmal der Region. Mit Aussichtsplattform über die Teiche.",
    mapsQuery: "Slawischer+Burgwall+Raddusch",
    rating: "4.4",
  },
  {
    name: "Freilandmuseum Lehde",
    category: "Museum",
    distance: "20 km",
    description:
      "Vier original erhaltene Spreewaldgehöfte aus dem 19. Jahrhundert — Einblick in das Leben der sorbischen Bevölkerung. Im Dorf Lehde, nur per Kahn oder Rad erreichbar.",
    mapsQuery: "Freilandmuseum+Lehde+Spreewald",
    rating: "4.5",
  },
  {
    name: "Gurkenradweg",
    category: "Natur",
    distance: "direkt",
    description:
      "250 km Radwegenetz durch Gurkenfelder, Wasserwege und Dörfer — das Herzstück des Spreewalds. Flach, gut beschildert, für jedes Tempo geeignet.",
    mapsQuery: "Gurkenradweg+Spreewald",
  },
  {
    name: "Tropical Islands",
    category: "Erlebnis",
    distance: "35 km",
    description:
      "Die größte Indoortropenwelt der Welt in einer umgebauten Luftschiffhalle. Strand, Wasserrutschen, Regenwald und Sauna unter einem Dach.",
    mapsQuery: "Tropical+Islands+Brand",
    rating: "4.3",
  },
  {
    name: "Schloss & Park Branitz",
    category: "Natur",
    distance: "28 km",
    description:
      "Das Lebenswerk des exzentrischen Fürsten Pückler-Muskau: ein englischer Landschaftspark mit einzigartigen Erdpyramiden und barockem Schloss in Cottbus.",
    mapsQuery: "Schloss+Branitz+Cottbus",
    rating: "4.6",
  },
  {
    name: "Spreewood Distillers",
    category: "Erlebnis",
    distance: "18 km",
    description:
      "Whisky, Gin und Liköre aus dem Biosphärenreservat. Führungen durch die Destillerie, Tastings und ein kleiner Shop direkt vor Ort in Schlepzig.",
    mapsQuery: "Spreewood+Distillers+Schlepzig",
    rating: "4.2",
  },
  {
    name: "Biberhof & Aquarium",
    category: "Natur",
    distance: "15 km",
    description:
      "Biber, Fischotter, Fischadler — die typischen Bewohner des Spreewalds zum Anfassen nah. Beliebtes Ausflugsziel für Familien in Raddusch.",
    mapsQuery: "Biberhof+Raddusch+Spreewald",
    rating: "4.2",
  },
  {
    name: "Bismarckturm Burg",
    category: "Ausflug",
    distance: "17 km",
    description:
      "Historischer Aussichtsturm auf einem der wenigen Hügel des Spreewalds. Bei klarem Wetter Panoramablick über das gesamte Biosphärenreservat.",
    mapsQuery: "Bismarckturm+Burg+Spreewald",
    rating: "3.6",
  },
];

const categoryStyles: Record<Category, { bg: string; text: string; dot: string }> = {
  Natur:     { bg: "bg-moss-50",   text: "text-moss-700",   dot: "bg-moss-500" },
  Museum:    { bg: "bg-sand-50",   text: "text-sand-700",   dot: "bg-sand-500" },
  Wellness:  { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  Erlebnis:  { bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-400" },
  Restaurant:{ bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  Ausflug:   { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500" },
};

export function PlacesToVisit() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section id="ausflugsziele" className="py-20 md:py-28 border-t border-ink/10 scroll-mt-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="eyebrow mb-4">Die Region</div>
            <h2 className="font-display text-display-lg max-w-2xl leading-[1.02]">
              Was Sie nicht verpassen{" "}
              <span className="italic text-moss-600">sollten.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-ink/60 max-w-xs text-sm md:text-base shrink-0 hidden md:block">
              Ausgewählte Highlights im Umkreis von 50 km.
            </p>
            {/* Arrow buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => scroll("left")}
                aria-label="Zurück"
                className="h-9 w-9 rounded-full border border-ink/15 bg-cream flex items-center justify-center text-ink/50 hover:border-ink/30 hover:text-ink/80 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Weiter"
                className="h-9 w-9 rounded-full border border-ink/15 bg-cream flex items-center justify-center text-ink/50 hover:border-ink/30 hover:text-ink/80 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-parchment to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-parchment to-transparent z-10" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PLACES.map((place) => {
              const style = categoryStyles[place.category];
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.mapsQuery}`;
              return (
                <a
                  key={place.name}
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group snap-start shrink-0 w-[280px] md:w-[300px] bg-cream border border-ink/10 rounded-sm p-5 md:p-6 flex flex-col hover:border-ink/25 hover:shadow-card transition-all duration-200"
                >
                  {/* Top row: category + distance */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
                      {place.category}
                    </span>
                    <span className="text-xs text-ink/45 tabular-nums">{place.distance}</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl leading-tight mb-3 group-hover:text-moss-700 transition-colors">
                    {place.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-ink/70 leading-relaxed flex-1">
                    {place.description}
                  </p>

                  {/* Footer: rating + link hint */}
                  <div className="mt-4 pt-4 border-t border-ink/8 flex items-center justify-between">
                    {place.rating ? (
                      <span className="text-xs text-ink/50 flex items-center gap-1">
                        <span className="text-sand-500">★</span>
                        {place.rating} auf TripAdvisor
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-ink/40 group-hover:text-moss-600 transition-colors">
                      Maps ↗
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-xs text-ink/40">
          Alle Entfernungen ab Musterstadt. Bewertungen via TripAdvisor.
        </p>
      </div>
    </section>
  );
}
