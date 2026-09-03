import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCmsPermission } from "@/features/cms/services/server";
import { updateSettingsGroup } from "@/features/cms/services/settingsMutation";
import { getSiteSettingsUncached } from "@/features/cms/services/settings";
import { isSettingsGroup, settingsSchemaByGroup } from "@/features/cms/schemas/settingsSchemas";

export async function GET() {
  if (!(await requireCmsPermission("settings.manage")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const settings = await getSiteSettingsUncached();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const user = await requireCmsPermission("settings.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { group, data } = body as { group?: unknown; data?: unknown };
  if (!isSettingsGroup(group))
    return NextResponse.json({ error: "Unknown settings group" }, { status: 400 });
  if (!data || typeof data !== "object")
    return NextResponse.json({ error: "Missing settings data" }, { status: 400 });

  const parsed = settingsSchemaByGroup[group].safeParse(data);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  if (group === "branding") {
    const branding = parsed.data as { logoUrl: string | null; faviconUrl: string | null };
    for (const url of [branding.logoUrl, branding.faviconUrl]) {
      // Same-origin uploaded assets must actually exist in the Media Library —
      // never let the client wire an arbitrary/unauthorized media reference
      // into a setting that renders sitewide.
      if (url && url.startsWith("/uploads/")) {
        const exists = await prisma.cmsMedia.findFirst({ where: { url }, select: { id: true } });
        if (!exists)
          return NextResponse.json(
            { error: "Selected media asset was not found" },
            { status: 400 },
          );
      }
    }
  }

  await updateSettingsGroup({ group, data: parsed.data, actorId: user.id });
  const settings = await getSiteSettingsUncached();
  return NextResponse.json({ settings });
}
