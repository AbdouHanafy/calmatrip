import { Shield, Clock, Award, Headphones } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const WHY_ICONS = [Shield, Clock, Award, Headphones];
const WHY_COLORS = ["#4C7A92", "#D2B38B", "#E3CBAA", "#4C7A92"];

export function WhyChooseUs() {
  const { t } = useCalmaLang();
  const WHY = t.svc.why.map((w, i) => ({ ...w, icon: WHY_ICONS[i], color: WHY_COLORS[i] }));

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D2B38B]">
            {t.svc.whyKicker}
          </p>
          <h2 className="font-fraunces text-3xl font-normal text-[#15242E] lg:text-4xl">
            {t.svc.whyTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY.map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-gray-100 bg-[#F0E2CE] hover:bg-white hover:shadow-lg hover:border-gray-200 p-7 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${item.color}14` }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <h3 className="font-extrabold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
