import ProductDetailPage from "@/views/ProductDetailPage";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, breadcrumbSchema, SITE } from "@/lib/seo";

function firstImage(raw: string | null): string | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
  } catch {
    // already a plain string URL
  }
  return raw;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);

  const product = isNaN(productId)
    ? null
    : await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return buildMetadata({
      title: "Produit introuvable",
      description: "Ce produit n'est plus disponible sur la Marketplace Calma Trip.",
      path: `/marketplace/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.description.replace(/<[^>]+>/g, "").slice(0, 155),
    path: `/marketplace/${product.id}`,
    ogImage: firstImage(product.image),
    keywords: [product.category, product.name],
  });
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = isNaN(productId)
    ? null
    : await prisma.product.findUnique({ where: { id: productId } });

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema([
                { name: "Accueil", url: SITE.url },
                { name: "Marketplace", url: `${SITE.url}/marketplace` },
                {
                  name: product.category,
                  url: `${SITE.url}/marketplace?category=${encodeURIComponent(product.category)}`,
                },
                { name: product.name, url: `${SITE.url}/marketplace/${product.id}` },
              ]),
            ),
          }}
        />
      )}
      <ProductDetailPage />
    </>
  );
}
