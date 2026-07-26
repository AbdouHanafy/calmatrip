import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface CreateContactInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export async function createContact(input: CreateContactInput) {
  return prisma.contact.create({ data: input });
}

export async function getContacts(isRead?: boolean) {
  const where: Prisma.ContactWhereInput = {};
  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  return prisma.contact.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function updateContactReadStatus(id: number, isRead: boolean) {
  return prisma.contact.update({ where: { id }, data: { isRead } });
}

export async function deleteContact(id: number) {
  return prisma.contact.delete({ where: { id } });
}
