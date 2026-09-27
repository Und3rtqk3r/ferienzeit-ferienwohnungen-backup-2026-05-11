import Image from "next/image";
import Link from "next/link";
import { SpreeMap } from "./SpreeMap";

const highlights = [
  {
    title: "Die Kähne",
    text: "Vom Hafen Lübbenau starten täglich die traditionellen Spreewaldkähne. Drei Stunden durch das UNESCO-Biosphärenreservat — ohne Motor, mit Schilf und Stille.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Die Wege",
    text: "Über 400 km Radwege führen durch die Region. Unsere Fahrräder stehen für Sie bereit, Tourentipps liegen in jeder Wohnung aus.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Der Tisch",
    text: "Gurken, Leinöl, frischer Fisch, sorbische Hochzeitssuppe — die Spreewaldküche ist bodenständig und überraschend. Wir haben unsere Lieblingsadressen notiert.",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1400&q=80",
  },
];

export function Location() {
  return (
    <section id="umgebung" className="py-20 md:py-28 border-t border-ink/10 scroll-mt-24">
      <div className="container">
        <div className="max-w-3xl mb-14 md:mb-20">
          <div className="eyebrow mb-4">Die Umgebung</div>
          <h2 className="font-display text-display-lg leading-[1.02]">
            Zwischen Wasser,<br />
            <span className="italic text-moss-600">Wald und Wegen.</span>
          </h2>
          <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">
            Der Spreewald ist ein UNESCO-Biosphärenreservat. Weniger als 90 Minuten
            von Berlin entfernt — und doch eine andere Welt.
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {highlights.map((h) => (
            <article
              key={h.title}
              className="group bg-cream/60 rounded-sm overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={h.image}
                  alt={h.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-display text-2xl mb-3">{h.title}</h3>
                <p className="text-sm text-ink/75 leading-relaxed">{h.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Map */}
        <div className="mt-16 md:mt-20">
          <div className="eyebrow mb-4">Wo wir sind</div>
          <h3 className="font-display text-2xl md:text-3xl mb-3 leading-tight">
            Musterstadt —{" "}
            <span className="italic text-moss-600">mitten im Biosphärenreservat</span>.
          </h3>
          <p className="text-ink/65 text-sm mb-6 max-w-xl">
            Musterstraße 1 · 12345 Musterstadt. Klicken Sie auf den Marker für
            die Routenplanung.
          </p>

          <div className="relative overflow-hidden rounded-sm border border-ink/10 shadow-[0_1px_3px_rgba(28,38,32,0.04),0_4px_16px_rgba(28,38,32,0.05)]">
            <SpreeMap />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-ink/8 rounded-sm" />
          </div>

          {/* Address cards */}
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div className="flex items-start justify-between gap-4 bg-cream/60 border border-ink/10 rounded-sm px-5 py-4">
              <div>
                <div className="eyebrow mb-1">Ferienzeit</div>
                <div className="font-display text-lg leading-tight">Musterstraße 1</div>
                <div className="text-sm text-ink/65 mt-1">12345 Musterstadt</div>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=51.7753,14.0966"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs text-moss-700 border border-moss-300 px-3 py-1.5 rounded-full hover:bg-moss-50 transition-colors mt-1"
              >
                Route →
              </a>
            </div>
            <div className="flex items-start justify-between gap-4 bg-cream/60 border border-ink/10 rounded-sm px-5 py-4">
              <div>
                <div className="eyebrow mb-1">Anfahrt</div>
                <div className="font-display text-lg leading-tight">Berlin → Musterstadt</div>
                <div className="text-sm text-ink/65 mt-1">ca. 90 Min · A13 Richtung Cottbus</div>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=51.7753,14.0966"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs text-moss-700 border border-moss-300 px-3 py-1.5 rounded-full hover:bg-moss-50 transition-colors mt-1"
              >
                Route →
              </a>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10 bg-moss-800 text-parchment rounded-sm">
          <div>
            <div className="eyebrow !text-parchment/60 mb-2">Bereit?</div>
            <h3 className="font-display text-2xl md:text-3xl leading-tight">
              Fragen Sie unverbindlich an —<br className="hidden md:block" />
              wir melden uns innerhalb von 24 Stunden.
            </h3>
          </div>
          <Link
            href="/anfrage"
            className="inline-flex items-center gap-2 bg-parchment text-ink px-7 py-3.5 rounded-full text-sm hover:bg-cream transition-colors shrink-0"
          >
            Zur Anfrage
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
