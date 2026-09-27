import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blockSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige Eingabe.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { apartmentId, startDate, endDate, note, reason } = parsed.data;

  const apt = await prisma.apartment.findUnique({ where: { id: apartmentId } });
  if (!apt) {
    return NextResponse.json({ error: "Wohnung nicht gefunden." }, { status: 404 });
  }

  const block = await prisma.block.create({
    data: {
      apartmentId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      note: note || null,
      reason,
      source: "manual",
    },
  });

  return NextResponse.json({ ok: true, block }, { status: 201 });
}
