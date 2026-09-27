import { prisma } from "@/lib/db";
import { CalendarManager, type BlockRow } from "@/components/admin/CalendarManager";

export const dynamic = "force-dynamic";

export default async function AdminKalenderPage() {
  const apartments = await prisma.apartment.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, slug: true, name: true },
  });

  const blocks = await prisma.block.findMany({
    include: { apartment: { select: { name: true } } },
    orderBy: { startDate: "asc" },
  });

  const rows: BlockRow[] = blocks.map((b) => ({
    id: b.id,
    apartmentId: b.apartmentId,
    apartmentName: b.apartment.name,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    reason: b.reason,
    source: b.source,
    note: b.note,
  }));

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-10">
        <div className="eyebrow mb-2">Admin</div>
        <h1 className="font-display text-3xl md:text-4xl leading-tight">Kalender</h1>
        <p className="text-ink/60 text-sm mt-2">
          Zeiträume sperren oder freigeben. Für jede Wohnung getrennt.
        </p>
      </div>

      <CalendarManager apartments={apartments} blocks={rows} />
    </div>
  );
}
