import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getActiveMuseums() {
  return prisma.museum.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function getAllMuseums() {
  return prisma.museum.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
}

export async function createMuseum(data: Prisma.MuseumCreateInput) {
  return prisma.museum.create({ data });
}

export async function updateMuseum(id: number, data: Prisma.MuseumUpdateInput) {
  return prisma.museum.update({ where: { id }, data });
}

export async function deleteMuseum(id: number) {
  return prisma.museum.delete({ where: { id } });
}
