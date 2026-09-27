import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 md:py-32 text-center">
      <div className="eyebrow mb-4">404</div>
      <h1 className="font-display text-display-lg mb-6 leading-[1.02]">
        Hier ist nur <span className="italic text-moss-600">Nebel.</span>
      </h1>
      <p className="text-ink/70 max-w-md mx-auto">
        Die Seite, die Sie suchen, gibt es nicht (mehr).
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-10 bg-ink text-parchment px-7 py-3.5 rounded-full text-sm hover:bg-moss-700 transition-colors"
      >
        Zurück zur Startseite →
      </Link>
    </div>
  );
}
