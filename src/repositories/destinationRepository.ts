import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Destinations offered in the public search bar, in admin-defined order.
export async function getActiveDestinations() {
  return prisma.destination.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
}

export async function getAllDestinations() {
  return prisma.destination.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { services: true } } },
  });
}

export async function createDestination(data: {
  name: string;
  description: string;
  active: boolean;
}) {
  const maxOrder = await prisma.destination.aggregate({ _max: { order: true } });
  return prisma.destination.create({
    data: { ...data, order: (maxOrder._max.order ?? 0) + 1 },
  });
}

export async function updateDestination(id: number, data: Prisma.DestinationUpdateInput) {
  return prisma.destination.update({ where: { id }, data });
}

export async function deleteDestination(id: number) {
  return prisma.destination.delete({ where: { id } });
}
