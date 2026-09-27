import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Ferienzeit – Zwei Ferienwohnungen am Fließ",
    template: "%s · Ferienzeit",
  },
  description:
    "Zwei private Ferienwohnungen im Spreewald — ruhig, mit viel Holz, Wasser vor der Tür und Platz zum Durchatmen.",
  openGraph: {
    title: "Ferienzeit",
    description:
      "Zwei private Ferienwohnungen im Spreewald — ruhig, mit viel Holz, Wasser vor der Tür und Platz zum Durchatmen.",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${fraunces.variable} ${figtree.variable}`}>
      <body className="min-h-screen flex flex-col">
        <div className="relative z-10 flex flex-col flex-1">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
