// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.calmatrip.com";

// ✅ Must be "export default function" — Next.js requires a default export
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { path: "/",            priority: 1.0,  changeFrequency: "weekly"  as const },
    { path: "/services",    priority: 0.95, changeFrequency: "weekly"  as const },
    { path: "/about",       priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/contact",     priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/explore",     priority: 0.85, changeFrequency: "weekly"  as const },
    { path: "/marketplace", priority: 0.85, changeFrequency: "daily"   as const },
    { path: "/faq",         priority: 0.7,  changeFrequency: "monthly" as const },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}