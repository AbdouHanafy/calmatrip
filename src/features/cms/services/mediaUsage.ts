import { prisma } from "@/lib/prisma";

export type MediaUsage = { entityType: string; entityId: string; label: string; path: string };

export function valueContainsMediaUrl(value: unknown, url: string): boolean {
  if (value === url) return true;
  if (Array.isArray(value)) return value.some((item) => valueContainsMediaUrl(item, url));
  if (value && typeof value === "object")
    return Object.values(value).some((item) => valueContainsMediaUrl(item, url));
  return false;
}

export async function findMediaUsages(url: string, limit = 100): Promise<MediaUsage[]> {
  const usages: MediaUsage[] = [];
  const add = (usage: MediaUsage) => {
    if (usages.length < limit) usages.push(usage);
  };
  const direct = await Promise.all([
    prisma.user.findMany({ where: { image: url }, select: { id: true, name: true }, take: limit }),
    prisma.service.findMany({
      where: { image: url },
      select: { id: true, title: true },
      take: limit,
    }),
    prisma.exploreListing.findMany({
      where: { image: url },
      select: { id: true, title: true },
      take: limit,
    }),
    prisma.product.findMany({
      where: { image: url },
      select: { id: true, name: true },
      take: limit,
    }),
    prisma.event.findMany({
      where: { image: url },
      select: { id: true, title: true },
      take: limit,
    }),
    prisma.museum.findMany({
      where: { image: url },
      select: { id: true, name: true },
      take: limit,
    }),
    prisma.practicalGuide.findMany({
      where: { image: url },
      select: { id: true, title: true },
      take: limit,
    }),
    prisma.review.findMany({
      where: { avatar: url },
      select: { id: true, name: true },
      take: limit,
    }),
    prisma.communityPost.findMany({
      where: { image: url },
      select: { id: true, authorName: true },
      take: limit,
    }),
  ]);
  const types = [
    "User",
    "Service",
    "ExploreListing",
    "Product",
    "Event",
    "Museum",
    "PracticalGuide",
    "Review",
    "CommunityPost",
  ];
  direct.forEach((items, index) =>
    items.forEach((item) => {
      const record = item as {
        id: string | number;
        title?: string;
        name?: string | null;
        authorName?: string;
      };
      add({
        entityType: types[index],
        entityId: String(record.id),
        label: record.title ?? record.name ?? record.authorName ?? String(record.id),
        path: index === 7 ? "avatar" : index === 0 ? "image" : "image",
      });
    }),
  );
  if (usages.length >= limit) return usages;

  let cursor: string | undefined;
  do {
    const entries = await prisma.contentEntry.findMany({
      take: 250,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
      select: { id: true, slug: true, data: true, seo: true },
    });
    for (const entry of entries) {
      if (valueContainsMediaUrl(entry.data, url))
        add({ entityType: "ContentEntry", entityId: entry.id, label: entry.slug, path: "data" });
      if (valueContainsMediaUrl(entry.seo, url))
        add({ entityType: "ContentEntry", entityId: entry.id, label: entry.slug, path: "seo" });
    }
    cursor = entries.at(-1)?.id;
    if (entries.length < 250 || usages.length >= limit) break;
  } while (cursor);

  async function scan<T extends { id: string }>(
    load: (cursor?: string) => Promise<T[]>,
    inspect: (item: T) => void,
  ) {
    let next: string | undefined;
    do {
      const items = await load(next);
      items.forEach(inspect);
      next = items.at(-1)?.id;
      if (items.length < 250 || usages.length >= limit) break;
    } while (next);
  }
  await scan(
    (next) =>
      prisma.cmsPageBlock.findMany({
        take: 250,
        ...(next ? { skip: 1, cursor: { id: next } } : {}),
        orderBy: { id: "asc" },
        select: { id: true, pageId: true, data: true },
      }),
    (item) => {
      if (valueContainsMediaUrl(item.data, url))
        add({ entityType: "CmsPageBlock", entityId: item.id, label: item.pageId, path: "data" });
    },
  );
  await scan(
    (next) =>
      prisma.cmsPage.findMany({
        take: 250,
        ...(next ? { skip: 1, cursor: { id: next } } : {}),
        orderBy: { id: "asc" },
        select: { id: true, slug: true, seo: true },
      }),
    (item) => {
      if (valueContainsMediaUrl(item.seo, url))
        add({ entityType: "CmsPage", entityId: item.id, label: item.slug, path: "seo" });
    },
  );
  await scan(
    (next) =>
      prisma.formField.findMany({
        take: 250,
        ...(next ? { skip: 1, cursor: { id: next } } : {}),
        orderBy: { id: "asc" },
        select: { id: true, key: true, defaultValue: true, options: true },
      }),
    (item) => {
      if (valueContainsMediaUrl(item.defaultValue, url) || valueContainsMediaUrl(item.options, url))
        add({ entityType: "FormField", entityId: item.id, label: item.key, path: "configuration" });
    },
  );
  await scan(
    (next) =>
      prisma.siteSetting.findMany({
        take: 250,
        ...(next ? { skip: 1, cursor: { id: next } } : {}),
        orderBy: { id: "asc" },
        select: { id: true, key: true, value: true },
      }),
    (item) => {
      if (valueContainsMediaUrl(item.value, url))
        add({ entityType: "SiteSetting", entityId: item.id, label: item.key, path: "value" });
    },
  );
  return usages.slice(0, limit);
}
