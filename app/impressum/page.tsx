import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <div className="eyebrow mb-4">Rechtliches</div>
        <h1 className="font-display text-display-lg mb-10 leading-[1.02]">
          Impressum
        </h1>
        <div className="text-ink/85 space-y-6 leading-relaxed">
          <h2 className="font-display text-2xl mt-6 mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            Familie Musterfrau<br />
            Hauptstraße 12<br />
            12345 Musterstadt<br />
            Deutschland
          </p>

          <h2 className="font-display text-2xl mt-8 mb-2">Kontakt</h2>
          <p>
            Telefon: +49 (0)0000 000000<br />
            E-Mail: <a href="mailto:hallo@ferienzeit.example" className="link-underline">hallo@ferienzeit.example</a>
          </p>

          <h2 className="font-display text-2xl mt-8 mb-2">Umsatzsteuer-ID</h2>
          <p>
            Gemäß §27 a Umsatzsteuergesetz:<br />
            DE000000000
          </p>

          <h2 className="font-display text-2xl mt-8 mb-2">Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht bereit oder verpflichtet, an einem Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <p className="text-xs text-ink/50 pt-10">
            Platzhalter — bitte vor Veröffentlichung anpassen.
          </p>
        </div>
      </div>
    </div>
  );
}
