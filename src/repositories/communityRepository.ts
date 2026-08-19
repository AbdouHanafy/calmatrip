import { prisma } from "@/lib/prisma";

export async function getApprovedPosts() {
  return prisma.communityPost.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllPosts() {
  return prisma.communityPost.findMany({ orderBy: { createdAt: "desc" } });
}

interface CreatePostInput {
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  image?: string | null;
}

export async function createPost(input: CreatePostInput) {
  return prisma.communityPost.create({
    data: {
      authorId: input.authorId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar ?? null,
      content: input.content,
      image: input.image ?? null,
      approved: false,
    },
  });
}

export async function getPostById(id: number) {
  return prisma.communityPost.findUnique({ where: { id } });
}

export async function approvePost(id: number) {
  return prisma.communityPost.update({ where: { id }, data: { approved: true } });
}

export async function deletePost(id: number) {
  return prisma.communityPost.delete({ where: { id } });
}
