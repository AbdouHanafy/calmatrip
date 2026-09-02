import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageRenderer } from "@/features/cms/components/PageRenderer";
import { requireCmsPermission } from "@/features/cms/services/server";

export default async function CmsPagePreview({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireCmsPermission("cms.read"))) notFound();
  const page = await prisma.cmsPage.findUnique({
    where: { id: (await params).id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!page) notFound();
  return (
    <div>
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 text-sm">
        <div>
          <strong>Draft preview</strong>
          <span className="ml-2 text-slate-500">
            {page.title} · {page.locale.toUpperCase()} · {page.status}
          </span>
        </div>
        <Link
          href={`/admin/cms/pages/${page.id}`}
          className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
        >
          Back to editor
        </Link>
      </div>
      <PageRenderer
        locale={page.locale}
        blocks={page.blocks.map((block) => ({
          ...block,
          data: block.data as Record<string, unknown>,
        }))}
      />
    </div>
  );
}
