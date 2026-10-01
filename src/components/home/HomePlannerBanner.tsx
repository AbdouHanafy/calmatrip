"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";

export default function HomePlannerBanner() {
  const { t } = useCalmaLang();
  const phone = useSiteSettings()?.contact.phone ?? "+216 21 622 972";

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl bg-calma-sand md:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10">
          <h2 className="m-0 text-[22px] font-bold leading-tight tracking-[-0.01em] text-calma-ink sm:text-[28px]">
            {t.home.plannerHeading}
          </h2>
          <p className="mb-6 mt-3 max-w-[460px] text-[15.5px] leading-relaxed text-calma-ink/80">
            {t.home.plannerSub}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
            >
              {t.home.plannerContact}
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-calma-ink/25 px-6 py-3 text-[15px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/60"
            >
              <Phone size={16} />
              <span dir="ltr">{phone}</span>
            </a>
          </div>
        </div>
        <div className="relative hidden min-h-[260px] md:block">
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
