import { createClient } from "@/lib/supabase/server";
import { toggleReaction } from "@/lib/reactions/actions";

const EMOJIS = ["🔥", "😍", "😴"] as const;

export default async function ReactionBar({
  itemType,
  itemId,
  returnTo,
}: {
  itemType: "film" | "match";
  itemId: string;
  returnTo: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reactions } = await supabase
    .from("reactions")
    .select("emoji, user_id")
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  const counts = new Map<string, number>();
  for (const r of reactions ?? []) counts.set(r.emoji, (counts.get(r.emoji) ?? 0) + 1);
  const myReaction = reactions?.find((r) => r.user_id === user?.id)?.emoji;

  return (
    <div className="mt-4 flex gap-2">
      {EMOJIS.map((emoji) => (
        <form key={emoji} action={toggleReaction}>
          <input type="hidden" name="itemType" value={itemType} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="emoji" value={emoji} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className={`rounded-full border px-3 py-1 text-sm transition-all ${
              myReaction === emoji
                ? "scale-110 border-primary bg-primary/10 shadow-sm"
                : "border-border hover:-translate-y-0.5 hover:bg-muted-bg"
            }`}
          >
            {emoji} {counts.get(emoji) ?? 0}
          </button>
        </form>
      ))}
    </div>
  );
}
