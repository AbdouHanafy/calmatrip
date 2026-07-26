// lib/notifications.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { emitNotificationEvent } from "@/lib/notificationEvents";

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
  const notification = await prisma.notification.create({
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

  emitNotificationEvent(params.recipient, params.userId, notification);

  return notification;
}

interface GetNotificationsParams {
  isAdmin: boolean;
  userId?: string;
  onlyUnread?: boolean;
}

export async function getNotifications({ isAdmin, userId, onlyUnread }: GetNotificationsParams) {
  const where: Prisma.NotificationWhereInput = {
    ...(isAdmin ? { recipient: "admin" } : { userId }),
    ...(onlyUnread ? { isRead: false } : {}),
  };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({
      where: { ...where, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
}

export async function markAllNotificationsRead(recipient: "admin" | "user", userId?: string) {
  return prisma.notification.updateMany({
    where: {
      OR: [{ recipient }, { userId }],
      isRead: false,
    },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function getNotificationById(id: number) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function markNotificationRead(id: number) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}
