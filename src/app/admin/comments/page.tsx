import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setCommentHidden } from "./actions";

export default async function AdminCommentsPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("comment_reports")
    .select("comment_id");

  const reportCounts = new Map<string, number>();
  for (const r of reports ?? []) reportCounts.set(r.comment_id, (reportCounts.get(r.comment_id) ?? 0) + 1);

  const commentIds = Array.from(reportCounts.keys());

  const { data: comments } = commentIds.length
    ? await supabase
        .from("comments")
        .select("id, item_type, item_id, body, is_hidden, created_at")
        .in("id", commentIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Komentar yang pernah dilaporkan pengguna ({comments?.length ?? 0}). Tinjau lalu sembunyikan kalau melanggar.
      </p>

      <div className="flex flex-col gap-3">
        {comments?.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/${comment.item_type === "film" ? "jadwal-film" : "jadwal-bola"}/${comment.item_id}`}
                className="text-xs text-primary hover:underline"
                target="_blank"
              >
                Lihat item &rarr;
              </Link>
              <span className="text-xs text-muted">
                {reportCounts.get(comment.id)} laporan · {comment.is_hidden ? "Disembunyikan" : "Tampil"}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{comment.body}</p>
            <form action={setCommentHidden} className="mt-3">
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="hidden" value={(!comment.is_hidden).toString()} />
              <button
                type="submit"
                className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                  comment.is_hidden
                    ? "border-border hover:bg-background"
                    : "border-red-500 text-red-500 hover:bg-red-500/10"
                }`}
              >
                {comment.is_hidden ? "Tampilkan kembali" : "Sembunyikan"}
              </button>
            </form>
          </div>
        ))}
        {!comments?.length && (
          <p className="rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
            Belum ada komentar yang dilaporkan.
          </p>
        )}
      </div>
    </div>
  );
}
