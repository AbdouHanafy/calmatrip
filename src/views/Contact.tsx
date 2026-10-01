"use client";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactSidebar } from "@/components/contact/ContactSidebar";
import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactCta } from "@/components/contact/ContactCta";

interface FaqItem {
  q: string;
  a: string;
}

function ContactContent({ faqs }: { faqs: FaqItem[] }) {
  const { t } = useCalmaLang();

  return (
    <>
      <CalmaHeader active="contact" />
      <main className="min-h-screen bg-white font-hanken">
        <PageHeader
          title={`${t.cnt.heroTitle1} ${t.cnt.heroTitleEm}`}
          subtitle={t.cnt.heroSub}
          image="/images/explore/chebika_oasis.png"
          imageAlt="Chebika, Tunisie"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.navContact }]}
        />

        <ContactInfoCards />

        <section className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[55fr_45fr] lg:gap-8">
            <ContactForm />
            <ContactSidebar />
          </div>
        </section>

        <ContactFaqSection faqs={faqs} />
        <ContactCta />
      </main>
      <CalmaFooter />
    </>
  );
}

export default function Contact({ faqs }: { faqs: FaqItem[] }) {
  return (
    <CalmaLangProvider>
      <ContactContent faqs={faqs} />
    </CalmaLangProvider>
  );
}
