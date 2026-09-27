import Image from "next/image";
import Link from "next/link";
import type { Apartment } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ApartmentPreview({
  apartments,
}: {
  apartments: Apartment[];
}) {
  return (
    <section id="wohnungen" className="py-20 md:py-28 border-t border-ink/10 scroll-mt-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="eyebrow mb-4">Unsere Wohnungen</div>
            <h2 className="font-display text-display-lg max-w-2xl leading-[1.02]">
              Zwei Orte, an die man<br className="hidden md:inline" />{" "}
              <span className="italic text-moss-600">gerne zurückkehrt</span>.
            </h2>
          </div>
          <p className="text-ink/65 max-w-sm text-sm md:text-base">
            Jedes Haus hat seine eigene Geschichte — wählen Sie, was für Ihre
            nächste Auszeit passt.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {apartments.map((apt, i) => {
            const isEven = i % 2 === 0;
            const hasPlatforms = apt.airbnbUrl || apt.bookingUrl;
            return (
              <article
                key={apt.id}
                className="grid md:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                <Link
                  href={`/wohnungen/${apt.slug}`}
                  className={`md:col-span-7 relative aspect-[4/3] overflow-hidden rounded-sm group ${
                    isEven ? "" : "md:col-start-6"
                  }`}
                >
                  <Image
                    src={apt.images[0] ?? ""}
                    alt={apt.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-5 left-5 bg-parchment/90 backdrop-blur-sm text-ink px-3 py-1 text-xs font-medium rounded-full">
                    0{i + 1} / 0{apartments.length}
                  </div>
                </Link>

                <div
                  className={`md:col-span-5 ${
                    isEven ? "md:col-start-8" : "md:col-start-1 md:row-start-1"
                  }`}
                >
                  <div className="eyebrow mb-3">{apt.tagline}</div>
                  <h3 className="font-display text-4xl md:text-5xl mb-5 leading-none">
                    {apt.name}
                  </h3>
                  <p className="text-ink/75 leading-relaxed mb-6">
                    {apt.shortDescription}
                  </p>

                  <dl className="grid grid-cols-3 gap-4 py-5 border-y border-ink/10 text-sm">
                    <div>
                      <dt className="eyebrow mb-1">Gäste</dt>
                      <dd className="font-display text-xl">
                        bis {apt.maxGuests}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1">Größe</dt>
                      <dd className="font-display text-xl">{apt.sizeSqm} m²</dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1">ab</dt>
                      <dd className="font-display text-xl">
                        {formatPrice(apt.priceFrom)}
                        <span className="text-sm text-ink/50">/Nacht</span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={`/wohnungen/${apt.slug}`}
                      className="inline-flex items-center gap-2 bg-ink text-parchment px-6 py-3 rounded-full text-sm hover:bg-moss-700 transition-colors"
                    >
                      Wohnung ansehen
                      <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={`/anfrage?wohnung=${apt.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition"
                    >
                      Direkt anfragen
                    </Link>
                  </div>

                  {hasPlatforms && (
                    <div className="mt-5 flex items-center gap-3 text-xs text-ink/45">
                      <span>Auch auf</span>
                      {apt.airbnbUrl && (
                        <a
                          href={apt.airbnbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink/60 hover:text-ink transition underline underline-offset-2"
                        >
                          Airbnb
                        </a>
                      )}
                      {apt.airbnbUrl && apt.bookingUrl && <span className="text-ink/25">·</span>}
                      {apt.bookingUrl && (
                        <a
                          href={apt.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink/60 hover:text-ink transition underline underline-offset-2"
                        >
                          Booking.com
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
