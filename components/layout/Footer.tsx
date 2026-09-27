"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 md:mt-32 border-t border-ink/10 bg-cream/60">
      <div className="container py-14 md:py-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-display text-3xl md:text-4xl leading-[1.05]">
            Zeit haben.<br />
            Luft holen.<br />
            <span className="italic text-moss-600">Bleiben.</span>
          </div>
          <p className="mt-6 text-ink/70 max-w-md text-sm md:text-base leading-relaxed">
            Zwei private Ferienwohnungen im Spreewald. Keine Rezeption, keine Masse —
            nur Sie, das Wasser und die Bäume.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <div className="eyebrow mb-4">Kontakt</div>
          <address className="not-italic text-sm leading-relaxed text-ink/80">
            Ferienzeit<br />
            Familie Musterfrau<br />
            Hauptstraße 12<br />
            12345 Musterstadt
          </address>
          <div className="mt-4 text-sm text-ink/80">
            <a href="mailto:hallo@ferienzeit.example" className="link-underline">
              hallo@ferienzeit.example
            </a>
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-10">
          <div className="eyebrow mb-4">Information</div>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><Link href="/#wohnungen" className="link-underline">Die Wohnungen</Link></li>
            <li><Link href="/anfrage" className="link-underline">Anfrage senden</Link></li>
            <li><Link href="/datenschutz" className="link-underline">Datenschutz</Link></li>
            <li><Link href="/impressum" className="link-underline">Impressum</Link></li>
          </ul>

          <div className="mt-8">
            <div className="eyebrow mb-4">Buchungsplattformen</div>
            <ul className="space-y-2 text-sm text-ink/80">
              <li>
                <a
                  href="https://www.airbnb.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  Airbnb ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  Booking.com ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-ink/45">
          <span>© {year} Ferienzeit. Alle Rechte vorbehalten.</span>
          <span>Mit Sorgfalt gemacht im Spreewald.</span>
        </div>
      </div>
    </footer>
  );
}
