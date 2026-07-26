"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCalmaLang } from "@/lib/calma/i18n";
import { Reveal } from "./Reveal";

interface FaqItem {
  q: string;
  a: string;
}

export function ContactFaqSection({ faqs }: { faqs: FaqItem[] }) {
  const { t } = useCalmaLang();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2994A]">
              {t.cnt.faqKicker}
            </span>
            <h2 className="mt-3 font-fraunces text-[32px] font-normal text-[#2D2926] sm:text-[36px]">
              {t.cnt.faqTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#726C64]">
              {t.cnt.faqSub}
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <Reveal key={index} delay={Math.min(index * 0.05, 0.3)}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#F2994A]/30 bg-[#FBF8F1]"
                      : "border-[#F1EBE1] bg-white hover:bg-[#FBF8F1]/60"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-8"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-fraunces text-sm text-[#F2994A]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-fraunces text-[18px] transition-colors sm:text-[19px] ${isOpen ? "text-[#4A667D]" : "text-[#2D2926]"}`}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#F2994A] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-[#F2994A]/15 px-6 pb-6 pt-4 leading-relaxed text-[#726C64] sm:px-8 sm:pl-[4.75rem]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 text-center">
            <p className="text-[#726C64]">
              {t.cnt.faqNoAnswer}{" "}
              <Link
                href="/services"
                className="border-b border-[#F2994A] pb-0.5 text-[#4A667D] transition-colors hover:text-[#3A5164]"
              >
                {t.cnt.faqContactSupport}
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
