import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inquirySchema } from "@/lib/validations";
import { sendInquiryMails } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Bitte prüfen Sie Ihre Eingaben.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Honeypot: wenn `website` gefüllt ist, ist es vermutlich ein Bot.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { apartmentSlug, arrival, departure, guests, name, email, phone, message } =
    parsed.data;

  const apartment = await prisma.apartment.findUnique({
    where: { slug: apartmentSlug },
  });
  if (!apartment) {
    return NextResponse.json({ error: "Wohnung nicht gefunden." }, { status: 404 });
  }

  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  if (guests > apartment.maxGuests) {
    return NextResponse.json(
      { error: `Für diese Wohnung sind maximal ${apartment.maxGuests} Personen möglich.` },
      { status: 400 }
    );
  }

  // Hinweis: wir blockieren eine Anfrage NICHT, nur weil die Zeit schon belegt ist —
  // der Gast bekommt ggf. eine Absage, und der Vermieter sieht alles im Admin.
  // Aber wir markieren im Memo-Feld nichts — Vermieter entscheidet.

  const inquiry = await prisma.inquiry.create({
    data: {
      apartmentId: apartment.id,
      arrival: arrivalDate,
      departure: departureDate,
      guests,
      name,
      email,
      phone: phone || null,
      message: message || "",
      status: "new",
    },
  });

  // Mails senden — Fehler dürfen den Erfolg nicht verhindern
  try {
    await sendInquiryMails({
      apartmentName: apartment.name,
      arrival: arrivalDate,
      departure: departureDate,
      guests,
      name,
      email,
      phone,
      message,
      inquiryId: inquiry.id,
    });
  } catch (err) {
    console.error("Mailversand fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
}
