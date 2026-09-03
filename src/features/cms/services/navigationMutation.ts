import { revalidatePath, revalidateTag } from "next/cache";
import { auditCmsAction, createRevision } from "./server";
import { navigationSnapshot } from "./navigation";

export async function recordNavigationChange(input: {
  actorId: string;
  action: string;
  navigationId: string;
  entityType?: "CmsNavigation" | "CmsNavigationItem";
  entityId?: string;
  before?: unknown;
  metadata?: unknown;
}) {
  const snapshot = await navigationSnapshot(input.navigationId);
  if (snapshot) await createRevision("CmsNavigation", input.navigationId, snapshot, input.actorId);
  await auditCmsAction({
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType ?? "CmsNavigation",
    entityId: input.entityId ?? input.navigationId,
    before: input.before,
    after: snapshot,
    metadata: input.metadata,
  });
  revalidateTag("navigation");
  revalidatePath("/", "layout");
}
