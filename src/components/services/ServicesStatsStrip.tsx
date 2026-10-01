import { Star, MapPin, Award, Headphones } from "lucide-react";
import AnimatedStat from "@/components/calma/AnimatedStat";
import { useCalmaLang } from "@/lib/calma/i18n";

const STATS_ICONS = [Star, MapPin, Award, Headphones];
const STATS_VALUES = ["500+", "50+", "98%", "24/7"];

export function ServicesStatsStrip() {
  const { t } = useCalmaLang();
  const STATS = t.svc.statLabels.map((label, i) => ({
    label,
    value: STATS_VALUES[i],
    icon: STATS_ICONS[i],
  }));

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8">
      <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-5 rounded-xl border border-calma-ink/10 p-5 sm:grid-cols-4 lg:px-6">
        {STATS.map((s, i) => (
          <li key={i} className="flex items-center gap-3">
            <s.icon size={22} strokeWidth={1.7} className="shrink-0 text-calma-olive" />
            <div>
              <div className="text-[18px] font-bold leading-tight text-calma-ink">
                <AnimatedStat value={s.value} />
              </div>
              <div className="text-[13px] text-calma-taupe">{s.label}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
