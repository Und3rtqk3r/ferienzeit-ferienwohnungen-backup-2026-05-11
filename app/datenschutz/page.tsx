import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <div className="eyebrow mb-4">Rechtliches</div>
        <h1 className="font-display text-display-lg mb-10 leading-[1.02]">
          Datenschutz
        </h1>
        <div className="max-w-none text-ink/85 space-y-6 leading-relaxed">
          <p>
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend
            informieren wir Sie über die Verarbeitung Ihrer Daten auf dieser Website.
          </p>

          <h2 className="font-display text-2xl mt-10 mb-3">1. Verantwortlich</h2>
          <p>
            Familie Musterfrau<br />
            Hauptstraße 12, 12345 Musterstadt<br />
            E-Mail: <a href="mailto:hallo@ferienzeit.example" className="link-underline">hallo@ferienzeit.example</a>
          </p>

          <h2 className="font-display text-2xl mt-10 mb-3">2. Anfrageformular</h2>
          <p>
            Wenn Sie uns über das Formular eine Anfrage senden, verarbeiten wir die von
            Ihnen angegebenen Daten (Name, E-Mail, optional Telefon, Reisedaten,
            Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage auf Grundlage von
            Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden bei uns gespeichert und nach
            Abschluss der Anfrage bzw. nach den steuerrechtlichen Aufbewahrungsfristen
            gelöscht.
          </p>

          <h2 className="font-display text-2xl mt-10 mb-3">3. Server-Logs</h2>
          <p>
            Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse,
            Zeitpunkt, Browser) temporär verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).
            Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
          </p>

          <h2 className="font-display text-2xl mt-10 mb-3">4. Cookies & Tracking</h2>
          <p>
            Diese Website setzt keine Marketing- oder Tracking-Cookies ein. Es werden
            lediglich technisch notwendige Cookies (Session) genutzt, soweit Sie sich
            als Administrator anmelden.
          </p>

          <h2 className="font-display text-2xl mt-10 mb-3">5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
            der Verarbeitung, Widerspruch und Datenübertragbarkeit. Wenden Sie sich
            hierfür an die oben genannte Adresse. Zudem können Sie sich bei einer
            Datenschutzaufsichtsbehörde beschweren.
          </p>

          <p className="text-xs text-ink/50 pt-10">
            Stand: {new Date().toLocaleDateString("de-DE")}. Diese Datenschutzerklärung
            ist ein Platzhalter — bitte vor Veröffentlichung rechtlich prüfen lassen.
          </p>
        </div>
      </div>
    </div>
  );
}
