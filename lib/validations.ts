import { z } from "zod";

// --------------------------------------------------
// Anfrageformular (öffentlich)
// --------------------------------------------------
export const inquirySchema = z
  .object({
    apartmentSlug: z.string().min(1, "Bitte eine Wohnung wählen."),
    arrival: z
      .string()
      .min(1, "Bitte Anreisedatum angeben.")
      .refine((s) => !Number.isNaN(Date.parse(s)), "Ungültiges Datum."),
    departure: z
      .string()
      .min(1, "Bitte Abreisedatum angeben.")
      .refine((s) => !Number.isNaN(Date.parse(s)), "Ungültiges Datum."),
    guests: z.coerce.number().int().min(1, "Mindestens 1 Gast.").max(20),
    name: z.string().trim().min(2, "Bitte Ihren Namen angeben."),
    email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse angeben."),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    gdpr: z.literal(true, {
      errorMap: () => ({ message: "Bitte der Datenschutzerklärung zustimmen." }),
    }),
    // Honeypot-Feld gegen Bots — muss leer bleiben
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .refine(
    (d) => new Date(d.departure).getTime() > new Date(d.arrival).getTime(),
    { message: "Abreise muss nach Anreise liegen.", path: ["departure"] }
  );

export type InquiryInput = z.infer<typeof inquirySchema>;

// --------------------------------------------------
// Admin: Zeitraum sperren
// --------------------------------------------------
export const blockSchema = z
  .object({
    apartmentId: z.string().min(1),
    startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Ungültiges Datum."),
    endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Ungültiges Datum."),
    note: z.string().max(500).optional().or(z.literal("")),
    reason: z.enum(["manual", "maintenance", "booking"]).default("manual"),
  })
  .refine((d) => new Date(d.endDate).getTime() > new Date(d.startDate).getTime(), {
    message: "Enddatum muss nach Startdatum liegen.",
    path: ["endDate"],
  });

export type BlockInput = z.infer<typeof blockSchema>;

// --------------------------------------------------
// Admin: Wohnungsdaten
// --------------------------------------------------
export const apartmentUpdateSchema = z.object({
  name: z.string().min(2).max(120),
  tagline: z.string().min(2).max(200),
  shortDescription: z.string().min(10).max(500),
  description: z.string().min(10).max(5000),
  priceFrom: z.coerce.number().int().min(0), // in Cent
  maxGuests: z.coerce.number().int().min(1).max(20),
  bedrooms: z.coerce.number().int().min(0).max(20),
  sizeSqm: z.coerce.number().int().min(1).max(2000),
  features: z.array(z.string().min(1)).default([]),
  images: z.array(z.string().url()).default([]),
  airbnbUrl: z.string().url().optional().or(z.literal("")),
  bookingUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
});

export type ApartmentUpdateInput = z.infer<typeof apartmentUpdateSchema>;

// --------------------------------------------------
// Login
// --------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
