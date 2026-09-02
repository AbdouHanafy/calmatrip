import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, type CmsPermission } from "./permissions";

export async function requireCmsPermission(permission: CmsPermission) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, permission)) return null;
  return session.user;
}

const json = (value: unknown) => value as Prisma.InputJsonValue;

export async function auditCmsAction(input: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
}) {
  await prisma.cmsAuditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      before: input.before === undefined ? undefined : json(input.before),
      after: input.after === undefined ? undefined : json(input.after),
      metadata: input.metadata === undefined ? undefined : json(input.metadata),
    },
  });
}

export async function createRevision(
  entityType: string,
  entityId: string,
  snapshot: unknown,
  actorId?: string,
) {
  const latest = await prisma.cmsRevision.findFirst({
    where: { entityType, entityId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  return prisma.cmsRevision.create({
    data: {
      entityType,
      entityId,
      version: (latest?.version ?? 0) + 1,
      snapshot: json(snapshot),
      actorId,
    },
  });
}

export function publicationData(status: string, actorId: string) {
  return status === "PUBLISHED"
    ? { publishedAt: new Date(), publishedBy: actorId }
    : { publishedAt: null, publishedBy: null };
}
