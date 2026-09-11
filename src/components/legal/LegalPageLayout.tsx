"use client";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

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
      <div className="min-h-screen bg-calma-sand font-hanken">
        <div className="mx-auto max-w-[820px] px-6 py-16 sm:px-10">
          <h1 className="mb-2 font-fraunces text-[clamp(28px,4vw,42px)] font-normal text-calma-ink">
            {title}
          </h1>
          <p className="mb-10 text-sm text-calma-taupe">Dernière mise à jour : {updatedAt}</p>
          <div className="legal-prose space-y-8 text-[15px] leading-[1.75] text-calma-ink/85">
            {children}
          </div>
        </div>
      </div>
      <CalmaFooter />
    </CalmaLangProvider>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-fraunces text-xl font-semibold text-calma-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
