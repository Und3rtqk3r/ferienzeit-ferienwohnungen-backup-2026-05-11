# Ferienzeit — MVP

Private Ferienwohnungs-Website mit zwei Wohnungen. Ruhig, editorial, wartungsarm.
Technik-Stack bewusst schlank gehalten — kein Hotel-PMS-Overhead, aber vorbereitet
für spätere Erweiterungen (iCal-Sync, Direktbuchung, Zahlungsabwicklung).

## Tech-Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript**, strict
- **Prisma** + **SQLite** (einfach portierbar nach Postgres/MySQL)
- **Tailwind CSS** mit eigener Naturpalette
- **React Hook Form** + **Zod** für Formulare & Validierung
- **jose** für signierte Session-Cookies (kein NextAuth-Overhead)
- **nodemailer** für Mailversand (mit Dev-Fallback ins Terminal)
- **react-day-picker** für den Verfügbarkeitskalender

## Projektstruktur

```
ferienzeit/
├── app/
│   ├── layout.tsx              # Root-Layout + Google Fonts
│   ├── globals.css             # Tailwind-Layer + globale Styles
│   ├── page.tsx                # Startseite
│   ├── not-found.tsx
│   ├── wohnungen/[slug]/
│   │   └── page.tsx            # Wohnungsdetail
│   ├── anfrage/
│   │   └── page.tsx            # Anfrageformular
│   ├── datenschutz/page.tsx
│   ├── impressum/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Redirect → Anfragen
│   │   ├── login/page.tsx
│   │   ├── anfragen/page.tsx   # Anfragen-Liste
│   │   ├── kalender/page.tsx   # Blocks sperren/freigeben
│   │   └── wohnungen/page.tsx  # Wohnungen pflegen
│   └── api/
│       ├── inquiries/route.ts            # POST (öffentlich)
│       ├── availability/[slug]/route.ts  # GET  (öffentlich)
│       └── admin/
│           ├── login/route.ts
│           ├── logout/route.ts
│           ├── inquiries/[id]/route.ts   # PATCH, DELETE
│           ├── blocks/route.ts           # POST
│           ├── blocks/[id]/route.ts      # DELETE
│           └── apartments/[id]/route.ts  # PATCH
├── components/
│   ├── layout/    (Header, Footer)
│   ├── home/      (Hero, About, ApartmentPreview, Location)
│   ├── apartment/ (Gallery, Features, AvailabilityCalendar)
│   ├── inquiry/   (InquiryForm)
│   ├── admin/     (AdminNav, InquiryRow, CalendarManager, ApartmentEditor)
│   └── ui/        (Button, Input, Label, Textarea, FieldError)
├── lib/
│   ├── db.ts           # Prisma-Singleton
│   ├── auth.ts         # JWT-Session via jose
│   ├── email.ts        # Nodemailer + Mail-Templates
│   ├── validations.ts  # Zod-Schemas
│   └── utils.ts        # Preis-/Datumsformatierung
├── prisma/
│   ├── schema.prisma   # Apartment, Inquiry, Block, Admin
│   └── seed.ts         # 2 Wohnungen + Admin + 1 Beispiel-Block
├── types/
├── middleware.ts       # schützt /admin und /api/admin
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── .env.example
└── package.json
```

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Environment vorbereiten

```bash
cp .env.example .env
```

Dann `.env` öffnen und **mindestens** setzen:

- `AUTH_SECRET` — zufällige, mind. 32 Zeichen lange Zeichenkette  
  (z. B. `openssl rand -base64 48`)
- `ADMIN_EMAIL` und `ADMIN_PASSWORD` — initialer Admin-Account
- `OWNER_EMAIL` — wohin sollen neue Anfragen gehen?

Die SMTP-Variablen sind **optional**. Ohne sie werden Mails ins Terminal geloggt
(praktisch fürs lokale Entwickeln).

### 3. Datenbank + Seed

```bash
npm run setup
```

Das führt die Prisma-Migration aus und legt die zwei Beispiel-Wohnungen samt
Admin-Account an.

### 4. Dev-Server

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)  
→ Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Nützliche Scripts

| Script              | Zweck                                              |
|---------------------|----------------------------------------------------|
| `npm run dev`       | Dev-Server mit Hot-Reload                          |
| `npm run build`     | Production-Build (inkl. `prisma generate + migrate`)|
| `npm run start`     | Production-Server                                  |
| `npm run db:push`   | Schema ohne Migration in DB pushen (prototyping)   |
| `npm run db:migrate`| Neue Migration erzeugen                            |
| `npm run db:seed`   | Seed erneut laufen lassen                          |
| `npm run db:studio` | Prisma Studio öffnen (DB-Browser)                  |

## Design-System

- **Farben:** `parchment` (Hintergrund), `ink` (Text), `moss` & `sand` (Akzente)
- **Typografie:** *Fraunces* (Display) + *Figtree* (Body), geladen via `next/font`
- **Layout:** Container mit großzügigem Whitespace, asymmetrische Grids
- **Bildsprache:** Große Bilder, ruhige Kompositionen, dezente Hover-Zooms

Alle Tokens in `tailwind.config.ts`.

## Wichtige Designentscheidungen

### Warum SQLite?
Ein Reiseobjekt mit zwei Wohnungen erzeugt wenig Schreiblast. SQLite ist schnell,
wartungsarm und das Schema ist 1:1 auf Postgres/MySQL portierbar, sobald gebraucht.

### Warum JWT-Cookie statt NextAuth?
Für einen Admin-User + zwei Gastgeber ist NextAuth Overkill. `jose` liefert
signierte Cookies in ~80 Zeilen Code, die Middleware-kompatibel (Edge) funktionieren.

### Warum `Block.source` trotz MVP?
Damit der spätere iCal-Importer einfach zusätzliche Einträge mit
`source: "airbnb"` / `source: "booking"` schreiben kann — ohne Schema-Änderung.

### Honeypot statt Captcha
Das Anfrageformular hat ein verstecktes `website`-Feld als Bot-Falle.
Für den MVP ausreichend; falls Spam zunimmt, lässt sich hCaptcha o. ä. ergänzen.

## Erweiterungspfad

Der Code ist bewusst so strukturiert, dass die folgenden Features **additiv**
eingebaut werden können — ohne Refactoring:

### iCal-Sync (Airbnb / Booking.com)
- Cron-Job (z. B. via Vercel Cron oder externer Scheduler), der pro Wohnung
  eine `ics_import_url` lädt, parst und Blocks mit `source: "airbnb"` /
  `source: "booking"` anlegt. Schema muss ggf. um `Apartment.icalUrls` erweitert werden.
- Umgekehrt: GET-Endpoint `/api/ical/[slug].ics`, der alle Blocks als ICS ausliefert,
  damit Airbnb/Booking wiederum eure Belegung sehen.

### Direktbuchung
- Stripe/Mollie-Integration im `/api/bookings/route.ts`.
- `Booking`-Tabelle einführen; erfolgreiche Zahlungen legen automatisch einen
  `Block` mit `source: "direct"` an.

### Mehr Inhalte
- Tagespreise / Saisonpreise (neues `PriceRule`-Modell).
- Blog/Storys (neues `Post`-Modell + `/journal`-Route).

### Bildupload
- Aktuell pflegt der Editor Bilder als URLs. Für echtes Hochladen:
  S3/R2/Cloudinary-Adapter in `lib/storage.ts` und Drag-and-Drop-Komponente
  im `ApartmentEditor`.

## DSGVO-Notizen

- Keine Marketing-Cookies, kein Tracking.
- Nur technisch notwendige Session-Cookies (httpOnly, SameSite=Lax, Secure in Prod).
- Anfragen werden mit ausdrücklicher Einwilligung verarbeitet (Checkbox im Formular).
- Datenschutz- und Impressums-Seite als Platzhalter angelegt — **vor Go-Live rechtlich prüfen lassen**.

## Lizenz

Privat / intern. Anpassen wie benötigt.
