import nodemailer, { type Transporter } from "nodemailer";
import { formatDate, nightsBetween } from "./utils";

// --------------------------------------------------------------------
// Transporter
// --------------------------------------------------------------------
// Wenn kein SMTP-Host konfiguriert ist, fällt der Versand auf "Console-Log"
// zurück. So funktioniert die Entwicklung ohne echten Mailserver.
// --------------------------------------------------------------------
let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });
  return cachedTransporter;
}

interface SendMailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendMail({ to, subject, text, html, replyTo }: SendMailParams) {
  const from = process.env.SMTP_FROM ?? "Ferienzeit <noreply@ferienzeit.example>";
  const transporter = getTransporter();

  if (!transporter) {
    // Dev-Fallback: loggen
    console.log(
      "\n─────── 📬 MAIL (Dev-Fallback, kein SMTP gesetzt) ───────\n" +
        `An:      ${to}\n` +
        `Von:     ${from}\n` +
        `Betreff: ${subject}\n` +
        (replyTo ? `Reply-To: ${replyTo}\n` : "") +
        `\n${text}\n` +
        "──────────────────────────────────────────────────────────\n"
    );
    return { devFallback: true };
  }

  await transporter.sendMail({ from, to, subject, text, html, replyTo });
  return { devFallback: false };
}

// --------------------------------------------------------------------
// Vorgefertigte Templates
// --------------------------------------------------------------------
interface InquiryMailData {
  apartmentName: string;
  arrival: Date;
  departure: Date;
  guests: number;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  inquiryId: string;
}

export async function sendInquiryMails(data: InquiryMailData) {
  const nights = nightsBetween(data.arrival, data.departure);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // 1) Mail an Vermieter
  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerEmail) {
    await sendMail({
      to: ownerEmail,
      replyTo: data.email,
      subject: `Neue Anfrage: ${data.apartmentName} (${formatDate(data.arrival)} – ${formatDate(
        data.departure
      )})`,
      text: [
        `Neue Anfrage über Ferienzeit`,
        ``,
        `Wohnung:   ${data.apartmentName}`,
        `Zeitraum:  ${formatDate(data.arrival)} – ${formatDate(data.departure)} (${nights} Nächte)`,
        `Gäste:     ${data.guests}`,
        ``,
        `Name:      ${data.name}`,
        `E-Mail:    ${data.email}`,
        `Telefon:   ${data.phone || "—"}`,
        ``,
        `Nachricht:`,
        data.message?.trim() || "(keine)",
        ``,
        `Im Admin öffnen: ${siteUrl}/admin/anfragen`,
      ].join("\n"),
    });
  }

  // 2) Bestätigung an Gast
  await sendMail({
    to: data.email,
    subject: `Ihre Anfrage bei Ferienzeit – ${data.apartmentName}`,
    text: [
      `Hallo ${data.name},`,
      ``,
      `vielen Dank für Ihre Anfrage. Wir haben Ihre Daten erhalten und melden uns`,
      `in der Regel innerhalb von 24 Stunden.`,
      ``,
      `Ihre Anfrage im Überblick:`,
      `  Wohnung:  ${data.apartmentName}`,
      `  Zeitraum: ${formatDate(data.arrival)} – ${formatDate(data.departure)} (${nights} Nächte)`,
      `  Gäste:    ${data.guests}`,
      ``,
      `Herzliche Grüße`,
      `Ihr Ferienzeit-Team`,
      ``,
      `–`,
      `Diese Mail wurde automatisch versendet.`,
    ].join("\n"),
  });
}
