"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Label, Textarea, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export interface EditorApartment {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  priceFrom: number;  // Cent
  maxGuests: number;
  bedrooms: number;
  sizeSqm: number;
  features: string[];
  images: string[];
  airbnbUrl: string | null;
  bookingUrl: string | null;
  published: boolean;
}

export function ApartmentEditor({ apartment }: { apartment: EditorApartment }) {
  const router = useRouter();
  const [form, setForm] = useState(apartment);
  const [priceEuro, setPriceEuro] = useState(String(Math.round(apartment.priceFrom / 100)));
  const [airbnbUrl, setAirbnbUrl] = useState(apartment.airbnbUrl ?? "");
  const [bookingUrl, setBookingUrl] = useState(apartment.bookingUrl ?? "");
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function update<K extends keyof EditorApartment>(key: K, value: EditorApartment[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addFeature() {
    const v = featureInput.trim();
    if (!v) return;
    update("features", [...form.features, v]);
    setFeatureInput("");
  }
  function removeFeature(i: number) {
    update("features", form.features.filter((_, idx) => idx !== i));
  }

  function addImage() {
    const v = imageInput.trim();
    if (!v) return;
    try {
      new URL(v);
    } catch {
      setMessage({ kind: "err", text: "Bild-URL ist ungültig." });
      return;
    }
    update("images", [...form.images, v]);
    setImageInput("");
    setMessage(null);
  }
  function removeImage(i: number) {
    update("images", form.images.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/apartments/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          shortDescription: form.shortDescription,
          description: form.description,
          priceFrom: Math.max(0, Math.round(Number(priceEuro) * 100)),
          maxGuests: Number(form.maxGuests),
          bedrooms: Number(form.bedrooms),
          sizeSqm: Number(form.sizeSqm),
          features: form.features,
          images: form.images,
          airbnbUrl: airbnbUrl.trim() || "",
          bookingUrl: bookingUrl.trim() || "",
          published: form.published,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Speichern fehlgeschlagen.");
      }
      setMessage({ kind: "ok", text: "Gespeichert." });
      router.refresh();
    } catch (err) {
      setMessage({
        kind: "err",
        text: err instanceof Error ? err.message : "Unbekannter Fehler.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-cream border border-ink/10 rounded-sm p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow mb-1">/{form.slug}</div>
          <h2 className="font-display text-3xl leading-tight">{form.name}</h2>
          <div className="mt-2 text-sm text-ink/60">
            ab {formatPrice(form.priceFrom)} · bis {form.maxGuests} Gäste · {form.sizeSqm} m²
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="accent-moss-600 h-4 w-4"
          />
          Veröffentlicht
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <Label>Kurztitel / Tagline</Label>
          <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <Label>Kurzbeschreibung</Label>
          <Textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Beschreibung</Label>
          <Textarea
            rows={6}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <Label>Preis ab (€/Nacht)</Label>
          <Input
            type="number"
            min={0}
            value={priceEuro}
            onChange={(e) => setPriceEuro(e.target.value)}
          />
        </div>
        <div>
          <Label>Max. Gäste</Label>
          <Input
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={(e) => update("maxGuests", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Schlafzimmer</Label>
          <Input
            type="number"
            min={0}
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Größe (m²)</Label>
          <Input
            type="number"
            min={1}
            value={form.sizeSqm}
            onChange={(e) => update("sizeSqm", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-10">
        <Label>Ausstattung</Label>
        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {form.features.map((f, i) => (
            <span
              key={`${f}-${i}`}
              className="inline-flex items-center gap-2 bg-parchment border border-ink/15 px-3 py-1 rounded-full text-sm"
            >
              {f}
              <button
                onClick={() => removeFeature(i)}
                aria-label="Entfernen"
                className="text-ink/40 hover:text-red-700 text-lg leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="z. B. Kachelofen"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addFeature}>
            Hinzufügen
          </Button>
        </div>
      </div>

      {/* Bilder */}
      <div className="mt-10">
        <Label>Bilder (URLs)</Label>
        {form.images.length > 0 && (
          <ul className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3 mb-4">
            {form.images.map((src, i) => (
              <li key={`${src}-${i}`} className="relative aspect-square rounded-sm overflow-hidden bg-ink/5 group">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-ink/80 text-parchment text-xs w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                  aria-label="Bild entfernen"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="https://…"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addImage}>
            Hinzufügen
          </Button>
        </div>
        <p className="mt-2 text-xs text-ink/50">
          Für den MVP werden Bilder als URLs gepflegt. Später per Upload über S3/Cloudinary erweiterbar.
        </p>
      </div>

      {/* Buchungsplattformen */}
      <div className="mt-10">
        <Label>Buchungsplattformen</Label>
        <p className="mt-1 mb-4 text-xs text-ink/50">
          Wenn Airbnb- oder Booking.com-Links gesetzt sind, werden sie auf der Wohnungsseite als externe Buchungsoption angezeigt.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Airbnb-Link</Label>
            <Input
              placeholder="https://www.airbnb.de/rooms/…"
              value={airbnbUrl}
              onChange={(e) => setAirbnbUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Booking.com-Link</Label>
            <Input
              placeholder="https://www.booking.com/hotel/…"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Aktionen */}
      <div className="mt-10 pt-6 border-t border-ink/10 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm">
          {message && (
            <span className={message.kind === "ok" ? "text-moss-700" : "text-red-700"}>
              {message.text}
            </span>
          )}
        </div>
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? "Speichert…" : "Änderungen speichern"}
        </Button>
      </div>
    </div>
  );
}
