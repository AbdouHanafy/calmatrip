import { prisma } from "@/lib/prisma";

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
