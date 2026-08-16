import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/", "/onboarding", "/profil", "/tontonan-saya", "/sudah-ditonton"],
    },
    sitemap: "https://jadwalnonton.vercel.app/sitemap.xml",
  };
}
