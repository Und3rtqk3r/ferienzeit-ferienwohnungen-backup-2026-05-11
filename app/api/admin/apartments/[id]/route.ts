import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apartmentUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = apartmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige Eingabe.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const updated = await prisma.apartment.update({
      where: { id: params.id },
      data: {
        name: data.name,
        tagline: data.tagline,
        shortDescription: data.shortDescription,
        description: data.description,
        priceFrom: data.priceFrom,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        sizeSqm: data.sizeSqm,
        features: JSON.stringify(data.features),
        images: JSON.stringify(data.images),
        airbnbUrl: data.airbnbUrl || null,
        bookingUrl: data.bookingUrl || null,
        published: data.published,
      },
    });
    return NextResponse.json({ ok: true, apartment: updated });
  } catch {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
}
