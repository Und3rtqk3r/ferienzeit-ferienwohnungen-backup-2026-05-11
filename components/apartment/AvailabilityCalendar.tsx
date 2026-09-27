"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/src/style.css";
import { de } from "date-fns/locale";

interface BlockRange {
  from: Date;
  to: Date;
}

export function AvailabilityCalendar({ slug }: { slug: string }) {
  const [blocks, setBlocks] = useState<BlockRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/availability/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { blocks: { start: string; end: string }[] };
        if (cancelled) return;
        setBlocks(
          data.blocks.map((b) => ({
            from: new Date(b.start),
            to: new Date(b.end),
          }))
        );
      } catch {
        if (!cancelled) setBlocks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="mt-16 md:mt-20">
      <div className="eyebrow mb-4">Verfügbarkeit</div>
      <h2 className="font-display text-3xl md:text-4xl mb-3 leading-tight">
        Wann darf es losgehen?
      </h2>
      <p className="text-ink/65 max-w-xl mb-8">
        Durchgestrichene Tage sind bereits belegt. Die Belegung berücksichtigt
        auch Buchungen über Airbnb und Booking.com.
      </p>

      <div className="bg-cream border border-ink/8 rounded-sm p-4 md:p-8 overflow-x-auto shadow-[0_1px_3px_rgba(28,38,32,0.04),0_4px_16px_rgba(28,38,32,0.05)]">
        {loading ? (
          <div className="h-[320px] flex items-center justify-center text-ink/40 text-sm">
            Belegung wird geladen…
          </div>
        ) : (
          <DayPicker
            mode="range"
            locale={de}
            numberOfMonths={2}
            weekStartsOn={1}
            disabled={[{ before: today }, ...blocks]}
            fromMonth={today}
            showOutsideDays={false}
            className="mx-auto"
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-5 text-xs text-ink/55">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-moss-500 rounded-sm" />
          ausgewählter Zeitraum
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-stone-soft rounded-sm" style={{ textDecoration: "line-through" }} />
          belegt
        </span>
      </div>
    </section>
  );
}
