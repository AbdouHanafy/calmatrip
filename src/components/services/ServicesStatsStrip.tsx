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
    <section className="border-b border-calma-olive/10 bg-calma-cream py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-calma-terracotta/10">
              <s.icon className="h-5 w-5 text-calma-terracotta" />
            </div>
            <div>
              <p className="font-fraunces text-2xl font-semibold text-calma-ink">
                <AnimatedStat value={s.value} />
              </p>
              <p className="text-xs font-medium text-calma-taupe">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
