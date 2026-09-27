import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { Gallery } from "@/components/apartment/Gallery";
import { Features } from "@/components/apartment/Features";
import { AvailabilityCalendar } from "@/components/apartment/AvailabilityCalendar";
import { BookingPlatforms } from "@/components/apartment/BookingPlatforms";
import { AvailablePeriods } from "@/components/apartment/AvailablePeriods";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const apt = await prisma.apartment.findUnique({ where: { slug: params.slug } });
  if (!apt) return { title: "Wohnung nicht gefunden" };
  return {
    title: `${apt.name} — ${apt.tagline}`,
    description: apt.shortDescription,
  };
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const row = await prisma.apartment.findUnique({ where: { slug: params.slug } });
  if (!row || !row.published) notFound();

  const apartment = {
    ...row,
    features: parseJsonArray<string>(row.features),
    images: parseJsonArray<string>(row.images),
  };

  return (
    <article className="pt-4 md:pt-8 pb-20">
      <div className="container">
        {/* Brotkrümel */}
        <nav className="mb-8 text-xs text-ink/60">
          <Link href="/" className="link-underline">Start</Link>
          <span className="mx-2 text-ink/30">/</span>
          <Link href="/#wohnungen" className="link-underline">Wohnungen</Link>
          <span className="mx-2 text-ink/30">/</span>
          <span className="text-ink/80">{apartment.name}</span>
        </nav>

        {/* Titelblock */}
        <header className="grid md:grid-cols-12 gap-8 mb-10 md:mb-16 items-end">
          <div className="md:col-span-7">
            <div className="eyebrow mb-3">{apartment.tagline}</div>
            <h1 className="font-display text-display-lg leading-[0.98]">
              {apartment.name}
            </h1>
          </div>
          <dl className="md:col-span-5 grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-ink/10 md:pl-8 pt-6 md:pt-0">
            <div>
              <dt className="eyebrow mb-1">Gäste</dt>
              <dd className="font-display text-xl">bis {apartment.maxGuests}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Größe</dt>
              <dd className="font-display text-xl">{apartment.sizeSqm} m²</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">ab</dt>
              <dd className="font-display text-xl">
                {formatPrice(apartment.priceFrom)}
                <span className="text-xs text-ink/50">/Nacht</span>
              </dd>
            </div>
          </dl>
        </header>

        {/* Galerie */}
        <Gallery images={apartment.images} alt={apartment.name} />

        {/* Beschreibung + Sticky-CTA */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <div className="eyebrow mb-4">Die Wohnung</div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
              {apartment.shortDescription}
            </h2>
            <p className="text-ink/80 leading-relaxed whitespace-pre-line">
              {apartment.description}
            </p>

            <Features features={apartment.features} />
            <AvailablePeriods slug={apartment.slug} />
            <AvailabilityCalendar slug={apartment.slug} />
          </div>

          {/* Sticky Anfrage-Box */}
          <aside className="md:col-span-5 md:col-start-9">
            <div className="md:sticky md:top-28 bg-cream rounded-sm p-7 md:p-8 border border-ink/10">
              <div className="flex items-baseline justify-between gap-2 mb-5">
                <div>
                  <div className="eyebrow">Ab</div>
                  <div className="font-display text-3xl">
                    {formatPrice(apartment.priceFrom)}
                  </div>
                </div>
                <div className="text-right text-xs text-ink/55">
                  pro Nacht<br />inkl. Nebenkosten
                </div>
              </div>

              <BookingPlatforms
                airbnbUrl={apartment.airbnbUrl}
                bookingUrl={apartment.bookingUrl}
                className="mb-5"
              />

              {(apartment.airbnbUrl || apartment.bookingUrl) && (
                <div className="flex items-center gap-3 my-5">
                  <span className="flex-1 h-px bg-ink/10" />
                  <span className="text-[11px] text-ink/40 uppercase tracking-widest">oder direkt</span>
                  <span className="flex-1 h-px bg-ink/10" />
                </div>
              )}

              <p className="text-sm text-ink/70 leading-relaxed mb-4">
                Senden Sie uns Ihren Wunsch­zeitraum — wir melden uns in der Regel
                innerhalb von 24 Stunden. Ohne Provision.
              </p>

              <Link
                href={`/anfrage?wohnung=${apartment.slug}`}
                className="flex items-center justify-center w-full bg-ink text-parchment px-6 py-4 rounded-full text-sm hover:bg-moss-700 transition-colors"
              >
                Anfrage senden →
              </Link>

              <p className="mt-4 text-[11px] text-ink/50 text-center">
                Unverbindlich · keine Vorabzahlung · keine Provision
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
