import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { loadPublishedNavigations } from "./navigation";

describe("published navigation database-to-public integration", () => {
  const suffix = randomUUID().replaceAll("-", "");
  const navigationId = `test-nav-${suffix}`;
  const pageId = `test-page-${suffix}`;
  const key = `test-navigation-${suffix}`;
  const slug = `navigation-test-${suffix}`;

  afterAll(async () => {
    await prisma.cmsNavigation.deleteMany({ where: { id: navigationId } });
    await prisma.cmsPage.deleteMany({ where: { id: pageId } });
  });

  it("creates a draft menu, publishes it, and exposes only its visible valid page item", async () => {
    await prisma.cmsPage.create({
      data: { id: pageId, title: "Integration page", slug, locale: "fr", status: "PUBLISHED" },
    });
    await prisma.cmsNavigation.create({
      data: {
        id: navigationId,
        name: "Integration navigation",
        key,
        status: "DRAFT",
        items: {
          create: [
            {
              label: { fr: "Page de test", en: "Test page" },
              type: "PAGE",
              pageId,
              url: "",
              target: "_self",
              visible: true,
              position: 0,
            },
            {
              label: { fr: "Masqué" },
              type: "CUSTOM",
              url: "/hidden",
              target: "_self",
              visible: false,
              position: 1,
            },
          ],
        },
      },
    });

    expect((await loadPublishedNavigations([key]))[key]).toBeUndefined();
    await prisma.cmsNavigation.update({
      where: { id: navigationId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    const result = await loadPublishedNavigations([key]);
    expect(result[key]).toHaveLength(1);
    expect(result[key][0]).toMatchObject({ href: `/${slug}`, label: { en: "Test page" } });
  });
});
