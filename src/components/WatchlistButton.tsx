import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleWatchlist } from "@/lib/watchlist/actions";

export default async function WatchlistButton({
  itemType,
  itemId,
  returnTo,
  isWatchlisted,
  userId,
  className,
}: {
  itemType: "film" | "match";
  itemId: string;
  returnTo: string;
  /** Pass this when the caller already fetched the whole watchlist (e.g. list pages) to avoid an extra query per item. */
  isWatchlisted?: boolean;
  /** Pass this when the caller already resolved the user (e.g. list pages) to avoid an extra auth call per item. Use `null` for a confirmed logged-out user. */
  userId?: string | null;
  className?: string;
}) {
  const supabase = await createClient();
  let user: { id: string } | null;
  if (userId !== undefined) {
    user = userId === null ? null : { id: userId };
  } else {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  }

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(returnTo)}`}
        className={className ?? "rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-card"}
      >
        + Tandai
      </Link>
    );
  }

  let watchlisted = isWatchlisted;
  if (watchlisted === undefined) {
    const { data } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .maybeSingle();
    watchlisted = Boolean(data);
  }

  return (
    <form action={toggleWatchlist}>
      <input type="hidden" name="itemType" value={itemType} />
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="action" value={watchlisted ? "remove" : "add"} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type="submit"
        className={
          className ??
          `rounded-md border px-3 py-1.5 text-sm font-medium ${
            watchlisted
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-card"
          }`
        }
      >
        {watchlisted ? "✓ Ditandai" : "+ Tandai"}
      </button>
    </form>
  );
}
