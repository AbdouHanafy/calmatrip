import { prisma } from "@/lib/prisma";

export async function getPublicFaqs() {
  return prisma.fAQ.findMany({ orderBy: { order: "asc" } });
}
