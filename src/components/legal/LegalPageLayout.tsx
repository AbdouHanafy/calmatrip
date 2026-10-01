"use client";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";

export function LegalPageLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <CalmaLangProvider>
      <CalmaHeader active="contact" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={title}
          subtitle={`Dernière mise à jour : ${updatedAt}`}
          crumbs={[{ label: "Accueil", href: "/" }, { label: title }]}
        />
        <div className="mx-auto max-w-[820px] px-4 pt-2 sm:px-6">
          <div className="legal-prose space-y-8 text-[15px] leading-[1.75] text-calma-ink/85">
            {children}
          </div>
        </div>
      </main>
      <CalmaFooter />
    </CalmaLangProvider>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="m-0 mb-3 text-[20px] font-bold text-calma-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
