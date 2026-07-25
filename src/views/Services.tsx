'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Car, Plane, MapPin, Clock, Users, Shield, Check, Package,
  Star, Phone, Mail, Award, Calendar, ChevronRight, Headphones,
  ArrowRight, ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import AnimatedStat from "@/components/calma/AnimatedStat";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DBService {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  category?: string | null;
  duration?: string | null;
  popular: boolean;
  active: boolean;
  features: string[];
  image?: string | null;
}

interface MappedService {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  duration: string;
  badge?: string;
  features: string[];
  images: string[];
  color: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {}
  return [raw];
}

function mapService(s: DBService): MappedService {
  const category = (s.category ?? "").toLowerCase();
  const title = s.title.toLowerCase();

  let icon: React.ElementType = Car;
  let color = "#F2994A";

  if (category === "transport" || category === "transfer") {
    icon = title.includes("airport") ? Plane : Car;
    color = "#4A667D";
  } else if (category === "excursion") {
    icon = MapPin;
    color = "#F2994A";
  } else if (category === "group") {
    icon = Users;
    color = "#F7B77E";
  }

  let features: string[] = [];
  if (Array.isArray(s.features)) features = s.features as string[];
  else if (typeof s.features === "string") {
    try { features = JSON.parse(s.features); } catch {}
  }

  return {
    id: s.id.toString(),
    icon,
    title: s.title,
    subtitle: s.subtitle ?? category,
    description: s.description,
    price: s.price,
    duration: s.duration ?? "Custom",
    badge: s.popular ? "Popular" : undefined,
    features,
    images: parseImages(s.image),
    color,
  };
}

function htmlTextLength(html: string): number {
  return html.replace(/<[^>]+>/g, "").trim().length;
}
const DESCRIPTION_LIMIT = 280;

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, onBook }: { service: MappedService; onBook: (id: string) => void }) {
  const { t } = useCalmaLang();
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasImage = service.images.length > 0 && !imgError;
  const isLong = htmlTextLength(service.description) > DESCRIPTION_LIMIT;
  const c = service.color;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-500 flex flex-col">

      {/* Image area */}
      {hasImage ? (
        <div className="relative w-full h-52 overflow-hidden bg-gray-100">
          <img
            key={imgIdx}
            src={service.images[imgIdx]}
            alt={service.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Carousel nav */}
          {service.images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + service.images.length) % service.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % service.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {service.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badge */}
          {service.badge && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow"
              style={{ background: c }}
            >
              {service.badge}
            </div>
          )}

          {/* Price chip on image */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 text-right shadow-md">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">{t.svc.fromLabel}</p>
            <p className="text-base font-extrabold leading-none" style={{ color: c }}>{service.price}</p>
          </div>
        </div>
      ) : (
        /* No-image fallback: colored header band */
        <div className="relative h-24 flex items-end p-5" style={{ background: `linear-gradient(135deg, ${c}22, ${c}08)` }}>
          {service.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow" style={{ background: c }}>
              {service.badge}
            </div>
          )}
          <div className="ml-auto bg-white rounded-xl px-3 py-1.5 text-right shadow-sm">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">{t.svc.fromLabel}</p>
            <p className="text-base font-extrabold leading-none" style={{ color: c }}>{service.price}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">

        {/* Icon + meta */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${c}18` }}
          >
            <service.icon className="w-5 h-5" style={{ color: c }} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{service.subtitle}</p>
            <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{service.title}</h3>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-400 font-medium flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {service.duration}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <div
            className={`text-gray-500 text-sm leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
              [&_li]:my-0.5 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic
              [&_a]:underline [&_h2]:font-bold [&_h3]:font-semibold
              ${!expanded && isLong ? "line-clamp-3" : ""}`}
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
          {isLong && (
            <button
              onClick={() => setExpanded(p => !p)}
              className="mt-1.5 text-xs font-semibold hover:underline"
              style={{ color: c }}
            >
              {expanded ? t.svc.showLess : t.svc.readMore}
            </button>
          )}
        </div>

        {/* Features */}
        {service.features.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mb-5">
            {service.features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c}18` }}
                >
                  <Check className="w-2.5 h-2.5" style={{ color: c }} />
                </div>
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
            {service.features.length > 4 && (
              <p className="text-xs font-medium pl-6" style={{ color: c }}>
                +{service.features.length - 4} {t.svc.moreIncluded}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <button
            onClick={() => onBook(service.id)}
            className="w-full py-3 px-5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 group/btn"
            style={{ background: c }}
          >
            {t.svc.bookThis}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const WHY_ICONS = [Shield, Clock, Award, Headphones];
const WHY_COLORS = ["#4A667D", "#F2994A", "#F7B77E", "#4A667D"];

const STATS_ICONS = [Star, MapPin, Award, Headphones];
const STATS_VALUES = ["500+", "50+", "98%", "24/7"];

// ─── Page ─────────────────────────────────────────────────────────────────────

function ServicesContent() {
  const { t } = useCalmaLang();
  const WHY = t.svc.why.map((w, i) => ({ ...w, icon: WHY_ICONS[i], color: WHY_COLORS[i] }));
  const STATS = t.svc.statLabels.map((label, i) => ({ label, value: STATS_VALUES[i], icon: STATS_ICONS[i] }));
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<MappedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchParams = useSearchParams();
  const q = (searchParams?.get("q") ?? "").trim();

  useEffect(() => {
    fetch("/api/services")
      .then(async res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data: DBService[]) => setServices(data.filter(s => s.active !== false).map(mapService)))
      .catch(err => console.error("Error fetching services", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(services.map(s => s.subtitle).filter(Boolean)))];
  const byCategory = activeCategory === "all" ? services : services.filter(s => s.subtitle === activeCategory);
  const needle = q.toLowerCase();
  const filtered = needle
    ? byCategory.filter(s =>
        `${s.title} ${s.subtitle} ${s.description.replace(/<[^>]+>/g, " ")}`
          .toLowerCase()
          .includes(needle)
      )
    : byCategory;

  return (
    <>
      <CalmaHeader active="services" />
      <div className="min-h-screen bg-calma-sand font-hanken">

        {/* ── Hero — luxury concierge, photo-backed, topographic texture ── */}
        <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          <Image
            src="/images/tunisia.jpeg"
            alt="Sidi Bou Saïd, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.6) 45%,rgba(42,38,34,.8) 100%)',
            }}
          />
          {/* subtle sand-ripple texture, replaces literal decorative shapes */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)',
            }}
          />

          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.svc.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.svc.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.svc.heroSub}
            </p>
          </div>
        </section>

        {/* ── Stats strip — animated count-up ── */}
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

        {/* ── Services Grid ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* Section header + category filter */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#F2994A]">{t.svc.offerKicker}</p>
                <h2 className="font-fraunces text-3xl font-normal leading-tight text-[#2D2926] lg:text-4xl">
                  {t.svc.offerTitle1}<br />{t.svc.offerTitle2}
                </h2>
              </div>

              {/* Category pills */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-1.5 rounded-full border border-calma-olive/10 bg-white p-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="relative rounded-full px-4 py-2 text-sm font-semibold capitalize text-calma-taupe transition-colors duration-200 data-[active=true]:text-white"
                      data-active={activeCategory === cat}
                    >
                      {activeCategory === cat && (
                        <motion.span
                          layoutId="services-cat-pill"
                          className="absolute inset-0 rounded-full bg-calma-olive"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-[1]">{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bandeau de recherche active */}
            {q && !loading && (
              <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#F1EBE1] bg-white px-5 py-3.5">
                <p className="text-sm text-[#726C64]">
                  {filtered.length > 0
                    ? <>{filtered.length} {filtered.length > 1 ? t.svc.resultsWord : t.svc.resultWord} {t.svc.forWord} <b className="font-fraunces text-[#2D2926]">“{q}”</b></>
                    : <>{t.svc.noResultsFor} <b className="font-fraunces text-[#2D2926]">“{q}”</b> {t.svc.noResultsHint}</>}
                </p>
                <Link
                  href="/services"
                  className="ml-auto rounded-full border border-[#F1EBE1] px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-[#726C64] transition-colors hover:border-[#F2994A] hover:text-[#2D2926]"
                >
                  {t.svc.clearSearch}
                </Link>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-gray-100">
                    <div className="h-52 bg-gray-100" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-gray-100 rounded-lg w-2/3" />
                      <div className="h-3 bg-gray-50 rounded-lg" />
                      <div className="h-3 bg-gray-50 rounded-lg w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">
                  {q ? t.svc.emptySearch : t.svc.emptyCategory}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(service => (
                  <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Why Choose Us — horizontal cards ── */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#F2994A]">{t.svc.whyKicker}</p>
              <h2 className="font-fraunces text-3xl font-normal text-[#2D2926] lg:text-4xl">{t.svc.whyTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map((item, i) => (
                <div key={i}
                  className="group rounded-3xl border border-gray-100 bg-[#F1EBE1] hover:bg-white hover:shadow-lg hover:border-gray-200 p-7 transition-all duration-300"
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

        {/* ── Contact strip ── */}
        <section className="relative overflow-hidden bg-calma-olive py-20">
          <div
            className="pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-20 blur-[90px]"
            style={{ background: 'radial-gradient(circle, #F2994A 0%, transparent 70%)' }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-calma-terracotta-soft">{t.svc.contactKicker}</p>
                <h2 className="mb-6 font-fraunces text-3xl font-normal leading-tight text-calma-cream lg:text-4xl">
                  {t.svc.contactTitle1}<br />
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
                  style={{ background: 'linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)' }}
                >
                  {t.svc.contactCta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Contact card */}
              <div className="rounded-calma-block border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-calma-cream/50">{t.svc.responseTime}</p>
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
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-calma-cream/50">{t.svc.emailLabel}</p>
                      <p className="text-sm font-medium text-calma-cream transition-colors group-hover:text-calma-terracotta-soft">contact@calmatrip.com</p>
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
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-calma-cream/50">{t.svc.phoneLabel}</p>
                      <p className="text-sm font-medium text-calma-cream transition-colors group-hover:text-calma-terracotta-soft">+216 21 622 972</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-calma-sand py-20">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
            <div className="relative overflow-hidden rounded-calma-block bg-calma-olive p-12">
              <div
                className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[420px] w-[420px] rounded-full opacity-[.15] blur-[90px]"
                style={{ background: 'radial-gradient(circle, #F2994A 0%, transparent 70%)' }}
              />
              <div className="relative">
                <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-calma-terracotta-soft">{t.svc.ctaKicker}</p>
                <h2 className="mb-4 font-fraunces text-3xl font-normal text-calma-cream md:text-4xl">
                  {t.svc.ctaTitle}
                </h2>
                <p className="mx-auto mb-8 max-w-lg text-calma-cream/70">
                  {t.svc.ctaSub}
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(242,153,74,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(242,153,74,.75)]"
                    style={{ background: 'linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)' }}
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

        {/* ── Booking Modal ── */}
        {selectedService && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedService(null)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4A667D] flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{t.svc.modalTitle}</h3>
                <p className="text-gray-500 text-sm">{t.svc.modalSub}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard"
                  className="flex-1 py-3 bg-[#4A667D] text-white rounded-2xl font-semibold text-sm text-center hover:bg-[#3A5164] transition-colors">
                  {t.svc.modalLogin}
                </Link>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  {t.svc.modalClose}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <CalmaFooter />
    </>
  );
}

export default function Services() {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-calma-sand" />}>
        <ServicesContent />
      </Suspense>
    </CalmaLangProvider>
  );
}