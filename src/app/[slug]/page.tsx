import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageRenderer } from "@/features/cms/components/PageRenderer";

async function getPage(slug: string) {
  return prisma.cmsPage.findFirst({
    where: { slug, locale: "fr", status: "PUBLISHED" },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const page = await getPage((await params).slug);
  if (!page) return {};
  const seo = (page.seo ?? {}) as Record<string, unknown>;
  return {
    title: typeof seo.title === "string" ? seo.title : page.title,
    description: typeof seo.metaDescription === "string" ? seo.metaDescription : undefined,
    alternates: typeof seo.canonicalUrl === "string" ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: seo.index !== false, follow: seo.follow !== false },
    openGraph: {
      title: typeof seo.ogTitle === "string" ? seo.ogTitle : page.title,
      description: typeof seo.ogDescription === "string" ? seo.ogDescription : undefined,
      images: typeof seo.ogImage === "string" ? [seo.ogImage] : undefined,
    },
  };
}

export default async function CmsPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  return (
    <PageRenderer
      blocks={page.blocks.map((block) => ({
        ...block,
        data: block.data as Record<string, unknown>,
      }))}
    />
  );
}
