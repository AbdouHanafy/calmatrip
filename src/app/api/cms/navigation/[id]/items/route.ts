import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navigationItemInputSchema } from "@/features/cms/schemas/navigationSchemas";
import { requireCmsPermission } from "@/features/cms/services/server";
import { recordNavigationChange } from "@/features/cms/services/navigationMutation";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = navigationItemInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid navigation item", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const navigationId = (await params).id;
  if (
    !(await prisma.cmsNavigation.findUnique({ where: { id: navigationId }, select: { id: true } }))
  )
    return NextResponse.json({ error: "Navigation not found" }, { status: 404 });
  if (parsed.data.parentId) {
    const parent = await prisma.cmsNavigationItem.findUnique({
      where: { id: parsed.data.parentId },
    });
    if (!parent || parent.navigationId !== navigationId)
      return NextResponse.json(
        { error: "Parent does not belong to this navigation" },
        { status: 400 },
      );
  }
  if (
    parsed.data.type === "PAGE" &&
    !(await prisma.cmsPage.findUnique({ where: { id: parsed.data.pageId! }, select: { id: true } }))
  )
    return NextResponse.json({ error: "CMS page not found" }, { status: 400 });
  const position = await prisma.cmsNavigationItem.count({
    where: { navigationId, parentId: parsed.data.parentId ?? null },
  });
  const created = await prisma.cmsNavigationItem.create({
    data: {
      navigationId,
      label: parsed.data.label,
      type: parsed.data.type,
      pageId: parsed.data.type === "PAGE" ? parsed.data.pageId : null,
      url: ["CUSTOM", "EXTERNAL"].includes(parsed.data.type) ? parsed.data.url : "",
      target: parsed.data.target,
      visible: parsed.data.visible,
      parentId: parsed.data.parentId,
      position,
    },
  });
  await recordNavigationChange({
    actorId: user.id,
    action: "CREATE",
    navigationId,
    entityType: "CmsNavigationItem",
    entityId: created.id,
  });
  return NextResponse.json(created, { status: 201 });
}
