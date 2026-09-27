import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { InquiryForm } from "@/components/inquiry/InquiryForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anfrage senden",
  description: "Senden Sie eine unverbindliche Anfrage für eine unserer Ferienwohnungen.",
};

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: { wohnung?: string; arrival?: string; departure?: string };
}) {
  const apartments = await prisma.apartment.findMany({
    where: { published: true },
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-3xl">
        <div className="mb-14">
          <div className="eyebrow mb-4">Anfrage</div>
          <h1 className="font-display text-display-lg leading-[0.98]">
            Erzählen Sie uns,<br />
            <span className="italic text-moss-600">wann Sie kommen möchten.</span>
          </h1>
          <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">
            Ein kurzes Formular — den Rest klären wir persönlich. Wir antworten
            in der Regel innerhalb von 24 Stunden.
          </p>
        </div>

        <InquiryForm
          apartments={apartments}
          defaultSlug={searchParams.wohnung}
          defaultArrival={searchParams.arrival}
          defaultDeparture={searchParams.departure}
        />
      </div>
    </div>
  );
}
