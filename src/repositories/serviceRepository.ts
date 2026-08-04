import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getPublicServices() {
  return prisma.service.findMany({
    where: { submissionStatus: "approved" },
    orderBy: { order: "asc" },
  });
}

interface CreateServiceInput {
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  category: string;
  duration?: string | null;
  icon?: string;
  color?: string | null;
  features?: string[];
  image?: string | null;
  active?: boolean;
  popular?: boolean;
  ownerId?: string;
  submissionStatus?: string;
}

export async function createService(input: CreateServiceInput) {
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });

  return prisma.service.create({
    data: {
      title: input.title,
      subtitle: input.subtitle ?? null,
      description: input.description,
      price: input.price,
      category: input.category,
      duration: input.duration ?? null,
      icon: input.icon ?? "Car",
      color: input.color ?? null,
      features: input.features ?? undefined,
      image: input.image ?? null,
      active: input.active ?? true,
      popular: input.popular ?? false,
      order: (maxOrder._max.order ?? 0) + 1,
      ownerId: input.ownerId,
      ...(input.submissionStatus && { submissionStatus: input.submissionStatus }),
    },
  });
}

export async function getOwnedServices(ownerId: string) {
  return prisma.service.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
}

export async function getOwnedServiceById(id: number, ownerId: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service || service.ownerId !== ownerId) return null;
  return service;
}

export async function updateService(id: number, data: Prisma.ServiceUpdateInput) {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: number) {
  return prisma.service.delete({ where: { id } });
}

export async function approveService(id: number) {
  return prisma.service.update({
    where: { id },
    data: { submissionStatus: "approved", rejectionReason: null },
  });
}

export async function rejectService(id: number, reason: string | null) {
  return prisma.service.update({
    where: { id },
    data: { submissionStatus: "rejected", rejectionReason: reason },
  });
}
