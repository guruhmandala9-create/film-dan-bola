import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleWatched } from "@/lib/watched/actions";

export default async function WatchedButton({
  itemType,
  itemId,
  returnTo,
  isWatched,
  userId,
  className,
}: {
  itemType: "film" | "classic_film";
  itemId: string;
  returnTo: string;
  isWatched?: boolean;
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
        Sudah ditonton?
      </Link>
    );
  }

  let watched = isWatched;
  if (watched === undefined) {
    const { data } = await supabase
      .from("watched_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .maybeSingle();
    watched = Boolean(data);
  }

  return (
    <form action={toggleWatched}>
      <input type="hidden" name="itemType" value={itemType} />
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="action" value={watched ? "remove" : "add"} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type="submit"
        className={
          className ??
          `rounded-md border px-3 py-1.5 text-sm font-medium ${
            watched ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:bg-card"
          }`
        }
      >
        {watched ? "✓ Sudah ditonton" : "Sudah ditonton?"}
      </button>
    </form>
  );
}
