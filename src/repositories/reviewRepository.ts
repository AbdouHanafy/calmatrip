import { prisma } from "@/lib/prisma";

export async function getApprovedReviews() {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({ orderBy: { createdAt: "desc" } });
}

interface CreateReviewInput {
  name: string;
  email: string;
  avatar?: string | null;
  rating: number;
  comment: string;
  service?: string | null;
}

export async function createReview(input: CreateReviewInput) {
  return prisma.review.create({
    data: {
      name: input.name,
      email: input.email,
      avatar: input.avatar ?? null,
      rating: input.rating,
      comment: input.comment,
      service: input.service ?? null,
      approved: false,
    },
  });
}

export async function approveReview(id: number) {
  return prisma.review.update({ where: { id }, data: { approved: true } });
}

export async function deleteReview(id: number) {
  return prisma.review.delete({ where: { id } });
}
