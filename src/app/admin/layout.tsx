import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Panel Admin</h1>
      <p className="mt-1 text-muted">Kelola data jadwal film dan pertandingan.</p>

      <nav className="mt-6 flex gap-2 border-b border-border pb-px">
        <Link
          href="/admin/films"
          className="rounded-t-md border border-b-0 border-border bg-card px-4 py-2 text-sm font-medium"
        >
          Film
        </Link>
        <Link
          href="/admin/matches"
          className="rounded-t-md border border-b-0 border-border bg-card px-4 py-2 text-sm font-medium"
        >
          Pertandingan
        </Link>
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
