import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ------------------------------------------------------------------
  // Admin-Account anlegen (aus ENV; Passwort wird gehasht gespeichert)
  // ------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@ferienzeit.example";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "bitte-sofort-aendern";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });
  console.log(`✓ Admin: ${adminEmail}`);

  // ------------------------------------------------------------------
  // Wohnungen
  // ------------------------------------------------------------------
  const apartments = [
    {
      slug: "kahnblick",
      name: "Kahnblick",
      tagline: "Wohnen direkt am Fließ",
      shortDescription:
        "Helles Refugium mit Blick aufs Wasser — für alle, die Ruhe, Holz und Morgennebel mögen.",
      description:
        "Die Ferienwohnung Kahnblick liegt am Rand von Lübbenau, nur wenige Schritte vom Hafen entfernt. Große Fenster holen das Licht des Fließes ins Zimmer, geölte Eichendielen tragen durch alle Räume. Die Küche ist vollständig ausgestattet, der private Garten lädt zum Frühstück unter alten Obstbäumen. Der Kahnhafen, von dem die traditionellen Kahnfahrten starten, ist in fünf Gehminuten erreichbar.",
      priceFrom: 9500, // 95,00 €
      maxGuests: 4,
      bedrooms: 2,
      sizeSqm: 68,
      features: [
        "WLAN (kostenfrei)",
        "Voll ausgestattete Küche",
        "Kaffeemaschine & Siebträger",
        "Waschmaschine",
        "Privater Garten",
        "Fahrrad-Verleih vor Ort",
        "Nichtraucher",
        "Haustiere auf Anfrage",
      ],
      images: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1505692433770-36f19f51681d?auto=format&fit=crop&w=1800&q=80",
      ],
    },
    {
      slug: "erlenhof",
      name: "Erlenhof",
      tagline: "Stille unter alten Bäumen",
      shortDescription:
        "Traditionelles Spreewaldhaus, behutsam renoviert — mit Kachelofen, Leseecke und tiefem Garten.",
      description:
        "Der Erlenhof ist ein über hundert Jahre altes Spreewaldhaus in Burg, Ortsteil Kauper. Der Kachelofen im Wohnzimmer wärmt im Winter, im Sommer zieht es Sie in den weitläufigen Garten mit Wiese, Hängematte und Feuerstelle. Zwei Schlafzimmer, ein Bad, eine offene Küche — alles in natürlichen Materialien, mit Leinen, Keramik und viel Tageslicht. Die Kahnfahrten-Anlegestelle Hauptspreewehr ist in drei Gehminuten erreicht.",
      priceFrom: 11500, // 115,00 €
      maxGuests: 5,
      bedrooms: 2,
      sizeSqm: 82,
      features: [
        "WLAN (kostenfrei)",
        "Kachelofen",
        "Voll ausgestattete Küche",
        "Großer Garten mit Feuerstelle",
        "Hängematte & Liegen",
        "Waschmaschine & Trockner",
        "Fahrradunterstand",
        "Nichtraucher",
        "Hund auf Anfrage willkommen",
      ],
      images: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=80",
      ],
    },
  ];

  for (const apt of apartments) {
    await prisma.apartment.upsert({
      where: { slug: apt.slug },
      update: {
        ...apt,
        features: JSON.stringify(apt.features),
        images: JSON.stringify(apt.images),
      },
      create: {
        ...apt,
        features: JSON.stringify(apt.features),
        images: JSON.stringify(apt.images),
      },
    });
    console.log(`✓ Wohnung: ${apt.name}`);
  }

  // ------------------------------------------------------------------
  // Ein Beispiel-Block (belegter Zeitraum) – zum Testen der Anzeige
  // ------------------------------------------------------------------
  const kahnblick = await prisma.apartment.findUnique({ where: { slug: "kahnblick" } });
  if (kahnblick) {
    const blockExists = await prisma.block.findFirst({
      where: { apartmentId: kahnblick.id, reason: "manual" },
    });
    if (!blockExists) {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 17);
      await prisma.block.create({
        data: {
          apartmentId: kahnblick.id,
          startDate: start,
          endDate: end,
          reason: "manual",
          source: "manual",
          note: "Familientreffen der Eigentümer",
        },
      });
      console.log("✓ Beispiel-Block: Kahnblick, +10 bis +17 Tage");
    }
  }

  console.log("\nFertig. Admin-Login: " + adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
