"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCalmaLang } from "@/lib/calma/i18n";

interface FaqItem {
  q: string;
  a: string;
}

export function ContactFaqSection({ faqs }: { faqs: FaqItem[] }) {
  const { t } = useCalmaLang();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.cnt.faqTitle}
      </h2>
      <p className="mb-5 mt-2 max-w-[560px] text-[15px] leading-relaxed text-calma-taupe">
        {t.cnt.faqSub}
      </p>

      <div className="max-w-[860px] divide-y divide-calma-ink/10 rounded-xl border border-calma-ink/10">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
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

      <p className="mt-5 text-[14.5px] text-calma-taupe">
        {t.cnt.faqNoAnswer}{" "}
        <Link
          href="/services"
          className="font-semibold text-calma-ink underline underline-offset-4"
        >
          {t.cnt.faqContactSupport}
        </Link>
      </p>
    </section>
  );
}
