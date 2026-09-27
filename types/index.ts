import type { Apartment as PrismaApartment, Inquiry, Block } from "@prisma/client";

/** Apartment mit geparsten Feldern (features + images als Arrays statt JSON-String). */
export interface Apartment extends Omit<PrismaApartment, "features" | "images"> {
  features: string[];
  images: string[];
}

export type { Inquiry, Block };

export type InquiryStatus = "new" | "read" | "confirmed" | "declined" | "archived";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "Neu",
  read: "Gelesen",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
  archived: "Archiviert",
};
