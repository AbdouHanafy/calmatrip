import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { BLOCK_REGISTRY, type RegisteredBlockType } from "@/features/cms/blocks/registry";

export async function preparePageBlocks(
  blocks: Array<{ type: RegisteredBlockType; data: Record<string, unknown> }>,
  publishing = false,
) {
  const prepared: Array<{
    type: RegisteredBlockType;
    position: number;
    data: Prisma.InputJsonValue;
  }> = [];
  for (const [position, block] of blocks.entries()) {
    const parsed = BLOCK_REGISTRY[block.type].schema.safeParse(block.data);
    if (!parsed.success)
      return { success: false as const, block: position, issues: parsed.error.flatten() };
    const data = parsed.data as Record<string, unknown>;
    if (
      [
        "EXPERIENCE_GRID",
        "ACCOMMODATION_GRID",
        "TOUR_GRID",
        "COLLECTION_LIST",
        "RELATED_CONTENT",
        "REVIEW_LIST",
        "TESTIMONIAL_SLIDER",
        "COMMUNITY_FEED",
      ].includes(block.type)
    ) {
      if (!data.contentType && publishing)
        return {
          success: false as const,
          block: position,
          issues: { formErrors: ["Select a collection before publishing"], fieldErrors: {} },
        };
      if (!data.contentType) {
        prepared.push({ type: block.type, position, data: data as Prisma.InputJsonValue });
        continue;
      }
      const target = await prisma.contentType.findFirst({
        where: { slug: String(data.contentType), active: true },
        select: { id: true },
      });
      if (!target)
        return {
          success: false as const,
          block: position,
          issues: { formErrors: ["The selected collection is unavailable"], fieldErrors: {} },
        };
    }
    if (["FORM", "CONTACT"].includes(block.type)) {
      if (!data.formSlug && publishing)
        return {
          success: false as const,
          block: position,
          issues: { formErrors: ["Select a form before publishing"], fieldErrors: {} },
        };
      if (!data.formSlug) {
        prepared.push({ type: block.type, position, data: data as Prisma.InputJsonValue });
        continue;
      }
      const target = await prisma.formDefinition.findUnique({
        where: { slug: String(data.formSlug) },
        select: { id: true, status: true },
      });
      if (!target)
        return {
          success: false as const,
          block: position,
          issues: { formErrors: ["The selected form does not exist"], fieldErrors: {} },
        };
      if (publishing && target.status !== "PUBLISHED")
        return {
          success: false as const,
          block: position,
          issues: {
            formErrors: ["Publish the selected form before publishing this page"],
            fieldErrors: {},
          },
        };
    }
    if (block.type === "RICH_TEXT") data.html = sanitizeHtml(String(data.html ?? ""));
    prepared.push({ type: block.type, position, data: data as Prisma.InputJsonValue });
  }
  return { success: true as const, blocks: prepared };
}
