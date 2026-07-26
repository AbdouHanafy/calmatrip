import { prisma } from "@/lib/prisma";

export async function getPublicServices() {
  return prisma.service.findMany({
    where: { submissionStatus: "approved" },
    orderBy: { order: "asc" },
  });
}
