import { prisma } from "@/lib/prisma";

export async function getActiveMuseums() {
  return prisma.museum.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}
