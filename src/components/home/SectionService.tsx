"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ZelligePattern } from "@/components/ui/ZelligePattern";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  features: string[];
  images: string[];
  icon: any;
  color: string;
}

interface Props {
  services: Service[];
}

const DESCRIPTION_LIMIT = 250;

function htmlTextLength(html: string) {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

export default function SectionService({ services }: Props) {
  const [activeService, setActiveService] = useState(0);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setExpanded(false);
  }, [activeService]);

  const active = services[activeService];
  const router = useRouter();

  const nextImage = () => {
    if (!active?.images?.length) return;

    setCurrentImageIndex((prev) => (prev + 1) % active.images.length);
  };

  const prevImage = () => {
    if (!active?.images?.length) return;

    setCurrentImageIndex(
      (prev) => (prev - 1 + active.images.length) % active.images.length,
    );
  };

  const isLong = htmlTextLength(active?.description || "") > DESCRIPTION_LIMIT;

  if (!services.length) {
    return (
      <section className="py-28 bg-[#FAEDCD]">
        <div className="max-w-7xl mx-auto px-6">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="py-28 bg-[#FAEDCD] relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-[0.06]"
        style={{
          background: "#D4A373",
          transform: "translate(20%, -20%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4A373]" />

            <span className="font-sans-clean text-xs font-600 uppercase tracking-[0.25em] text-[#D4A373]">
              Our Services
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1] text-gray-900 mb-6">
            Everything you
            <br />
            <span className="italic font-300 text-[#D4A373]">need</span>
          </h2>

          <p className="font-sans-clean text-gray-600 text-base leading-relaxed">
            From the airport to your hotel, from desert excursions to cultural
            tours — we craft every journey as an experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveService(index)}
              className={`font-sans-clean text-sm font-500 px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeService === index
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-500 hover:text-gray-900 border border-gray-200"
              }`}
              style={
                activeService === index
                  ? {
                      background: service.color,
                    }
                  : {}
              }
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left */}
          <div
            className="relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-end p-10 group"
            style={{
              background: `linear-gradient(
                135deg,
                ${active.color}22 0%,
                ${active.color}11 100%
              )`,
              border: `1px solid ${active.color}30`,
            }}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <ZelligePattern />
            </div>

            {/* Icon */}
            <div
              className="absolute top-10 right-10 w-20 h-20 rounded-2xl flex items-center justify-center animate-float shadow-2xl"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${active.color},
                  ${active.color}99
                )`,
              }}
            >
              <active.icon className="w-10 h-10 text-white" />
            </div>

            {/* Carousel */}
            <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={
                  active.images?.[currentImageIndex] ||
                  "/placeholder-service.jpg"
                }
                alt={active.title}
                className="w-full h-full object-cover"
              />

              {active.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {active.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-8 bg-[#D4A373]"
                            : "w-2 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <p
              className="font-sans-clean text-xs uppercase tracking-widest mb-3"
              style={{
                color: active.color,
              }}
            >
              {active.subtitle}
            </p>

            <h3 className="font-display text-4xl font-bold text-gray-900 mb-4">
              {active.title}
            </h3>

            <div className="mb-6">
              <div
                className={`font-sans-clean text-gray-600 leading-relaxed ${
                  !expanded && isLong ? "max-h-[120px] overflow-hidden" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: active.description,
                }}
              />

              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-sm font-semibold text-[#D4A373]"
                >
                  {expanded ? "Show less ↑" : "Show more ↓"}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">From</p>

                <p
                  className="font-display text-2xl font-bold"
                  style={{
                    color: active.color,
                  }}
                >
                  {active.price}
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/services");
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white"
                style={{ background: active.color }}
              >
                Book
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {/* Features */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                What's included
              </p>

              <div className="space-y-3">
                {active.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: active.color,
                      }}
                    >
                      ✓
                    </div>

                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other services */}
            <div className="grid gap-3 flex-1">
              {services
                .filter((_, i) => i !== activeService)
                .map((service) => {
                  const Icon = service.icon;

                  return (
                    <button
                      key={service.id}
                      onClick={() =>
                        setActiveService(
                          services.findIndex((s) => s.id === service.id),
                        )
                      }
                      className="bg-white rounded-2xl px-5 py-4 border border-gray-100 hover:border-gray-300 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${service.color}15`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color: service.color,
                            }}
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {service.title}
                          </p>

                          <p className="text-xs text-gray-400">
                            {service.price}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
