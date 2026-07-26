"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { Reveal } from "./Reveal";
import { ZelligePattern } from "./ZelligePattern";

export function ContactCta() {
  const { t } = useCalmaLang();

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate flex min-h-[440px] items-center overflow-hidden rounded-calma-block text-center text-calma-cream">
            <Image
              src="/images/explore/sahara_camel.png"
              alt="Désert du Sahara, Tunisie"
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="-z-10 object-cover"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(160deg,rgba(52,34,18,.88) 0%,rgba(36,51,63,.8) 45%,rgba(29,42,52,.9) 100%)",
              }}
            />
            <ZelligePattern id="contact-cta-zellige" opacity={0.08} />
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/3 h-[460px] w-[460px] rounded-full opacity-25 blur-[100px]"
              style={{ background: "radial-gradient(circle, #F2994A 0%, transparent 70%)" }}
            />
            <div className="relative mx-auto max-w-2xl px-8 py-20 sm:px-14">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-terracotta-soft backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta-soft" />
                {t.cnt.ctaKicker}
              </div>
              <h2 className="mb-5 text-balance font-fraunces text-[clamp(30px,4.2vw,44px)] font-normal leading-[1.08]">
                {t.cnt.ctaTitle}
              </h2>
              <p className="mx-auto mb-9 max-w-xl text-[17px] leading-[1.7] text-calma-cream/80">
                {t.cnt.ctaSub}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+21621622972"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-[15.5px] font-semibold text-calma-cream shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)]"
                  style={{
                    background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)",
                  }}
                >
                  <Phone className="h-4 w-4" />
                  <span>{t.cnt.ctaCallBtn}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <Link
                  href="https://wa.me/21621622972"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-9 py-4 text-[15.5px] font-semibold text-calma-cream transition-all duration-300 hover:-translate-y-1 hover:border-calma-terracotta-soft hover:text-calma-terracotta-soft"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t.cnt.ctaWhatsappBtn}</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
