"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export interface HomeFaqItem {
  q: string;
  a: string;
}

export default function HomeFaq({ faqs }: { faqs: HomeFaqItem[] }) {
  const { t } = useCalmaLang();
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-12">
        <div>
          <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
            {t.home.faqHeading}
          </h2>
          <p className="mb-4 mt-2 text-[15px] leading-relaxed text-calma-taupe">{t.home.faqSub}</p>
          <Link
            href="/contact#faq"
            className="text-[14.5px] font-semibold text-calma-ink underline underline-offset-4"
          >
            {t.home.faqMore}
          </Link>
        </div>

        <div className="divide-y divide-calma-ink/10 rounded-xl border border-calma-ink/10">
          {faqs.slice(0, 6).map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span className="text-[15.5px] font-semibold text-calma-ink">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-calma-taupe transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="m-0 px-5 pb-5 text-[14.5px] leading-relaxed text-calma-taupe">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
