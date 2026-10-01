import { Shield, Clock, Award, Headphones } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const WHY_ICONS = [Shield, Clock, Award, Headphones];

export function WhyChooseUs() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.svc.whyTitle}
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.svc.why.map((item, i) => {
          const Icon = WHY_ICONS[i];
          return (
            <div key={i} className="rounded-xl border border-calma-ink/10 p-5">
              <Icon size={24} strokeWidth={1.7} className="mb-3 text-calma-olive" />
              <h3 className="m-0 text-[15.5px] font-bold text-calma-ink">{item.title}</h3>
              <p className="mb-0 mt-1.5 text-[14px] leading-snug text-calma-taupe">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
