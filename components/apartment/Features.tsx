export function Features({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20">
      <div className="eyebrow mb-4">Ausstattung</div>
      <h2 className="font-display text-3xl md:text-4xl mb-8 leading-tight">
        Alles da, nichts zu viel.
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 py-2 border-b border-ink/10 text-ink/80"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 rounded-full bg-moss-500 shrink-0"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
