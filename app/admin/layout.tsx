import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Die Middleware (middleware.ts) schützt alle /admin-Routen außer /admin/login.
  // Hier holen wir nur die Session, um bei eingeloggten Admins die Nav anzuzeigen.
  // Auf der Login-Seite gibt es (noch) keine Session → Nav wird nicht gerendert.
  const session = await getSession();

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {session && <AdminNav email={session.email} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
