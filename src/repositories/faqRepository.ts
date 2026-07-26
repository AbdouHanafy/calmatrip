import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getPublicFaqs() {
  return prisma.fAQ.findMany({ orderBy: { order: "asc" } });
}

export async function getAllFaqs() {
  return prisma.fAQ.findMany({ orderBy: { order: "asc" } });
}

export async function createFaq(data: Omit<Prisma.FAQCreateInput, "order">) {
  const maxOrder = await prisma.fAQ.aggregate({ _max: { order: true } });
  return prisma.fAQ.create({ data: { ...data, order: (maxOrder._max.order ?? 0) + 1 } });
}

export async function updateFaq(id: number, data: Prisma.FAQUpdateInput) {
  return prisma.fAQ.update({ where: { id }, data });
}

export async function deleteFaq(id: number) {
  return prisma.fAQ.delete({ where: { id } });
}
