import ServiceDetailPage from "@/views/ServiceDetailPage";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, breadcrumbSchema, serviceSchema, SITE } from "@/lib/seo";

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

async function findService(id: string) {
  const serviceId = parseInt(id);
  if (isNaN(serviceId)) return null;
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.submissionStatus !== "approved" || !service.active) return null;
  return service;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = await findService(id);

  if (!service) {
    return buildMetadata({
      title: "Service introuvable",
      description: "Ce service n'est plus disponible sur Calma Trip.",
      path: `/services/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: service.title,
    description: service.description.replace(/<[^>]+>/g, "").slice(0, 155),
    path: `/services/${service.id}`,
    ogImage: firstImage(service.image),
    keywords: service.category ? [service.category, service.title] : [service.title],
  });
}

export default async function ServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await findService(id);

  return (
    <>
      {service && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              breadcrumbSchema([
                { name: "Accueil", url: SITE.url },
                { name: "Services", url: `${SITE.url}/services` },
                { name: service.title, url: `${SITE.url}/services/${service.id}` },
              ]),
              serviceSchema({
                name: service.title,
                description: service.description.replace(/<[^>]+>/g, ""),
                price: service.price,
                image: firstImage(service.image),
                url: `${SITE.url}/services/${service.id}`,
              }),
            ]),
          }}
        />
      )}
      <ServiceDetailPage />
    </>
  );
}
