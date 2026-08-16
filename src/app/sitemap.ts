import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://jadwalnonton.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: films }, { data: matches }] = await Promise.all([
    supabase.from("films").select("id, showtime").order("showtime", { ascending: false }).limit(500),
    supabase.from("matches").select("id, kickoff_time").order("kickoff_time", { ascending: false }).limit(500),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/jadwal-film`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/jadwal-bola`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/film-klasik`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/kalender`, changeFrequency: "daily", priority: 0.5 },
    { url: `${SITE_URL}/pengguna`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/signup`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const filmRoutes: MetadataRoute.Sitemap = (films ?? []).map((f) => ({
    url: `${SITE_URL}/jadwal-film/${f.id}`,
    lastModified: f.showtime ? new Date(f.showtime) : undefined,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const matchRoutes: MetadataRoute.Sitemap = (matches ?? []).map((m) => ({
    url: `${SITE_URL}/jadwal-bola/${m.id}`,
    lastModified: m.kickoff_time ? new Date(m.kickoff_time) : undefined,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...filmRoutes, ...matchRoutes];
}
