'use client';
import { useState } from "react";
import {
  Car, Plane, MapPin, Clock, Users, Shield, Check, Package,
  Star, Phone, Mail, Award, Calendar, ChevronRight, Headphones,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';
import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DBService {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;          // now HTML
  price: string;
  category?: string | null;
  duration?: string | null;
  popular: boolean;
  active: boolean;
  features: string[];           // JSON array from DB
  image?: string | null;        // single URL or JSON array
}

interface MappedService {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;          // HTML
  price: string;
  duration: string;
  badge?: string;
  features: string[];
  images: string[];             // parsed from image field
  gradient: string;
  iconBg: string;
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
  const title = s.title ?? "";

  let icon: React.ElementType = Car;
  let gradient = "from-[#87CEEB] to-[#4CAF50]";

  if (category === "transport" || category === "transfer") {
    icon = title.toLowerCase().includes("airport") ? Plane : Car;
    gradient = title.toLowerCase().includes("group")
      ? "from-[#87CEEB] to-[#FFD700]"
      : "from-[#FFD700] to-[#FFC107]";
  } else if (category === "excursion") {
    icon = MapPin;
    gradient = "from-[#4CAF50] to-[#45A049]";
  } else if (category === "group") {
    icon = Users;
    gradient = "from-[#87CEEB] to-[#FFD700]";
  }

  // features may come as a JSON string or already parsed array
  let features: string[] = [];
  if (Array.isArray(s.features)) {
    features = s.features as string[];
  } else if (typeof s.features === "string") {
    try { features = JSON.parse(s.features); } catch {}
  }

  return {
    id: s.id.toString(),
    icon,
    title,
    description: s.description,   // HTML
    price: s.price,
    duration: s.duration ?? "Custom",
    badge: s.popular ? "Popular" : undefined,
    features,
    images: parseImages(s.image),
    gradient,
    iconBg: gradient,
  };
}

// ─── Service Card ─────────────────────────────────────────────────────────────

// Strip HTML tags to measure plain-text length
function htmlTextLength(html: string): number {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

const DESCRIPTION_LIMIT = 300; // chars before "Show more" appears

function ServiceCard({
  service,
  onBook,
}: {
  service: MappedService;
  onBook: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasImage = service.images.length > 0 && !imgError;
  const isLong = htmlTextLength(service.description) > DESCRIPTION_LIMIT;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col">
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${service.gradient} flex-shrink-0`} />

      {/* Image */}
      {hasImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Extra images badge */}
          {service.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {service.images.slice(1, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover border-2 border-white shadow-md"
                />
              ))}
              {service.images.length > 4 && (
                <div className="w-9 h-9 rounded-lg bg-black/50 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +{service.images.length - 4}
                </div>
              )}
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Badge */}
      {service.badge && (
        <div className="absolute top-6 right-4 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${service.gradient} text-white shadow-lg`}>
            {service.badge}
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        {/* Icon + price row */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${service.iconBg} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <service.icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">From</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
              {service.price}
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              {service.duration}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>

        {/* Description — rendered as HTML with Show more */}
        <div className="mb-4">
          <div
            className={`text-gray-600 leading-relaxed text-sm overflow-hidden transition-all duration-300
              [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-gray-900
              [&_h2]:text-lg  [&_h2]:font-bold [&_h2]:mb-1 [&_h2]:text-gray-900
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
              [&_li]:my-0.5
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#87CEEB] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500
              [&_strong]:font-semibold [&_em]:italic [&_u]:underline
              [&_a]:text-[#87CEEB] [&_a]:underline
              [&_p]:mb-1
              ${!expanded && isLong ? "max-h-[4.5rem] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" : ""}`}
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className={`mt-1 text-xs font-semibold flex items-center gap-1 transition-colors bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent hover:opacity-80`}
            >
              {expanded ? "Show less ↑" : "Show more ↓"}
            </button>
          )}
        </div>

        {/* Features from DB */}
        {service.features.length > 0 && (
          <div className="space-y-2.5 mb-8">
            {service.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-start group/feature">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 transition-transform group-hover/feature:scale-110`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
            {service.features.length > 4 && (
              <div className="text-sm text-[#87CEEB] font-medium pl-8">
                +{service.features.length - 4} more benefits
              </div>
            )}
          </div>
        )}

        {/* Book button — full width */}
        <div className="mt-auto">
          <button
            onClick={() => onBook(service.id)}
            className={`w-full px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
          >
            <span>Book</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const WHY_CHOOSE_US = [
  { icon: Shield, title: "Guaranteed Safety", description: "Regularly maintained vehicles and full insurance for all our passengers.", gradient: "from-[#87CEEB] to-[#4CAF50]" },
  { icon: Clock,  title: "Punctuality",        description: "Strict adherence to agreed schedules with real-time GPS tracking.",           gradient: "from-[#FFD700] to-[#FFC107]" },
  { icon: Award,  title: "Premium Service",    description: "24/7 customer support and certified professional drivers.",                    gradient: "from-[#4CAF50] to-[#45A049]" },
  { icon: Users,  title: "Customer Service",   description: "24/7 support available in French, English, and Arabic.",                      gradient: "from-[#87CEEB] to-[#FFD700]" },
];

const STATS = [
  { value: "5000+", label: "Happy clients",      icon: Star      },
  { value: "50+",   label: "Destinations",       icon: MapPin    },
  { value: "98%",   label: "Satisfaction rate",  icon: Award     },
  { value: "24/7",  label: "Support available",  icon: Headphones },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<MappedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("/api/services")
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return res.json();
    })
    .then((data: DBService[]) => {
      const active = data.filter((s) => s.active !== false);
      setServices(active.map(mapService));
    })
    .catch((err) => {
      console.error("Error fetching services", err);
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="services-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M30 0 L45 15 L30 30 L15 15 Z" fill="#87CEEB" fillOpacity="0.3" />
                  <circle cx="30" cy="30" r="2" fill="#FFD700" />
                  <circle cx="15" cy="15" r="1.5" fill="#4CAF50" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#services-pattern)" />
            </svg>
          </div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#87CEEB] rounded-full blur-[100px] opacity-10" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFD700] rounded-full blur-[120px] opacity-10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <Package className="w-4 h-4 text-[#87CEEB]" />
                <span className="text-sm font-medium tracking-wide">Premium Services</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#87CEEB] via-[#FFD700] to-[#4CAF50] bg-clip-text text-transparent">
                Our Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Transport solutions tailored to all your needs for exploring Tunisia with complete peace of mind
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L1440 0V120H0Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Solutions</span>
                <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Services tailored to{" "}
                <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
                  all your needs
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our complete range of transport and excursion services in Tunisia
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-1.5 bg-gray-200" />
                    <div className="h-48 bg-gray-100" />
                    <div className="p-8 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded" />
                      <div className="h-4 bg-gray-100 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No services available at the moment.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Strengths</span>
                <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why choose us?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Recognized expertise and quality services for unforgettable journeys</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {WHY_CHOOSE_US.map((item, i) => (
                <div key={i} className="group text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features dark section ── */}
        <section className="py-20 bg-gradient-to-r from-[#0A1A2F] to-[#0F2740] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="features-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="3" fill="#87CEEB" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#features-pattern)" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-8 h-px bg-[#87CEEB]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Exclusive Benefits</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-[#FFD700]">Exceptional</span> service for{" "}
                  <span className="text-[#87CEEB]">unforgettable</span> journeys
                </h2>
                <div className="space-y-4">
                  {["Professional certified drivers", "Modern and comfortable vehicle fleet", "Easy booking and secure payment", "24/7 multi-language assistance"].map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-gray-300">{f}</p>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#87CEEB]/30 transition-all duration-300 group">
                  <span>Request a quote</span>
                  <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#87CEEB] to-[#FFD700] rounded-2xl blur-2xl opacity-20" />
                <div className="relative bg-gradient-to-br from-[#1B4F6E] to-[#0F2740] rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <Calendar className="w-12 h-12 text-[#87CEEB]" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#FFD700]">24/7</div>
                      <div className="text-xs text-gray-400">Support available</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-[#87CEEB]" /><span className="text-gray-300">contact@sahara-tunisia.com</span></div>
                    <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-[#87CEEB]" /><span className="text-gray-300">+216 70 000 000</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs><pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0 L30 20 L20 40 L10 20 Z" fill="white" fillOpacity="0.5" /></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">Ready to travel with us?</h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Contact our team now for a response within 30 minutes</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#1B4F6E] rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Phone className="w-4 h-4" /> Contact us
                  </Link>
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-black/30 transition-all duration-300 border border-white/30">
                    <Calendar className="w-4 h-4" /> Book now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Booking Modal ── */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setSelectedService(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking</h3>
                <p className="text-gray-600">To book this service, please log in to your customer account.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1 px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center">
                  Log in
                </Link>
                <button onClick={() => setSelectedService(null)} className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
        `}</style>
      </div>

      <Footer />
    </>
  );
}
