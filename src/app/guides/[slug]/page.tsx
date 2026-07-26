import GuideDetailPage from "@/views/GuideDetailPage";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, breadcrumbSchema, SITE } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await prisma.practicalGuide.findUnique({ where: { slug } });

  if (!guide || !guide.active) {
    return buildMetadata({
      title: "Guide introuvable",
      description: "Ce guide pratique n'est plus disponible.",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: guide.title,
    description: guide.summary.replace(/<[^>]+>/g, "").slice(0, 155),
    path: `/guides/${guide.slug}`,
    ogImage: guide.image ?? undefined,
    keywords: guide.category ? [guide.category] : [],
  });
}

export default async function GuideDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await prisma.practicalGuide.findUnique({ where: { slug } });

  return (
    <>
      {guide && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema([
                { name: "Accueil", url: SITE.url },
                { name: "Guides pratiques", url: `${SITE.url}/guides` },
                { name: guide.title, url: `${SITE.url}/guides/${guide.slug}` },
              ]),
            ),
          }}
        />
      )}
      <GuideDetailPage />
    </>
  );
}
