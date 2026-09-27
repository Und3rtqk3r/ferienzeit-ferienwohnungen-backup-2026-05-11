"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate, nightsBetween } from "@/lib/utils";
import type { InquiryStatus } from "@/types";
import { INQUIRY_STATUS_LABELS } from "@/types";

export interface InquiryRowData {
  id: string;
  apartmentName: string;
  arrival: string;
  departure: string;
  guests: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

const statusClasses: Record<InquiryStatus, string> = {
  new: "bg-moss-500 text-parchment",
  read: "bg-ink/10 text-ink",
  confirmed: "bg-moss-700 text-parchment",
  declined: "bg-red-100 text-red-800",
  archived: "bg-ink/5 text-ink/60",
};

export function InquiryRow({ inquiry }: { inquiry: InquiryRowData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  async function updateStatus(next: InquiryStatus) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setStatus(next);
      startTransition(() => router.refresh());
    } catch {
      alert("Konnte Status nicht speichern.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Anfrage wirklich löschen? Das kann nicht rückgängig gemacht werden.")) return;
    const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  const nights = nightsBetween(inquiry.arrival, inquiry.departure);

  return (
    <li className="border border-ink/10 rounded-sm bg-cream overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full grid md:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 text-left hover:bg-ink/[0.02] transition"
      >
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium ${statusClasses[status]}`}
        >
          {INQUIRY_STATUS_LABELS[status]}
        </span>
        <div className="min-w-0">
          <div className="font-medium truncate">{inquiry.name}</div>
          <div className="text-xs text-ink/60 truncate">
            {inquiry.apartmentName} · {inquiry.guests} Gäste · {nights} Nächte
          </div>
        </div>
        <div className="hidden md:block text-sm text-ink/70">
          {formatDate(inquiry.arrival)} – {formatDate(inquiry.departure)}
        </div>
        <div className="hidden md:block text-xs text-ink/50 tabular-nums">
          {formatDate(inquiry.createdAt)}
        </div>
        <span className="text-ink/40" aria-hidden>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="border-t border-ink/10 px-5 py-5 bg-parchment/50 grid md:grid-cols-2 gap-6">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="eyebrow mb-0.5">E-Mail</dt>
              <dd>
                <a href={`mailto:${inquiry.email}`} className="link-underline">
                  {inquiry.email}
                </a>
              </dd>
            </div>
            {inquiry.phone && (
              <div>
                <dt className="eyebrow mb-0.5">Telefon</dt>
                <dd>{inquiry.phone}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow mb-0.5">Zeitraum</dt>
              <dd>
                {formatDate(inquiry.arrival)} – {formatDate(inquiry.departure)} ({nights} N)
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-0.5">Eingegangen</dt>
              <dd>{formatDate(inquiry.createdAt)}</dd>
            </div>
          </dl>

          <div>
            <div className="eyebrow mb-2">Nachricht</div>
            <p className="whitespace-pre-line text-sm text-ink/85 leading-relaxed">
              {inquiry.message || <span className="text-ink/40">(keine Nachricht)</span>}
            </p>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-ink/10">
            <div className="flex items-center gap-3">
              <label className="eyebrow">Status</label>
              <select
                value={status}
                disabled={saving || pending}
                onChange={(e) => updateStatus(e.target.value as InquiryStatus)}
                className="bg-transparent border-b border-ink/25 focus:border-ink py-1.5 text-sm focus:outline-none"
              >
                {(Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[]).map((s) => (
                  <option key={s} value={s}>{INQUIRY_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Ihre Anfrage — " + inquiry.apartmentName)}`}
                className="px-4 py-2 text-sm rounded-full border border-ink/20 hover:bg-ink/5"
              >
                Antworten
              </a>
              <button
                onClick={remove}
                className="px-4 py-2 text-sm rounded-full text-red-700 hover:bg-red-50"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
