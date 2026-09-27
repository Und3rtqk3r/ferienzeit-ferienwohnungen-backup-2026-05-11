import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  apartmentId: z.string().min(1),
  icalUrl: z.string().url(),
  source: z.enum(["airbnb", "booking"]),
});

/** Minimal iCal parser for Airbnb / Booking.com VCALENDAR feeds. */
function parseIcal(text: string) {
  // Unfold continuation lines (RFC 5545 §3.1)
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);

  const events: Array<{ uid: string; start: Date; end: Date }> = [];
  let inEvent = false;
  let uid = "";
  let start: Date | null = null;
  let end: Date | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      uid = "";
      start = null;
      end = null;
      continue;
    }
    if (line === "END:VEVENT") {
      inEvent = false;
      if (uid && start && end && end > start) {
        events.push({ uid, start, end });
      }
      continue;
    }
    if (!inEvent) continue;

    // Split on first colon, ignoring property params like ;VALUE=DATE
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const propFull = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1).trim();
    const prop = propFull.split(";")[0].toUpperCase();

    if (prop === "DTSTART" || prop === "DTEND") {
      const parsed = parseIcalDate(value);
      if (parsed) {
        if (prop === "DTSTART") start = parsed;
        else end = parsed;
      }
    } else if (prop === "UID") {
      uid = value;
    }
  }

  return events;
}

function parseIcalDate(value: string): Date | null {
  // DATE: YYYYMMDD
  // DATETIME: YYYYMMDDTHHMMSSz or YYYYMMDDTHHMMSSZz
  const digits = value.replace(/[TZ]/g, "").slice(0, 8);
  if (digits.length < 8) return null;
  const y = parseInt(digits.slice(0, 4));
  const m = parseInt(digits.slice(4, 6)) - 1;
  const d = parseInt(digits.slice(6, 8));
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(Date.UTC(y, m, d));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const { apartmentId, icalUrl, source } = parsed.data;

  // Verify apartment exists
  const apartment = await prisma.apartment.findUnique({ where: { id: apartmentId } });
  if (!apartment) {
    return NextResponse.json({ error: "Wohnung nicht gefunden." }, { status: 404 });
  }

  // Fetch the iCal feed
  let icalText: string;
  try {
    const res = await fetch(icalUrl, {
      headers: { "User-Agent": "Ferienzeit-CalSync/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    icalText = await res.text();
  } catch (err) {
    return NextResponse.json(
      { error: `Kalender konnte nicht geladen werden: ${err instanceof Error ? err.message : "Unbekannt"}` },
      { status: 502 }
    );
  }

  const events = parseIcal(icalText);

  // Delete all previous blocks from this source for this apartment
  const deleted = await prisma.block.deleteMany({
    where: { apartmentId, source },
  });

  // Insert new blocks
  if (events.length > 0) {
    await prisma.block.createMany({
      data: events.map((e) => ({
        apartmentId,
        startDate: e.start,
        endDate: e.end,
        reason: "booking",
        source,
        note: `iCal-Import (${source}) · UID: ${e.uid.slice(0, 40)}`,
      })),
    });
  }

  return NextResponse.json({
    ok: true,
    deleted: deleted.count,
    imported: events.length,
  });
}
