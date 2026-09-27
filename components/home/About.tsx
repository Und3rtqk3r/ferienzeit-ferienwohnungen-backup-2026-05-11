export function About() {
  return (
    <section className="py-20 md:py-28 border-t border-ink/10">
      <div className="container grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-4">
          <div className="eyebrow mb-4">Über uns</div>
          <h2 className="font-display text-display-md">
            Zwei Häuser,<br />
            <span className="italic text-moss-600">eine Haltung.</span>
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-6 space-y-6 text-ink/80 leading-relaxed">
          <p className="text-lg">
            Wir vermieten keine Hotelzimmer und führen keine Rezeption. Was wir anbieten,
            sind zwei Wohnungen, die wir selbst bewohnen würden — und manchmal tun.
          </p>
          <p>
            Kahnblick liegt am Hafen von Lübbenau, Erlenhof steht unter den alten Bäumen
            in Burg. Beide sind verschieden, beide sind still. Beide sind gedacht für
            Menschen, die lieber einen Tag länger bleiben als einen schneller weiter.
          </p>
          <figure className="pt-4 border-t border-ink/10 mt-10">
            <blockquote className="font-display text-2xl md:text-3xl leading-tight italic text-moss-700">
              „Wir glauben, dass ein gutes Frühstück länger dauern darf als eine
              Vorstandssitzung."
            </blockquote>
            <figcaption className="mt-4 text-sm text-ink/55">
              — Familie Musterfrau, Gastgeber
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
