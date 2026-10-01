import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

// Same sand banner as the homepage's planner block.
export function ServicesContactStrip() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-2xl bg-calma-sand p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h2 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em] text-calma-ink sm:text-[28px]">
            {t.svc.contactTitle1} {t.svc.contactTitle2}
          </h2>
          <ul className="mb-6 mt-4 list-none space-y-2 p-0">
            {t.svc.contactFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[15px] text-calma-ink/80">
                <Check size={16} className="shrink-0 text-calma-olive" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
          >
            {t.svc.contactCta}
          </Link>
        </div>

        <div className="space-y-3">
          <div className="text-[13px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
            {t.svc.responseTime}: <span className="text-calma-ink">&lt; 30 min</span>
          </div>
          <a
            href="mailto:contact@calmatrip.com"
            className="flex items-center gap-3 rounded-xl bg-white p-4 text-calma-ink no-underline"
          >
            <Mail size={20} className="shrink-0 text-calma-olive" />
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                {t.svc.emailLabel}
              </div>
              <div className="text-[15px] font-semibold">contact@calmatrip.com</div>
            </div>
          </a>
          <a
            href="tel:+21621622972"
            className="flex items-center gap-3 rounded-xl bg-white p-4 text-calma-ink no-underline"
          >
            <Phone size={20} className="shrink-0 text-calma-olive" />
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                {t.svc.phoneLabel}
              </div>
              <div className="text-[15px] font-semibold" dir="ltr">
                +216 21 622 972
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
