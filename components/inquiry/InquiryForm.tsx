"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ApartmentOption {
  slug: string;
  name: string;
}

interface Props {
  apartments: ApartmentOption[];
  defaultSlug?: string;
  defaultArrival?: string;
  defaultDeparture?: string;
}

export function InquiryForm({ apartments, defaultSlug, defaultArrival, defaultDeparture }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      apartmentSlug: defaultSlug && apartments.some((a) => a.slug === defaultSlug) ? defaultSlug : apartments[0]?.slug,
      arrival: defaultArrival ?? "",
      departure: defaultDeparture ?? "",
      guests: 2,
      gdpr: false as unknown as true,
      website: "",
    },
  });

  async function onSubmit(values: InquiryInput) {
    setState("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Anfrage konnte nicht gesendet werden.");
      }
      reset();
      setState("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setState("error");
      setServerError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-moss-50 border border-moss-200 rounded-sm p-8 md:p-12 animate-fade-up">
        <div className="eyebrow mb-3">Danke!</div>
        <h2 className="font-display text-3xl md:text-4xl leading-tight mb-4">
          Ihre Anfrage ist bei uns.
        </h2>
        <p className="text-ink/75 max-w-xl leading-relaxed">
          Wir haben Ihnen eine Bestätigung per E-Mail geschickt und melden uns in
          der Regel innerhalb von 24 Stunden.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center gap-2 bg-ink text-parchment px-6 py-3 rounded-full text-sm hover:bg-moss-700 transition-colors">
            Zur Startseite
          </Link>
          <button
            onClick={() => setState("idle")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-ink/20 hover:bg-ink/5"
          >
            Weitere Anfrage senden
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      {/* Honeypot */}
      <div className="absolute left-[-9999px] w-0 h-0 overflow-hidden" aria-hidden="true">
        <label>
          Website (bitte leer lassen)
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      {/* Wohnung */}
      <div>
        <Label htmlFor="apartmentSlug">Wohnung</Label>
        <div className="relative mt-2">
          <select
            id="apartmentSlug"
            {...register("apartmentSlug")}
            className={cn(
              "w-full appearance-none bg-transparent border-b py-2.5 text-base pr-8",
              errors.apartmentSlug ? "border-red-600" : "border-ink/25 focus:border-ink",
              "focus:outline-none transition-colors"
            )}
          >
            {apartments.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink/40" aria-hidden>▾</span>
        </div>
        <FieldError message={errors.apartmentSlug?.message} />
      </div>

      {/* Datum + Gäste */}
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <Label htmlFor="arrival">Anreise</Label>
          <Input id="arrival" type="date" error={errors.arrival?.message} {...register("arrival")} />
          <FieldError message={errors.arrival?.message} />
        </div>
        <div>
          <Label htmlFor="departure">Abreise</Label>
          <Input id="departure" type="date" error={errors.departure?.message} {...register("departure")} />
          <FieldError message={errors.departure?.message} />
        </div>
        <div>
          <Label htmlFor="guests">Personen</Label>
          <Input id="guests" type="number" min={1} max={20} error={errors.guests?.message} {...register("guests")} />
          <FieldError message={errors.guests?.message} />
        </div>
      </div>

      <hr className="border-ink/10" />

      {/* Kontakt */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Ihr Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" placeholder="name@example.com" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">
          Telefon <span className="text-ink/40 normal-case tracking-normal">(optional)</span>
        </Label>
        <Input id="phone" type="tel" placeholder="+49 …" autoComplete="tel" {...register("phone")} />
      </div>

      {/* Nachricht */}
      <div>
        <Label htmlFor="message">
          Nachricht <span className="text-ink/40 normal-case tracking-normal">(optional)</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Reisen Sie mit Hund? Gibt es Wünsche, die wir wissen sollten?"
          className="mt-2"
          rows={5}
          {...register("message")}
        />
      </div>

      {/* DSGVO */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("gdpr")}
            className="mt-1 h-4 w-4 accent-moss-600 shrink-0"
          />
          <span className="text-sm text-ink/75 leading-relaxed">
            Ich habe die{" "}
            <Link href="/datenschutz" className="link-underline text-ink">
              Datenschutzerklärung
            </Link>{" "}
            gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage zu.
          </span>
        </label>
        <FieldError message={errors.gdpr?.message as string | undefined} />
      </div>

      {serverError && (
        <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded-sm text-sm">
          {serverError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={state === "loading"}>
          {state === "loading" ? "Wird gesendet…" : "Anfrage senden →"}
        </Button>
        <span className="text-xs text-ink/50">
          Unverbindlich · Sie erhalten eine Bestätigung per E-Mail.
        </span>
      </div>
    </form>
  );
}
