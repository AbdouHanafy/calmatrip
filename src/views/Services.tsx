'use client';
import { useState, useEffect } from "react";
import {
  Car, Plane, MapPin, Clock, Users, Shield, Check, Package,
  Star, Phone, Mail, Award, Calendar, ChevronRight, Headphones,
  ArrowRight, ChevronLeft, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

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
  let color = "#4CAF50";

  if (category === "transport" || category === "transfer") {
    icon = title.includes("airport") ? Plane : Car;
    color = "#1B6CA8";
  } else if (category === "excursion") {
    icon = MapPin;
    color = "#2D8653";
  } else if (category === "group") {
    icon = Users;
    color = "#B5860D";
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
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">From</p>
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
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">From</p>
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
              {expanded ? "Show less ↑" : "Read more ↓"}
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
                +{service.features.length - 4} more included
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
            Book this experience
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const WHY = [
  { icon: Shield,     title: "Guaranteed safety",    desc: "Maintained vehicles, full insurance, certified drivers.",        color: "#1B6CA8" },
  { icon: Clock,      title: "Always on time",        desc: "Real-time GPS tracking. Your schedule is ours.",                color: "#2D8653" },
  { icon: Award,      title: "Premium quality",       desc: "Handpicked partners, consistent standards, no surprises.",      color: "#B5860D" },
  { icon: Headphones, title: "24/7 human support",    desc: "English, French, and Arabic-speaking specialists.",            color: "#7C3AED" },
];

const STATS = [
  { value: "500+", label: "Happy clients",     icon: Star       },
  { value: "50+",  label: "Destinations",      icon: MapPin     },
  { value: "98%",  label: "Satisfaction rate", icon: Award      },
  { value: "24/7", label: "Support",           icon: Headphones },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<MappedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/services")
      .then(async res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data: DBService[]) => setServices(data.filter(s => s.active !== false).map(mapService)))
      .catch(err => console.error("Error fetching services", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(services.map(s => s.subtitle).filter(Boolean)))];
  const filtered = activeCategory === "all" ? services : services.filter(s => s.subtitle === activeCategory);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F8FA]">

        {/* ── Hero — clean, editorial ── */}
        <section className="relative bg-[#0C1F14] text-white overflow-hidden">
          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          {/* Green glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20"
            style={{ background: "radial-gradient(circle, #4CAF50, #1B6CA8)" }}
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-8">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-gray-300">Premium services in Tunisia</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
                Every journey,{" "}
                <span className="text-[#4CAF50]">perfectly</span>{" "}
                <span className="text-[#87CEEB]">handled.</span>
              </h1>

              <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10">
                Let the rheem gazelle guide you
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#4CAF50] text-white rounded-xl font-semibold text-sm hover:bg-[#43A047] transition-colors shadow-lg shadow-[#4CAF50]/30">
                  Talk to a specialist <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/15 hover:bg-white/15 transition-colors backdrop-blur-sm">
                  Browse all bookings
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* Section header + category filter */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">What we offer</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                  Services tailored<br />to every traveller
                </h2>
              </div>

              {/* Category pills */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 capitalize ${
                        activeCategory === cat
                          ? "bg-[#0C1F14] text-white border-[#0C1F14]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                <p className="text-gray-400 font-medium">No services in this category yet.</p>
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">Why Calma Trip</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Built around your peace of mind</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map((item, i) => (
                <div key={i}
                  className="group rounded-3xl border border-gray-100 bg-[#F7F8FA] hover:bg-white hover:shadow-lg hover:border-gray-200 p-7 transition-all duration-300"
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
        <section className="py-20 bg-[#0C1F14]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#4CAF50] mb-4">Get in touch</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
                  Not sure what you need?<br />
                  <span className="text-[#87CEEB]">We'll figure it out together.</span>
                </h2>
                <div className="space-y-3 mb-8">
                  {[
                    "Certified professional drivers",
                    "Modern, air-conditioned fleet",
                    "Instant booking confirmation",
                    "Multi-language support 24/7",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#4CAF50]" />
                      </div>
                      <span className="text-gray-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#4CAF50] text-white rounded-xl font-semibold text-sm hover:bg-[#43A047] transition-colors shadow-lg shadow-[#4CAF50]/30">
                  Request a quote <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Contact card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Response time</p>
                    <p className="text-4xl font-extrabold text-[#FFD700]">&lt; 30 min</p>
                  </div>
                  <Calendar className="w-14 h-14 text-white/20" />
                </div>
                <div className="space-y-4">
                  <a href="mailto:contact@calmatrip.com"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                      <p className="text-white text-sm font-medium group-hover:text-[#87CEEB] transition-colors">contact@calmatrip.com</p>
                    </div>
                  </a>
                  <a href="tel:+21621622972"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-[#87CEEB]/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#87CEEB]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Phone</p>
                      <p className="text-white text-sm font-medium group-hover:text-[#87CEEB] transition-colors">+216 21 622 972</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-[#F7F8FA]">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <div className="bg-gradient-to-br from-[#0C1F14] to-[#1B4F6E] rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
              />
              <div className="relative">
                <p className="text-[#4CAF50] text-xs font-bold uppercase tracking-[0.3em] mb-4">Ready when you are</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Your next journey starts here.
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Join hundreds of travellers who explore Tunisia without the stress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4CAF50] text-white rounded-xl font-semibold text-sm hover:bg-[#43A047] transition-colors shadow-lg shadow-[#4CAF50]/30">
                    <Phone className="w-4 h-4" /> Contact us
                  </Link>
                  <Link href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/15 hover:bg-white/15 transition-colors backdrop-blur-sm">
                    <Calendar className="w-4 h-4" /> Book now
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4CAF50] flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Almost there!</h3>
                <p className="text-gray-500 text-sm">Log in to your account to confirm your booking.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard"
                  className="flex-1 py-3 bg-[#4CAF50] text-white rounded-2xl font-semibold text-sm text-center hover:bg-[#43A047] transition-colors">
                  Log in &amp; book
                </Link>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}