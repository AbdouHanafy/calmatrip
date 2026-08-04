import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getPublicExploreListings() {
  return prisma.exploreListing.findMany({
    where: { submissionStatus: "approved", active: true },
    orderBy: { createdAt: "desc" },
  });
}

interface CreateExploreListingInput {
  title: string;
  description: string;
  category: string;
  city: string;
  address?: string | null;
  price?: string | null;
  budget?: number;
  duration?: string | null;
  openingHours?: string | null;
  lat?: number | null;
  lng?: number | null;
  image?: string | null;
  ownerId?: string;
  submissionStatus?: string;
}

export async function createExploreListing(input: CreateExploreListingInput) {
  return prisma.exploreListing.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      city: input.city,
      address: input.address ?? null,
      price: input.price ?? null,
      budget: input.budget ?? 2,
      duration: input.duration ?? null,
      openingHours: input.openingHours ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      image: input.image ?? null,
      ownerId: input.ownerId,
      ...(input.submissionStatus && { submissionStatus: input.submissionStatus }),
    },
  });
}

export async function getOwnedExploreListings(ownerId: string) {
  return prisma.exploreListing.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
}

export async function getOwnedExploreListingById(id: number, ownerId: string) {
  const listing = await prisma.exploreListing.findUnique({ where: { id } });
  if (!listing || listing.ownerId !== ownerId) return null;
  return listing;
}

export async function updateExploreListing(id: number, data: Prisma.ExploreListingUpdateInput) {
  return prisma.exploreListing.update({ where: { id }, data });
}

export async function deleteExploreListing(id: number) {
  return prisma.exploreListing.delete({ where: { id } });
}

export async function approveExploreListing(id: number) {
  return prisma.exploreListing.update({
    where: { id },
    data: { submissionStatus: "approved", rejectionReason: null },
  });
}

export async function rejectExploreListing(id: number, reason: string | null) {
  return prisma.exploreListing.update({
    where: { id },
    data: { submissionStatus: "rejected", rejectionReason: reason },
  });
}
