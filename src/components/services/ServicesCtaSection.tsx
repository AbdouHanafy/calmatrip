import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export function ServicesCtaSection() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-calma-ink/10 px-6 py-10 text-center sm:px-10">
        <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[28px]">
          {t.svc.ctaTitle}
        </h2>
        <p className="mx-auto mb-6 mt-3 max-w-[480px] text-[15.5px] leading-relaxed text-calma-taupe">
          {t.svc.ctaSub}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
          >
            <Phone size={16} /> {t.svc.ctaBtn1}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-calma-ink/25 px-6 py-3 text-[15px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/60"
          >
            <Calendar size={16} /> {t.svc.ctaBtn2}
          </Link>
        </div>
      </div>
    </section>
  );
}
