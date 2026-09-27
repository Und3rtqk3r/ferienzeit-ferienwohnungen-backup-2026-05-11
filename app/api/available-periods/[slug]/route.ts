import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Period {
  start: string;
  end: string;
  nights: number;
}

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 180);

  // Fetch all blocks that overlap the window
  const rows = await prisma.block.findMany({
    where: {
      apartmentId: apartment.id,
      startDate: { lt: horizon },
      endDate: { gt: today },
    },
    select: { startDate: true, endDate: true },
    orderBy: { startDate: "asc" },
  });

  const blocks = rows.map((b) => ({
    from: new Date(b.startDate),
    to: new Date(b.endDate),
  }));

  // Walk forward from tomorrow, find free 7-night windows
  const DEFAULT_NIGHTS = 7;
  const MAX_SUGGESTIONS = 8;
  const suggestions: Period[] = [];

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow

  while (cursor < horizon && suggestions.length < MAX_SUGGESTIONS) {
    const tripEnd = new Date(cursor);
    tripEnd.setDate(tripEnd.getDate() + DEFAULT_NIGHTS);

    if (tripEnd > horizon) break;

    // Find any block that overlaps [cursor, tripEnd)
    const overlap = blocks.find((b) => cursor < b.to && tripEnd > b.from);

    if (!overlap) {
      suggestions.push({
        start: cursor.toISOString().slice(0, 10),
        end: tripEnd.toISOString().slice(0, 10),
        nights: DEFAULT_NIGHTS,
      });
      // Jump forward: end of this trip + small gap
      cursor.setDate(cursor.getDate() + DEFAULT_NIGHTS + 7);
    } else {
      // Jump past the blocking block
      cursor.setTime(overlap.to.getTime());
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return NextResponse.json({ periods: suggestions }, {
    headers: { "Cache-Control": "no-store" },
  });
}
