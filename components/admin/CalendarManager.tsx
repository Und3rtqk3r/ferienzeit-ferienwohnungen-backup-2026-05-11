"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Input, Label, Textarea, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ApartmentLite {
  id: string;
  slug: string;
  name: string;
}

export interface BlockRow {
  id: string;
  apartmentId: string;
  apartmentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  source: string;
  note: string | null;
}

export function CalendarManager({
  apartments,
  blocks,
}: {
  apartments: ApartmentLite[];
  blocks: BlockRow[];
}) {
  const router = useRouter();

  const [apartmentId, setApartmentId] = useState(apartments[0]?.id ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState<"manual" | "maintenance" | "booking">("manual");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // iCal sync state
  const [icalApartmentId, setIcalApartmentId] = useState(apartments[0]?.id ?? "");
  const [icalUrl, setIcalUrl] = useState("");
  const [icalSource, setIcalSource] = useState<"airbnb" | "booking">("airbnb");
  const [icalSyncing, setIcalSyncing] = useState(false);
  const [icalMessage, setIcalMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apartmentId, startDate, endDate, note, reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Konnte Zeitraum nicht sperren.");
      }
      setStartDate("");
      setEndDate("");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: string) {
    if (!confirm("Zeitraum freigeben?")) return;
    const res = await fetch(`/api/admin/blocks/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function syncIcal(e: React.FormEvent) {
    e.preventDefault();
    if (!icalUrl.trim()) return;
    setIcalSyncing(true);
    setIcalMessage(null);
    try {
      const res = await fetch("/api/admin/sync-ical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apartmentId: icalApartmentId, icalUrl: icalUrl.trim(), source: icalSource }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Synchronisation fehlgeschlagen.");
      setIcalMessage({
        kind: "ok",
        text: `✓ ${data.imported} Buchungen importiert, ${data.deleted} alte entfernt.`,
      });
      setIcalUrl("");
      router.refresh();
    } catch (err) {
      setIcalMessage({ kind: "err", text: err instanceof Error ? err.message : "Fehler." });
    } finally {
      setIcalSyncing(false);
    }
  }

  return (
    <div className="grid md:grid-cols-12 gap-10">
      {/* Formular */}
      <form onSubmit={onSubmit} className="md:col-span-5 bg-cream border border-ink/10 rounded-sm p-6 md:p-8 space-y-6 h-fit">
        <div>
          <h2 className="font-display text-2xl">Zeitraum sperren</h2>
          <p className="text-sm text-ink/60 mt-1">
            Für externe Buchungen, eigene Nutzung oder Wartung.
          </p>
        </div>

        <div>
          <Label htmlFor="apartment">Wohnung</Label>
          <select
            id="apartment"
            value={apartmentId}
            onChange={(e) => setApartmentId(e.target.value)}
            className="w-full bg-transparent border-b border-ink/25 focus:border-ink py-2.5 focus:outline-none"
          >
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Von</Label>
            <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="end">Bis</Label>
            <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Grund</Label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as typeof reason)}
            className="w-full bg-transparent border-b border-ink/25 focus:border-ink py-2.5 focus:outline-none"
          >
            <option value="manual">Manuell gesperrt</option>
            <option value="booking">Externe Buchung</option>
            <option value="maintenance">Wartung / Pflege</option>
          </select>
        </div>

        <div>
          <Label htmlFor="note">Notiz (optional)</Label>
          <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <FieldError message={error ?? undefined} />

        <Button type="submit" size="lg" disabled={saving} className="w-full">
          {saving ? "Wird gespeichert…" : "Zeitraum sperren"}
        </Button>
      </form>

      {/* Liste */}
      <div className="md:col-span-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Gesperrte Zeiträume</h2>
          <span className="text-xs text-ink/50">{blocks.length} gesamt</span>
        </div>

        {blocks.length === 0 ? (
          <div className="bg-cream border border-ink/10 rounded-sm p-10 text-center text-ink/55">
            Keine gesperrten Zeiträume.
          </div>
        ) : (
          <ul className="space-y-2">
            {blocks.map((b) => (
              <li
                key={b.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border border-ink/10 bg-cream rounded-sm px-5 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{b.apartmentName}</span>
                    <span className="text-xs uppercase tracking-wider text-ink/50 bg-ink/5 px-2 py-0.5 rounded">
                      {b.reason === "booking"
                        ? "Buchung"
                        : b.reason === "maintenance"
                        ? "Wartung"
                        : "Manuell"}
                    </span>
                    {b.source !== "manual" && (
                      <span className="text-xs uppercase tracking-wider text-moss-700 bg-moss-50 px-2 py-0.5 rounded">
                        {b.source}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-ink/70 mt-1">
                    {formatDate(b.startDate)} – {formatDate(b.endDate)}
                    {b.note && <span className="text-ink/50"> · {b.note}</span>}
                  </div>
                </div>
                <button
                  onClick={() => removeBlock(b.id)}
                  className="text-sm px-3 py-1.5 rounded-full hover:bg-red-50 text-red-700 shrink-0"
                >
                  Freigeben
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* iCal Sync */}
      <div className="md:col-span-12 mt-2">
        <div className="bg-moss-50 border border-moss-200 rounded-sm p-6 md:p-8">
          <h2 className="font-display text-2xl mb-1">iCal-Synchronisation</h2>
          <p className="text-sm text-ink/60 mb-6">
            Fügen Sie den iCal-Link Ihres Airbnb- oder Booking.com-Inserats ein. Alle bisherigen
            Buchungen dieser Quelle werden ersetzt. Den Link finden Sie in Airbnb unter{" "}
            <strong>Kalender → Verfügbarkeit exportieren</strong> und in Booking.com unter{" "}
            <strong>Kalender → iCal-Export</strong>.
          </p>

          <form onSubmit={syncIcal} className="grid md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <Label htmlFor="ical-apartment">Wohnung</Label>
              <select
                id="ical-apartment"
                value={icalApartmentId}
                onChange={(e) => setIcalApartmentId(e.target.value)}
                className="w-full bg-transparent border-b border-ink/25 focus:border-ink py-2.5 focus:outline-none"
              >
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="ical-source">Plattform</Label>
              <select
                id="ical-source"
                value={icalSource}
                onChange={(e) => setIcalSource(e.target.value as "airbnb" | "booking")}
                className="w-full bg-transparent border-b border-ink/25 focus:border-ink py-2.5 focus:outline-none"
              >
                <option value="airbnb">Airbnb</option>
                <option value="booking">Booking.com</option>
              </select>
            </div>

            <div className="md:col-span-5">
              <Label htmlFor="ical-url">iCal-URL</Label>
              <Input
                id="ical-url"
                type="url"
                placeholder="https://www.airbnb.de/calendar/ical/…"
                value={icalUrl}
                onChange={(e) => setIcalUrl(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={icalSyncing} className="w-full">
                {icalSyncing ? "Synchronisiert…" : "Jetzt synchronisieren"}
              </Button>
            </div>
          </form>

          {icalMessage && (
            <p className={`mt-3 text-sm ${icalMessage.kind === "ok" ? "text-moss-700" : "text-red-700"}`}>
              {icalMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
