import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import type { Apartment } from "@/types";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { ApartmentPreview } from "@/components/home/ApartmentPreview";
import { Location } from "@/components/home/Location";
import { PlacesToVisit } from "@/components/home/PlacesToVisit";

// Daten immer frisch (SQLite, lokal unproblematisch; für Produktion ggf. ISR)
export const dynamic = "force-dynamic";

async function getApartments(): Promise<Apartment[]> {
  const rows = await prisma.apartment.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    ...r,
    features: parseJsonArray<string>(r.features),
    images: parseJsonArray<string>(r.images),
  }));
}

export default async function HomePage() {
  const apartments = await getApartments();
  return (
    <>
      <Hero />
      <About />
      <ApartmentPreview apartments={apartments} />
      <Location />
      <PlacesToVisit />
    </>
  );
}
