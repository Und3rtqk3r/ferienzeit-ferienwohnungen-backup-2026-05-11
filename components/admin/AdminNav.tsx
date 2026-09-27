"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/anfragen", label: "Anfragen" },
  { href: "/admin/kalender", label: "Kalender" },
  { href: "/admin/wohnungen", label: "Wohnungen" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-ink text-parchment">
      <div className="container flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
        <div className="flex items-center gap-8">
          <Link href="/admin/anfragen" className="font-display text-xl tracking-tight">
            Ferienzeit{" "}
            <span className="text-parchment/50 text-sm ml-1">· Admin</span>
          </Link>
          <nav className="flex gap-1 md:gap-2">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition",
                    active
                      ? "bg-parchment text-ink"
                      : "text-parchment/70 hover:text-parchment hover:bg-parchment/10"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-parchment/60 hover:text-parchment">
            Website ansehen ↗
          </Link>
          <span className="hidden md:inline text-parchment/40">·</span>
          <span className="hidden md:inline text-parchment/70">{email}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full bg-parchment/10 hover:bg-parchment/20 text-sm transition"
          >
            Abmelden
          </button>
        </div>
      </div>
    </header>
  );
}
