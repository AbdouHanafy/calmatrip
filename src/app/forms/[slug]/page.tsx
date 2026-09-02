import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DynamicForm from "@/features/forms/components/DynamicForm";

export default async function PublicFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const slug = (await params).slug;
  const requested = (await searchParams).lang;
  const locale = ["fr", "en", "ar"].includes(requested ?? "") ? requested! : "fr";
  const form = await prisma.formDefinition.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      steps: {
        include: { fields: { orderBy: { position: "asc" } } },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!form) notFound();
  const settings = (form.settings ?? {}) as { saveDraft?: boolean };
  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-calma-sand px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-calma-border bg-white p-7 shadow-sm">
        <h1 className="font-fraunces text-4xl">{form.name}</h1>
        <div className="mt-8">
          <DynamicForm
            slug={slug}
            steps={form.steps}
            locale={locale}
            allowDraft={settings.saveDraft}
          />
        </div>
      </div>
    </main>
  );
}
