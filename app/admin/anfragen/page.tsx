import { prisma } from "@/lib/db";
import { InquiryRow, type InquiryRowData } from "@/components/admin/InquiryRow";
import type { InquiryStatus } from "@/types";
import { INQUIRY_STATUS_LABELS } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { status?: string };
}

const FILTERS: Array<{ key: InquiryStatus | "all"; label: string }> = [
  { key: "all", label: "Alle" },
  { key: "new", label: "Neu" },
  { key: "read", label: "Gelesen" },
  { key: "confirmed", label: "Bestätigt" },
  { key: "declined", label: "Abgelehnt" },
  { key: "archived", label: "Archiviert" },
];

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const filter = (searchParams.status ?? "all") as InquiryStatus | "all";

  const inquiries = await prisma.inquiry.findMany({
    where: filter === "all" ? {} : { status: filter },
    include: { apartment: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const newCount = await prisma.inquiry.count({ where: { status: "new" } });

  const rows: InquiryRowData[] = inquiries.map((i) => ({
    id: i.id,
    apartmentName: i.apartment.name,
    arrival: i.arrival.toISOString(),
    departure: i.departure.toISOString(),
    guests: i.guests,
    name: i.name,
    email: i.email,
    phone: i.phone,
    message: i.message,
    status: i.status as InquiryStatus,
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <div className="container py-10 md:py-14">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <div className="eyebrow mb-2">Admin</div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">
            Anfragen
          </h1>
          <p className="text-ink/60 text-sm mt-2">
            {newCount > 0
              ? `${newCount} neue Anfrage${newCount === 1 ? "" : "n"} wartet auf Ihre Rückmeldung.`
              : "Alle Anfragen sind bearbeitet."}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const href = f.key === "all" ? "/admin/anfragen" : `/admin/anfragen?status=${f.key}`;
          return (
            <Link
              key={f.key}
              href={href}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition",
                active
                  ? "bg-ink text-parchment"
                  : "bg-cream border border-ink/15 text-ink/70 hover:border-ink/30"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="bg-cream border border-ink/10 rounded-sm p-12 text-center text-ink/55">
          Keine Anfragen in dieser Ansicht.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <InquiryRow key={row.id} inquiry={row} />
          ))}
        </ul>
      )}
    </div>
  );
}
