"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const resolved: "light" | "dark" =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    // Reads browser-only APIs (localStorage/matchMedia) unavailable during
    // SSR, so the initial theme can only be resolved client-side after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti tema terang/gelap"
      className={
        className ??
        "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-muted-bg"
      }
    >
      {theme === null ? null : theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
