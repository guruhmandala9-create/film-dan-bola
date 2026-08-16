"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={
        className ??
        "mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      }
    >
      &larr; Kembali
    </button>
  );
}
