import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type NavigationLabel = { fr?: string; en?: string; ar?: string };
export type PublicNavigationItem = {
  id: string;
  label: NavigationLabel;
  href: string | null;
  target: "_self" | "_blank";
  children: PublicNavigationItem[];
};

type OrderedItem = { id: string; parentId: string | null; position: number };
type PublicSourceItem = {
  id: string;
  parentId: string | null;
  position: number;
  label: unknown;
  url: string;
  type: string;
  target: string;
  page: { slug: string; locale: string; status: string } | null;
};

export function validateNavigationOrder(currentIds: string[], items: OrderedItem[]) {
  if (
    items.length !== currentIds.length ||
    new Set(items.map((item) => item.id)).size !== items.length
  )
    return "The submitted tree must contain every navigation item exactly once";
  const allowed = new Set(currentIds);
  if (items.some((item) => !allowed.has(item.id))) return "The tree contains an invalid item";
  if (items.some((item) => item.parentId && !allowed.has(item.parentId)))
    return "The tree contains an invalid parent";
  if (items.some((item) => item.id === item.parentId)) return "An item cannot be its own parent";

  const parentById = new Map(items.map((item) => [item.id, item.parentId]));
  for (const item of items) {
    const visited = new Set([item.id]);
    let parent = item.parentId;
    while (parent) {
      if (visited.has(parent)) return "The tree contains a circular hierarchy";
      visited.add(parent);
      parent = parentById.get(parent) ?? null;
    }
  }
  const siblings = new Map<string, number[]>();
  for (const item of items) {
    const key = item.parentId ?? "ROOT";
    siblings.set(key, [...(siblings.get(key) ?? []), item.position]);
  }
  if ([...siblings.values()].some((positions) => new Set(positions).size !== positions.length))
    return "Sibling positions must be unique";
  return null;
}

export async function navigationSnapshot(id: string) {
  return prisma.cmsNavigation.findUnique({
    where: { id },
    include: { items: { orderBy: [{ parentId: "asc" }, { position: "asc" }] } },
  });
}

export function buildPublicNavigationTree(items: PublicSourceItem[]): PublicNavigationItem[] {
  const valid = items.flatMap((item) => {
    let href: string | null = item.url || null;
    if (item.type === "PAGE") {
      if (!item.page || item.page.status !== "PUBLISHED") return [];
      href = `/${item.page.slug}`;
    }
    if (item.type === "GROUP") href = null;
    return [{ ...item, href }];
  });
  const byParent = new Map<string | null, typeof valid>();
  valid.forEach((item) => {
    const parent = item.parentId ?? null;
    byParent.set(parent, [...(byParent.get(parent) ?? []), item]);
  });
  const build = (parentId: string | null): PublicNavigationItem[] =>
    (byParent.get(parentId) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        id: item.id,
        label: item.label as NavigationLabel,
        href: item.href,
        target: item.target === "_blank" ? "_blank" : "_self",
        children: build(item.id),
      }));
  return build(null);
}

export async function loadPublishedNavigations(keys: string[]) {
  const navigations = await prisma.cmsNavigation.findMany({
    where: { key: { in: keys }, status: "PUBLISHED" },
    include: {
      items: {
        where: { visible: true },
        include: { page: { select: { slug: true, locale: true, status: true } } },
        orderBy: { position: "asc" },
      },
    },
  });
  return Object.fromEntries(
    navigations.map((navigation) => {
      return [navigation.key, buildPublicNavigationTree(navigation.items)];
    }),
  ) as Record<string, PublicNavigationItem[]>;
}

export const getPublishedNavigations = unstable_cache(
  loadPublishedNavigations,
  ["published-navigation"],
  { tags: ["navigation"] },
);
