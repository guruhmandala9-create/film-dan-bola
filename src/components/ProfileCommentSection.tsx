import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { postProfileComment, deleteProfileComment, reportProfileComment } from "@/lib/profile-comments/actions";

export default async function ProfileCommentSection({
  profileOwnerId,
  returnTo,
}: {
  profileOwnerId: string;
  returnTo: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from("profile_comments")
    .select("id, author_id, body, created_at")
    .eq("profile_owner_id", profileOwnerId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  const authorIds = Array.from(new Set((comments ?? []).map((c) => c.author_id)));
  const names = new Map<string, string>();
  if (authorIds.length) {
    const { data: profiles } = await supabase.from("public_profiles").select("id, display_name, username").in("id", authorIds);
    profiles?.forEach((p) => names.set(p.id, p.display_name || p.username || "Pengguna"));
  }

  return (
    <div className="mt-10">
      <h2 className="mb-4 font-semibold">Komentar ({comments?.length ?? 0})</h2>

      {user ? (
        <form action={postProfileComment} className="mb-6 flex flex-col gap-2">
          <input type="hidden" name="profileOwnerId" value={profileOwnerId} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <textarea
            name="body"
            required
            rows={2}
            placeholder="Tulis sesuatu di profil ini..."
            className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="self-start rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Kirim
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted">
          <Link href={`/login?next=${encodeURIComponent(returnTo)}`} className="underline">
            Masuk
          </Link>{" "}
          untuk berkomentar.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{names.get(comment.author_id) || "Pengguna"}</p>
              <p className="text-xs text-muted">
                {new Date(comment.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </p>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm">{comment.body}</p>
            {user && (
              <div className="mt-2 flex gap-3 text-xs">
                {user.id === comment.author_id ? (
                  <form action={deleteProfileComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className="text-red-500 hover:underline">
                      Hapus
                    </button>
                  </form>
                ) : (
                  <form action={reportProfileComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className="text-muted hover:underline">
                      Laporkan
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ))}
        {!comments?.length && <p className="text-sm text-muted">Belum ada komentar.</p>}
      </div>
    </div>
  );
}
