import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const apartment = await prisma.apartment.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!apartment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Wir geben nur zukünftige & heute aktive Blöcke zurück.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blocks = await prisma.block.findMany({
    where: {
      apartmentId: apartment.id,
      endDate: { gte: today },
    },
    select: { startDate: true, endDate: true },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(
    {
      blocks: blocks.map((b) => ({
        start: b.startDate.toISOString(),
        end: b.endDate.toISOString(),
      })),
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
