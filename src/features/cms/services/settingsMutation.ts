import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SettingsGroup } from "../schemas/settingsSchemas";
import { auditCmsAction, createRevision } from "./server";

export async function updateSettingsGroup(input: {
  group: SettingsGroup;
  data: Record<string, unknown>;
  actorId: string;
}) {
  const before = await prisma.siteSetting.findUnique({ where: { key: input.group } });
  const after = await prisma.siteSetting.upsert({
    where: { key: input.group },
    create: {
      key: input.group,
      group: input.group,
      value: input.data as Prisma.InputJsonValue,
      updatedBy: input.actorId,
    },
    update: {
      value: input.data as Prisma.InputJsonValue,
      updatedBy: input.actorId,
    },
  });

  await createRevision("SiteSetting", input.group, after.value, input.actorId);
  await auditCmsAction({
    actorId: input.actorId,
    action: `site_settings.${input.group}.updated`,
    entityType: "SiteSetting",
    entityId: after.id,
    before: before?.value,
    after: after.value,
  });

  revalidateTag("site-settings");
  revalidatePath("/", "layout");

  return after;
}
