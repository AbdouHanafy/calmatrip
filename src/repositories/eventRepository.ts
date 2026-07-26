import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getActiveEvents() {
  return prisma.event.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { startDate: "asc" }],
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({ orderBy: [{ order: "asc" }, { startDate: "asc" }] });
}

export async function createEvent(data: Prisma.EventCreateInput) {
  return prisma.event.create({ data });
}

export async function updateEvent(id: number, data: Prisma.EventUpdateInput) {
  return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: number) {
  return prisma.event.delete({ where: { id } });
}
