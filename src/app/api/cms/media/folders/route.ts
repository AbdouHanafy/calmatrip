import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mediaFolderSchema } from "@/features/cms/schemas/mediaSchemas";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";
export async function GET() {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await prisma.cmsMediaFolder.findMany({ orderBy: { name: "asc" } }));
}
export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = mediaFolderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid folder", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (await prisma.cmsMediaFolder.findUnique({ where: { name: parsed.data.name } }))
    return NextResponse.json({ error: "Folder already exists" }, { status: 409 });
  const created = await prisma.cmsMediaFolder.create({
    data: { name: parsed.data.name, createdBy: user.id },
  });
  await auditCmsAction({
    actorId: user.id,
    action: "CREATE",
    entityType: "CmsMediaFolder",
    entityId: created.id,
    after: created,
  });
  return NextResponse.json(created, { status: 201 });
}
