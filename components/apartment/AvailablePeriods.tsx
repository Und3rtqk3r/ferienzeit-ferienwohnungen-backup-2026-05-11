"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

interface Period {
  start: string;
  end: string;
  nights: number;
}

function formatRange(start: string, end: string) {
  const s = parseISO(start);
  const e = parseISO(end);
  return {
    startLabel: format(s, "EEE, d. MMM", { locale: de }),
    endLabel: format(e, "EEE, d. MMM yyyy", { locale: de }),
  };
}

export function AvailablePeriods({ slug }: { slug: string }) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/available-periods/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setPeriods(data.periods ?? []);
      })
      .catch(() => {
        if (!cancelled) setPeriods([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <section className="mt-16 md:mt-20">
        <div className="eyebrow mb-4">Mögliche Reisen</div>
        <div className="h-40 flex items-center justify-center text-ink/40 text-sm">
          Wird geladen…
        </div>
      </section>
    );
  }

  if (periods.length === 0) {
    return (
      <section className="mt-16 md:mt-20">
        <div className="eyebrow mb-4">Mögliche Reisen</div>
        <p className="text-ink/60 text-sm">
          Im Moment keine vorberechneten Zeiträume verfügbar. Bitte direkt anfragen.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 md:mt-20">
      <div className="eyebrow mb-4">Mögliche Reisen</div>
      <h2 className="font-display text-3xl md:text-4xl mb-3 leading-tight">
        Diese Zeiträume sind noch frei.
      </h2>
      <p className="text-ink/65 max-w-xl mb-8">
        Alle Vorschläge sind 7 Nächte — klicken Sie auf einen, um das Anfrageformular direkt
        mit diesem Zeitraum zu befüllen.
      </p>

      <ul className="grid sm:grid-cols-2 gap-3">
        {periods.map((p) => {
          const { startLabel, endLabel } = formatRange(p.start, p.end);
          const href = `/anfrage?wohnung=${slug}&arrival=${p.start}&departure=${p.end}`;
          return (
            <li key={p.start}>
              <Link
                href={href}
                className="group flex items-center justify-between border border-ink/12 bg-cream/60 hover:bg-cream hover:border-ink/25 hover:shadow-card rounded-sm px-5 py-4 transition-all duration-200"
              >
                <div>
                  <div className="font-display text-xl leading-tight">
                    {startLabel}
                    <span className="text-ink/35 mx-2 font-sans text-base">→</span>
                    {endLabel}
                  </div>
                  <div className="text-xs text-ink/50 mt-1">{p.nights} Nächte</div>
                </div>
                <span className="text-xs text-moss-600 font-medium opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-4">
                  Anfragen →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
