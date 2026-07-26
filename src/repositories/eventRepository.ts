import { prisma } from "@/lib/prisma";

export async function getActiveEvents() {
  return prisma.event.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { startDate: "asc" }],
  });
}
