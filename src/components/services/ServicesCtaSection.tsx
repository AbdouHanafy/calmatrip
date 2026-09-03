import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export function ServicesCtaSection() {
  const { t } = useCalmaLang();

  return (
    <section className="bg-calma-sand py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
        <div className="relative overflow-hidden rounded-calma-block bg-calma-olive p-12">
          <div
            className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[420px] w-[420px] rounded-full opacity-[.15] blur-[90px]"
            style={{ backgroundColor: "#D2B38B" }}
          />
          <div className="relative">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-calma-terracotta-soft">
              {t.svc.ctaKicker}
            </p>
            <h2 className="mb-4 font-fraunces text-3xl font-normal text-calma-cream md:text-4xl">
              {t.svc.ctaTitle}
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-calma-cream/70">{t.svc.ctaSub}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(210,179,139,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(210,179,139,.75)]"
                style={{
                  backgroundColor: "#D2B38B",
                }}
              >
                <Phone className="h-4 w-4" /> {t.svc.ctaBtn1}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-3.5 text-sm font-semibold text-calma-cream backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <Calendar className="h-4 w-4" /> {t.svc.ctaBtn2}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
