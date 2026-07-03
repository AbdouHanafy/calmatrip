"use client";

import { useEffect, useState, ComponentType } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Check, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  features: string[];
  images: string[];
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface Props {
  services: Service[];
}

const DESCRIPTION_LIMIT = 250;

function htmlTextLength(html: string) {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

/* ── Illustrated SVG icons (line-art style) ── */
const Icon4x4 = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect x="8" y="22" width="48" height="22" rx="5" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <rect x="14" y="16" width="36" height="10" rx="3" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <circle cx="18" cy="46" r="6" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <circle cx="46" cy="46" r="6" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <line x1="24" y1="46" x2="40" y2="46" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <line x1="8" y1="30" x2="56" y2="30" stroke={active ? color : "#6B7280"} strokeWidth="1.5" strokeDasharray="3 2" />
    <rect x="20" y="18" width="10" height="8" rx="1.5" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" />
    <rect x="34" y="18" width="10" height="8" rx="1.5" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" />
  </svg>
);

const IconCamel = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M14 56 L14 40 Q12 30 20 26 Q26 22 28 28 Q31 20 38 20 Q46 20 46 28 L46 34 Q52 34 54 38 L54 44" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 56 L14 48" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M46 44 L46 56" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M38 44 L38 56" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="40" cy="15" r="5" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <path d="M28 28 Q34 34 42 32" stroke={active ? color : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconCar = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M10 36 L14 22 Q15 18 20 18 L44 18 Q49 18 50 22 L54 36 L54 46 L10 46 Z" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="20" cy="48" r="5" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <circle cx="44" cy="48" r="5" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <line x1="25" y1="48" x2="39" y2="48" stroke={active ? color : "#6B7280"} strokeWidth="2.2" />
    <path d="M14 36 L50 36" stroke={active ? color : "#6B7280"} strokeWidth="1.5" />
    <rect x="20" y="22" width="10" height="8" rx="2" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" />
    <rect x="34" y="22" width="10" height="8" rx="2" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" />
  </svg>
);

const IconBoat = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M32 8 L32 44" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M32 10 L12 38 L32 38 Z" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinejoin="round" fill={active ? `${color}18` : "transparent"} />
    <path d="M32 16 L52 38 L32 38" stroke={active ? color : "#9CA3AF"} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 48 Q16 43 26 48 Q36 53 46 48 Q56 43 58 48" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 54 Q20 49 30 54 Q40 59 50 54" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconRuins = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M10 54 L10 28 L22 16 L32 12 L42 16 L54 28 L54 54" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M6 54 L58 54" stroke={active ? color : "#6B7280"} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 28 L54 28" stroke={active ? color : "#6B7280"} strokeWidth="1.5" />
    <path d="M22 16 L22 28" stroke={active ? color : "#6B7280"} strokeWidth="1.5" />
    <path d="M42 16 L42 28" stroke={active ? color : "#6B7280"} strokeWidth="1.5" />
    <rect x="26" y="36" width="12" height="18" rx="2" stroke={active ? color : "#6B7280"} strokeWidth="2" />
    <circle cx="32" cy="22" r="3" stroke={active ? color : "#6B7280"} strokeWidth="1.8" />
  </svg>
);

const IconBalloon = ({ active, color }: { active: boolean; color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <ellipse cx="32" cy="24" rx="16" ry="18" stroke={active ? color : "#6B7280"} strokeWidth="2.2" fill={active ? `${color}12` : "transparent"} />
    <path d="M22 40 L20 52 L44 52 L42 40" stroke={active ? color : "#6B7280"} strokeWidth="2" strokeLinejoin="round" />
    <rect x="22" y="50" width="20" height="6" rx="2" stroke={active ? color : "#6B7280"} strokeWidth="2" />
    <path d="M32 6 L32 42" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" strokeDasharray="2 3" />
    <path d="M16 24 Q14 14 24 10" stroke={active ? color : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Each filter maps to keywords that match against service.title ── */
const QUICK_FILTERS = [
  { label: "4x4 Tours",           Icon: Icon4x4,      keywords: ["4x4", "jeep", "safari", "desert", "quad"] },
  { label: "Camel Treks",         Icon: IconCamel,    keywords: ["camel", "trek", "dromadaire", "sahara"] },
  { label: "Private Transfers",   Icon: IconCar,      keywords: ["transfer", "airport", "transport", "taxi", "private"] },
  { label: "Catamaran Trips",     Icon: IconBoat,     keywords: ["catamaran", "boat", "sea", "sailing", "cruise", "mer"] },
  { label: "Cultural Excursions", Icon: IconRuins,    keywords: ["cultural", "excursion", "history", "ruins", "carthage", "medina", "culture"] },
  { label: "Scenic Flights",      Icon: IconBalloon,  keywords: ["flight", "balloon", "scenic", "air", "montgolfière"] },
];

function findServiceIndexForFilter(
  services: Service[],
  keywords: string[]
): number {
  const idx = services.findIndex((s) =>
    keywords.some((kw) =>
      s.title.toLowerCase().includes(kw) ||
      s.subtitle?.toLowerCase().includes(kw) ||
      s.description?.toLowerCase().includes(kw)
    )
  );
  return idx;
}

export default function SectionService({ services }: Props) {
  const [activeService, setActiveService] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentImageIndex(0);
    setExpanded(false);
  }, [activeService]);

  if (!services || !services.length) {
    return (
      <section className="py-28 bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Loading services…</div>
      </section>
    );
  }

  const active = services[activeService];
  const isLong = htmlTextLength(active?.description || "") > DESCRIPTION_LIMIT;
  const accent = active.color || "#1B4D3E";

  // Some sources store the images list as an HTML-entity-encoded JSON
  // string, e.g. [&quot;https://...&quot;,&quot;https://...&quot;]
  // instead of a plain string[]. Decode entities before parsing.
  function decodeHtmlEntities(str: string): string {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  // Normalize images: handle both a real string[] and the case where images
  // arrive as a single (possibly HTML-entity-encoded) JSON-stringified
  // array in images[0]. Falls back gracefully if parsing still fails.
  function normalizeImages(raw: string[] | undefined): string[] {
    if (!raw || !raw.length) return [];
    if (
      typeof raw[0] === "string" &&
      raw.length === 1 &&
      decodeHtmlEntities(raw[0]).trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(decodeHtmlEntities(raw[0]));
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Still not valid JSON — fall through and treat as a normal list.
      }
    }
    return raw;
  }

  const images: string[] = normalizeImages(active.images);

  const handleFilterClick = (label: string, keywords: string[]) => {
    // Toggle off if already active
    if (activeFilter === label) {
      setActiveFilter(null);
      return;
    }
    setActiveFilter(label);

    // Find matching service
    const matchIdx = findServiceIndexForFilter(services, keywords);
    if (matchIdx !== -1) {
      setActiveService(matchIdx);
    }
    // If no match found, keep current service but still highlight the button
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">What we offer</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Services built<br />
              <span className="transition-colors duration-500" style={{ color: accent }}>around you</span>
            </h2>
          </div>

          {/* Service category pills */}
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => {
              const SIcon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveService(index);
                    setActiveFilter(null); // reset filter highlight when using pills
                  }}
                  className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 ${
                    activeService === index
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  style={activeService === index ? { background: service.color, borderColor: service.color } : {}}
                >
                  <SIcon className="w-3.5 h-3.5" />
                  {service.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Illustrated Filter Buttons ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
            Explore by experience
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_FILTERS.map(({ label, Icon: FIcon, keywords }) => {
              const isActive = activeFilter === label;
              // Check if this filter has a matching service
              const hasMatch = findServiceIndexForFilter(services, keywords) !== -1;

              return (
                <button
                  key={label}
                  onClick={() => {
                    router.push(
                      `/services`
                    );
                  }}
                  title={!hasMatch ? "No matching service available" : label}
                  className={`group relative flex flex-col items-center gap-3 py-5 px-2 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "shadow-md"
                      : !hasMatch
                      ? "border-transparent bg-gray-50 opacity-40 cursor-not-allowed"
                      : "border-transparent bg-gray-50 hover:bg-gray-100 hover:shadow-sm cursor-pointer"
                  }`}
                  style={isActive ? { background: `${accent}10`, borderColor: `${accent}35` } : {}}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{ background: accent }}
                    />
                  )}

                  <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                    <FIcon active={isActive} color={accent} />
                  </div>

                  <span
                    className={`text-xs font-semibold text-center leading-tight transition-colors duration-200 ${
                      isActive ? "" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                    style={isActive ? { color: accent } : {}}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active filter hint */}
          {activeFilter && (
            <div
              className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between"
            >
              <p className="text-sm text-gray-500">
                Showing results for{" "}
                <span className="font-semibold" style={{ color: accent }}>
                  {activeFilter}
                </span>
              </p>
              <button
                onClick={() => setActiveFilter(null)}
                className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Carousel */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl group/img">
              <img
                key={`${activeService}-${currentImageIndex}`}
                src={images?.[currentImageIndex]}
                alt={active.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block"
                  style={{ background: `${accent}cc`, color: "#fff" }}
                >
                  {active.subtitle}
                </span>
                <h3 className="text-2xl font-extrabold text-white leading-tight mt-1">{active.title}</h3>
              </div>
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow">
                    <ChevronLeft className="w-4 h-4 text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow">
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                  </button>
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Alternative services */}
            <div className="flex flex-col gap-3">
              {services.filter((_, i) => i !== activeService).slice(0, 2).map((service) => {
                const SIcon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setActiveService(services.findIndex((s) => s.id === service.id));
                      setActiveFilter(null);
                    }}
                    className="group/alt bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${service.color}15` }}>
                        <SIcon className="w-5 h-5" style={{ color: service.color }} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{service.title}</p>
                        <p className="text-xs text-gray-400 font-medium">{service.price}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover/alt:text-gray-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex-1">
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  <active.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Starting from</span>
                  <span className="text-3xl font-extrabold transition-colors duration-500" style={{ color: accent }}>{active.price}</span>
                </div>
              </div>

              <div
                className={`text-gray-600 text-[15px] leading-relaxed mb-2 ${!expanded && isLong ? "line-clamp-4" : ""}`}
                dangerouslySetInnerHTML={{ __html: active.description }}
              />
              {isLong && (
                <button onClick={() => setExpanded(!expanded)} className="text-sm font-semibold hover:underline mt-1" style={{ color: accent }}>
                  {expanded ? "Show less ↑" : "Read more ↓"}
                </button>
              )}

              <div className="h-px bg-gray-100 my-6" />

              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">What's included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${accent}15` }}>
                      <Check className="w-3 h-3" style={{ color: accent }} />
                    </div>
                    <span className="text-sm text-gray-700 leading-snug font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}08)`, border: `1px solid ${accent}20` }}
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">Ready to book this experience?</p>
                <p className="text-xs text-gray-500 mt-0.5">Our specialists are here to help you plan every detail.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: accent }}
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}