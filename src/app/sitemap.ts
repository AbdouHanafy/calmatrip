// app/sitemap.ts
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.calmatrip.com";

// ✅ Must be "export default function" — Next.js requires a default export
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/explore", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/marketplace", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/guides", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const [products, guides, services, cmsPages] = await Promise.all([
    prisma.product.findMany({
      where: { submissionStatus: "approved" },
      select: { id: true, updatedAt: true },
    }),
    prisma.practicalGuide.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { submissionStatus: "approved", active: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.cmsPage.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, seo: true },
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/marketplace/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/services/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const cmsEntries: MetadataRoute.Sitemap = cmsPages
    .filter((page) => (page.seo as { sitemap?: boolean } | null)?.sitemap !== false)
    .map((page) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...productEntries, ...guideEntries, ...serviceEntries, ...cmsEntries];
}
