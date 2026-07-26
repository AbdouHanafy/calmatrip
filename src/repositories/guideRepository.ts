import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getPublicGuides() {
  return prisma.practicalGuide.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      category: true,
      icon: true,
      image: true,
    },
  });
}

export async function getAllGuides() {
  return prisma.practicalGuide.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });
}

export async function guideSlugExists(slug: string) {
  return (await prisma.practicalGuide.findUnique({ where: { slug } })) !== null;
}

export async function createGuide(data: Prisma.PracticalGuideCreateInput) {
  return prisma.practicalGuide.create({ data });
}

export async function updateGuide(id: number, data: Prisma.PracticalGuideUpdateInput) {
  return prisma.practicalGuide.update({ where: { id }, data });
}

export async function deleteGuide(id: number) {
  return prisma.practicalGuide.delete({ where: { id } });
}
