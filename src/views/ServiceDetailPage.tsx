"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Clock, MapPin } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { Breadcrumbs } from "@/components/calma/Breadcrumbs";
import { ServiceCard } from "@/components/services/ServiceCard";
import { BookingPromptModal } from "@/components/services/BookingPromptModal";
import { mapService, type DBService } from "@/lib/services/mapService";

function ServiceDetailContent() {
  const { t } = useCalmaLang();
  const params = useParams();
  const id =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [data, setData] = useState<{ service: DBService; related: DBService[] } | null | undefined>(
    undefined,
  );
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/services/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, [id]);

  if (data === undefined) {
    return (
      <>
        <CalmaHeader active="services" />
        <div className="min-h-screen bg-calma-sand" />
        <CalmaFooter />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <CalmaHeader active="services" />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-calma-sand px-6 text-center">
          <MapPin className="mb-4 h-12 w-12 text-calma-taupe/30" />
          <h1 className="mb-2 font-fraunces text-2xl text-calma-ink">{t.svc.notFoundTitle}</h1>
          <p className="mb-5 text-sm text-calma-taupe">{t.svc.notFoundHint}</p>
          <Link
            href="/services"
            className="text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
          >
            ← {t.servicesBack}
          </Link>
        </div>
        <CalmaFooter />
      </>
    );
  }

  const service = mapService(data.service);
  const related = data.related.map(mapService);
  const c = service.color;

  return (
    <>
      <CalmaHeader active="services" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          {service.images.length > 0 ? (
            <Image
              src={service.images[0]}
              alt={service.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: c }} />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(21,36,46,.66)",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {service.subtitle}
            </div>
            <h1 className="text-balance font-fraunces text-[clamp(30px,4.2vw,46px)] font-normal leading-[1.08] tracking-[-0.02em] text-calma-cream">
              {service.title}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {service.duration}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-14 lg:px-0">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Services", href: "/services" },
              { label: service.title },
            ]}
          />
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
          >
            <ArrowLeft className="h-4 w-4" /> {t.servicesBack}
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-3xl border border-calma-olive/[.1] bg-white p-8 sm:p-10">
              <div
                className="text-[15px] leading-relaxed text-calma-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_a]:text-calma-terracotta"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />

              {service.features.length > 0 && (
                <div className="mt-8 border-t border-calma-border pt-8">
                  <h2 className="mb-4 font-fraunces text-lg font-normal text-calma-ink">
                    {t.svc.detailFeaturesTitle}
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {service.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div
                          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${c}18` }}
                        >
                          <Check className="h-3 w-3" style={{ color: c }} />
                        </div>
                        <span className="text-sm text-calma-taupe">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-3xl border border-calma-olive/[.1] bg-white p-6 sm:sticky sm:top-24">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: `${c}18` }}
              >
                <service.icon className="h-6 w-6" style={{ color: c }} />
              </div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-calma-taupe">
                {t.svc.fromLabel}
              </p>
              <p className="mb-6 font-fraunces text-3xl font-semibold" style={{ color: c }}>
                {service.price}
              </p>
              <button
                onClick={() => setShowBooking(true)}
                className="w-full rounded-2xl py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                style={{ background: c }}
              >
                {t.svc.bookThis}
              </button>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-fraunces text-2xl font-normal text-calma-ink">
                {t.svc.relatedTitle}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((s) => (
                  <ServiceCard key={s.id} service={s} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
      <CalmaFooter />

      {showBooking && <BookingPromptModal onClose={() => setShowBooking(false)} />}
    </>
  );
}

export default function ServiceDetailPage() {
  return (
    <CalmaLangProvider>
      <ServiceDetailContent />
    </CalmaLangProvider>
  );
}
