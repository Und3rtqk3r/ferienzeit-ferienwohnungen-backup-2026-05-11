"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/#wohnungen", label: "Wohnungen" },
  { href: "/#umgebung", label: "Umgebung" },
  { href: "/anfrage", label: "Anfrage" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-parchment/90 backdrop-blur-md border-b border-ink/8 shadow-[0_1px_0_rgba(28,38,32,0.04)]"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between py-5 md:py-6">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl md:text-[1.65rem] tracking-tight leading-none group-hover:text-moss-700 transition-colors duration-200">
            Ferienzeit
          </span>
          <span
            className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-moss-500 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
            aria-hidden="true"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-ink/75 hover:text-ink transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/anfrage"
            className="inline-flex items-center gap-2 bg-ink text-parchment px-5 py-2.5 rounded-full text-sm hover:bg-moss-700 transition-colors shadow-sm"
          >
            Jetzt anfragen
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 hover:bg-ink/5 rounded-sm transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
        >
          <span className="relative block w-6 h-[2px]">
            <span
              className={cn(
                "absolute inset-x-0 h-[2px] bg-ink transition-all duration-300",
                mobileOpen ? "top-0 rotate-45" : "-top-2"
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 h-[2px] bg-ink top-0 transition-opacity",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 h-[2px] bg-ink transition-all duration-300",
                mobileOpen ? "top-0 -rotate-45" : "top-2"
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-ink/8 bg-parchment/95 backdrop-blur-md transition-[max-height,opacity] duration-300",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container flex flex-col py-5 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-lg font-display hover:text-moss-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/anfrage"
            className="mt-3 inline-flex items-center justify-center bg-ink text-parchment px-5 py-3 rounded-full text-sm hover:bg-moss-700 transition-colors"
          >
            Jetzt anfragen →
          </Link>
        </nav>
      </div>
    </header>
  );
}
