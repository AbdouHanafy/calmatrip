import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navigationItemPatchSchema } from "@/features/cms/schemas/navigationSchemas";
import { requireCmsPermission } from "@/features/cms/services/server";
import { recordNavigationChange } from "@/features/cms/services/navigationMutation";

type Context = { params: Promise<{ id: string; itemId: string }> };

async function validParent(
  navigationId: string,
  itemId: string,
  parentId: string | null | undefined,
) {
  if (!parentId) return true;
  if (parentId === itemId) return false;
  let current: string | null = parentId;
  const seen = new Set<string>();
  while (current) {
    if (seen.has(current) || current === itemId) return false;
    seen.add(current);
    const parent: { navigationId: string; parentId: string | null } | null =
      await prisma.cmsNavigationItem.findUnique({
        where: { id: current },
        select: { navigationId: true, parentId: true },
      });
    if (!parent || parent.navigationId !== navigationId) return false;
    current = parent.parentId;
  }
  return true;
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = navigationItemPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid navigation item", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const { id: navigationId, itemId } = await params;
  const before = await prisma.cmsNavigationItem.findFirst({
    where: { id: itemId, navigationId },
  });
  if (!before) return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
  if (!(await validParent(navigationId, itemId, parsed.data.parentId)))
    return NextResponse.json({ error: "Invalid or circular parent relationship" }, { status: 400 });
  if (
    parsed.data.type === "PAGE" &&
    !(await prisma.cmsPage.findUnique({ where: { id: parsed.data.pageId! }, select: { id: true } }))
  )
    return NextResponse.json({ error: "CMS page not found" }, { status: 400 });
  const updated = await prisma.cmsNavigationItem.update({
    where: { id: itemId },
    data: {
      label: parsed.data.label,
      type: parsed.data.type,
      pageId: parsed.data.type === "PAGE" ? parsed.data.pageId : null,
      url: ["CUSTOM", "EXTERNAL"].includes(parsed.data.type) ? parsed.data.url : "",
      target: parsed.data.target,
      visible: parsed.data.visible,
      parentId: parsed.data.parentId,
      position: parsed.data.position,
    },
  });
  await recordNavigationChange({
    actorId: user.id,
    action: before.parentId !== updated.parentId ? "MOVE" : "UPDATE",
    navigationId,
    entityType: "CmsNavigationItem",
    entityId: itemId,
    before,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id: navigationId, itemId } = await params;
  const before = await prisma.cmsNavigationItem.findFirst({
    where: { id: itemId, navigationId },
    include: { _count: { select: { children: true } } },
  });
  if (!before) return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
  await prisma.cmsNavigationItem.delete({ where: { id: itemId } });
  await recordNavigationChange({
    actorId: user.id,
    action: "DELETE",
    navigationId,
    entityType: "CmsNavigationItem",
    entityId: itemId,
    before,
    metadata: { deletedChildren: before._count.children },
  });
  return new NextResponse(null, { status: 204 });
}
