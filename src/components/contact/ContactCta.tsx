"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

// Same sand banner as the homepage's planner block.
export function ContactCta() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pb-12 pt-12 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl bg-calma-sand md:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10">
          <h2 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em] text-calma-ink sm:text-[28px]">
            {t.cnt.ctaTitle}
          </h2>
          <p className="mb-6 mt-3 max-w-[460px] text-[15.5px] leading-relaxed text-calma-ink/80">
            {t.cnt.ctaSub}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+21621622972"
              className="inline-flex items-center gap-2 rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
            >
              <Phone size={16} /> {t.cnt.ctaCallBtn}
            </a>
            <Link
              href="https://wa.me/21621622972"
              className="inline-flex items-center gap-2 rounded-full border border-calma-ink/25 px-6 py-3 text-[15px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/60"
            >
              <MessageCircle size={16} /> {t.cnt.ctaWhatsappBtn}
            </Link>
          </div>
        </div>
        <div className="relative hidden min-h-[240px] md:block">
          <Image
            src="/images/hero/sea.png"
            alt=""
            fill
            sizes="(min-width: 1240px) 520px, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
