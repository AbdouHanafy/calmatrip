import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  auditCmsAction,
  createRevision,
  requireCmsPermission,
} from "@/features/cms/services/server";

const schema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(100),
  action: z.enum(["PUBLISH", "ARCHIVE", "DELETE"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid bulk action", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (parsed.data.action === "PUBLISH" && !(await requireCmsPermission("content.publish")))
    return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });

  const type = await prisma.contentType.findUnique({
    where: { slug: (await params).slug },
    select: { id: true, publishingEnabled: true },
  });
  if (!type) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  if (parsed.data.action === "PUBLISH" && !type.publishingEnabled)
    return NextResponse.json(
      { error: "Publishing is disabled for this collection" },
      { status: 409 },
    );
  const entries = await prisma.contentEntry.findMany({
    where: { contentTypeId: type.id, id: { in: parsed.data.ids } },
  });
  if (entries.length !== new Set(parsed.data.ids).size)
    return NextResponse.json(
      { error: "One or more entries do not belong to this collection" },
      { status: 400 },
    );

  if (parsed.data.action === "DELETE")
    await prisma.contentEntry.deleteMany({
      where: { contentTypeId: type.id, id: { in: parsed.data.ids } },
    });
  else {
    const status = parsed.data.action === "PUBLISH" ? "PUBLISHED" : "ARCHIVED";
    await prisma.contentEntry.updateMany({
      where: { contentTypeId: type.id, id: { in: parsed.data.ids } },
      data: {
        status,
        updatedBy: user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        publishedBy: status === "PUBLISHED" ? user.id : null,
      },
    });
    const updated = await prisma.contentEntry.findMany({
      where: { contentTypeId: type.id, id: { in: parsed.data.ids } },
    });
    await Promise.all(
      updated.map((entry) => createRevision("ContentEntry", entry.id, entry, user.id)),
    );
  }
  await auditCmsAction({
    actorId: user.id,
    action: `BULK_${parsed.data.action}`,
    entityType: "ContentEntry",
    metadata: { ids: parsed.data.ids, contentTypeId: type.id },
  });
  return NextResponse.json({ affected: entries.length });
}
