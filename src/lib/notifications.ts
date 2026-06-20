// lib/notifications.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type CreateNotificationParams = {
  recipient: "admin" | "user";
  type: string;
  title: string;
  body: string;
  link?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export async function createNotification(params: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      recipient: params.recipient,
      type: params.type,
      title: params.title,
      body: params.body,
      link: params.link,
      userId: params.userId,
      metadata: params.metadata as Prisma.InputJsonValue,
    },
  });
}