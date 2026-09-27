import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import {
  ApartmentEditor,
  type EditorApartment,
} from "@/components/admin/ApartmentEditor";

export const dynamic = "force-dynamic";

export default async function AdminApartmentsPage() {
  const rows = await prisma.apartment.findMany({
    orderBy: { createdAt: "asc" },
  });

  const apartments: EditorApartment[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    shortDescription: r.shortDescription,
    description: r.description,
    priceFrom: r.priceFrom,
    maxGuests: r.maxGuests,
    bedrooms: r.bedrooms,
    sizeSqm: r.sizeSqm,
    features: parseJsonArray<string>(r.features),
    images: parseJsonArray<string>(r.images),
    airbnbUrl: r.airbnbUrl ?? null,
    bookingUrl: r.bookingUrl ?? null,
    published: r.published,
  }));

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-10">
        <div className="eyebrow mb-2">Admin</div>
        <h1 className="font-display text-3xl md:text-4xl leading-tight">Wohnungen</h1>
        <p className="text-ink/60 text-sm mt-2">
          Basisdaten, Ausstattung und Bilder pflegen.
        </p>
      </div>

      <div className="space-y-8">
        {apartments.map((apt) => (
          <ApartmentEditor key={apt.id} apartment={apt} />
        ))}
      </div>
    </div>
  );
}
