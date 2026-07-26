import Link from "next/link";
import { Check, Calendar, Mail, Phone, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export function ServicesContactStrip() {
  const { t } = useCalmaLang();

  return (
    <section className="relative overflow-hidden bg-calma-olive py-20">
      <div
        className="pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-20 blur-[90px]"
        style={{ background: "radial-gradient(circle, #F2994A 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-calma-terracotta-soft">
              {t.svc.contactKicker}
            </p>
            <h2 className="mb-6 font-fraunces text-3xl font-normal leading-tight text-calma-cream lg:text-4xl">
              {t.svc.contactTitle1}
              <br />
              <em className="italic text-calma-terracotta-soft">{t.svc.contactTitle2}</em>
            </h2>
            <div className="mb-8 space-y-3">
              {t.svc.contactFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-calma-terracotta-soft/20">
                    <Check className="h-3 w-3 text-calma-terracotta-soft" />
                  </div>
                  <span className="text-sm text-calma-cream/75">{f}</span>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(242,153,74,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(242,153,74,.75)]"
              style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
            >
              {t.svc.contactCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Contact card */}
          <div className="rounded-calma-block border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-calma-cream/50">
                  {t.svc.responseTime}
                </p>
                <p className="text-4xl font-extrabold text-calma-terracotta-soft">&lt; 30 min</p>
              </div>
              <Calendar className="h-14 w-14 text-white/20" />
            </div>
            <div className="space-y-4">
              <a
                href="mailto:contact@calmatrip.com"
                className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-calma-terracotta-soft/20">
                  <Mail className="h-5 w-5 text-calma-terracotta-soft" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-calma-cream/50">
                    {t.svc.emailLabel}
                  </p>
                  <p className="text-sm font-medium text-calma-cream transition-colors group-hover:text-calma-terracotta-soft">
                    contact@calmatrip.com
                  </p>
                </div>
              </a>
              <a
                href="tel:+21621622972"
                className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-calma-terracotta-soft/20">
                  <Phone className="h-5 w-5 text-calma-terracotta-soft" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-calma-cream/50">
                    {t.svc.phoneLabel}
                  </p>
                  <p className="text-sm font-medium text-calma-cream transition-colors group-hover:text-calma-terracotta-soft">
                    +216 21 622 972
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
