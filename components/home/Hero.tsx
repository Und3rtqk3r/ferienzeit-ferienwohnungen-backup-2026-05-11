import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-10 md:pt-16 pb-20 md:pb-28 overflow-hidden">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
          {/* Left column — typography */}
          <div className="md:col-span-7 lg:col-span-6 animate-fade-up">
            <div className="eyebrow mb-6">Ferienwohnungen · Spreewald</div>
            <h1 className="font-display text-display-xl leading-[0.98]">
              Hier hat der Morgen<br />
              noch <span className="italic text-moss-600">Nebel</span>,<br />
              und die Nacht<br />
              noch <span className="italic text-moss-600">Sterne</span>.
            </h1>
            <p className="mt-8 max-w-lg text-lg text-ink/75 leading-relaxed">
              Zwei Ferienwohnungen, ein Ort. Zwischen Fließen, Erlen und Feldwegen
              warten ein Kachelofen, ein Garten und ein Kahn, der auf Sie wartet.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#wohnungen"
                className="inline-flex items-center gap-2 bg-ink text-parchment px-7 py-3.5 rounded-full text-sm hover:bg-moss-700 transition-colors shadow-sm"
              >
                Die Wohnungen ansehen
                <span aria-hidden>↓</span>
              </Link>
              <Link
                href="/anfrage"
                className="inline-flex items-center gap-2 border border-ink/20 px-7 py-3.5 rounded-full text-sm hover:border-ink/40 hover:bg-ink/5 transition"
              >
                Anfrage senden
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-10 pt-8 border-t border-ink/10 flex flex-wrap gap-6 text-xs text-ink/50">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-moss-500 inline-block" aria-hidden />
                Keine Provision
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-moss-500 inline-block" aria-hidden />
                Direkt beim Gastgeber
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-moss-500 inline-block" aria-hidden />
                Antwort in 24 Stunden
              </span>
            </div>
          </div>

          {/* Right column — image */}
          <div className="md:col-span-5 lg:col-span-6 md:-mb-10 animate-fade-in">
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-sm shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
                alt="Nebel über dem Spreewald"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent" />
            </div>
            <div className="mt-4 text-xs text-ink/50 italic">
              Morgennebel, Fließ bei Lehde.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
