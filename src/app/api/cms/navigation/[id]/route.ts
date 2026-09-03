import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navigationPatchSchema } from "@/features/cms/schemas/navigationSchemas";
import { requireCmsPermission, auditCmsAction } from "@/features/cms/services/server";
import { navigationSnapshot } from "@/features/cms/services/navigation";
import { recordNavigationChange } from "@/features/cms/services/navigationMutation";
import { revalidatePath, revalidateTag } from "next/cache";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Context) {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const navigation = await navigationSnapshot((await params).id);
  if (!navigation) return NextResponse.json({ error: "Navigation not found" }, { status: 404 });
  return NextResponse.json(navigation);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = navigationPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid navigation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const id = (await params).id;
  const before = await prisma.cmsNavigation.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Navigation not found" }, { status: 404 });
  if (
    parsed.data.key &&
    (await prisma.cmsNavigation.findFirst({ where: { key: parsed.data.key, id: { not: id } } }))
  )
    return NextResponse.json(
      { error: "A navigation with this key already exists" },
      { status: 409 },
    );
  const updated = await prisma.cmsNavigation.update({
    where: { id },
    data: {
      ...parsed.data,
      updatedBy: user.id,
      ...(parsed.data.status
        ? { publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null }
        : {}),
    },
  });
  await recordNavigationChange({
    actorId: user.id,
    action: before.status !== updated.status ? "STATUS_CHANGE" : "UPDATE",
    navigationId: id,
    before,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const before = await navigationSnapshot(id);
  if (!before) return NextResponse.json({ error: "Navigation not found" }, { status: 404 });
  await prisma.cmsNavigation.delete({ where: { id } });
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "CmsNavigation",
    entityId: id,
    before,
  });
  revalidateTag("navigation");
  revalidatePath("/", "layout");
  return new NextResponse(null, { status: 204 });
}
