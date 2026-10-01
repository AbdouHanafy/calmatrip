"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, MapPin, Star, ShieldCheck, Zap, Headset } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";
import { ServiceCard } from "@/components/services/ServiceCard";
import { BookingPromptModal } from "@/components/services/BookingPromptModal";
import { mapService, type DBService } from "@/lib/services/mapService";

interface ServiceReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

const wrap = "mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8";

function ServiceDetailContent() {
  const { t } = useCalmaLang();
  const params = useParams();
  const id =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [data, setData] = useState<{ service: DBService; related: DBService[] } | null | undefined>(
    undefined,
  );
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/services/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, [id]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then((json) => setReviews(Array.isArray(json) ? json : []))
      .catch(() => setReviews([]));
  }, []);

  if (data === undefined) {
    return (
      <>
        <CalmaHeader active="services" />
        <div className="min-h-screen bg-white" />
        <CalmaFooter />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <CalmaHeader active="services" />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 text-center font-hanken">
          <MapPin size={40} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
          <h1 className="m-0 mb-2 text-[22px] font-bold text-calma-ink">{t.svc.notFoundTitle}</h1>
          <p className="mb-5 mt-0 text-[15px] text-calma-taupe">{t.svc.notFoundHint}</p>
          <Link
            href="/services"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            {t.servicesBack}
          </Link>
        </div>
        <CalmaFooter />
      </>
    );
  }

  const service = mapService(data.service);
  const related = data.related.map(mapService);
  const serviceReviews = reviews.filter((r) => r.service === service.title);
  const avgRating =
    serviceReviews.length > 0
      ? serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length
      : null;
  const [mainImage, ...otherImages] = service.images;

  return (
    <>
      <CalmaHeader active="services" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={service.title}
          crumbs={[
            { label: t.cnt.breadcrumbHome, href: "/" },
            { label: t.navServices, href: "/services" },
            { label: service.title },
          ]}
        >
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-calma-taupe">
            <span className="text-[12px] font-semibold uppercase tracking-[.04em]">
              {service.subtitle}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {service.duration}
            </span>
            {avgRating !== null && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-calma-ink">
                <Star size={15} className="fill-calma-gold text-calma-gold" />
                {avgRating.toFixed(1)}
                <span className="font-normal text-calma-taupe">
                  ({serviceReviews.length}{" "}
                  {serviceReviews.length > 1 ? t.svc.reviewsWord : t.svc.reviewWord})
                </span>
              </span>
            )}
          </div>
        </PageHeader>

        {mainImage && (
          <section className={wrap}>
            <div className={`grid gap-2 ${otherImages.length > 0 ? "lg:grid-cols-[2fr_1fr]" : ""}`}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-calma-sand lg:aspect-auto lg:h-[420px]">
                <Image
                  src={mainImage}
                  alt={service.title}
                  fill
                  priority
                  sizes="(min-width: 1240px) 800px, 100vw"
                  className="object-cover"
                />
              </div>
              {otherImages.length > 0 && (
                <div className="hidden gap-2 lg:grid lg:h-[420px] lg:grid-rows-2">
                  {otherImages.slice(0, 2).map((src, i) => (
                    <div key={i} className="relative overflow-hidden rounded-2xl bg-calma-sand">
                      <Image src={src} alt="" fill sizes="400px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className={`${wrap} pt-8`}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <div
                className="text-[15.5px] leading-relaxed text-calma-ink [&_a]:text-calma-olive [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ps-5"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />

              {service.features.length > 0 && (
                <div className="mt-8 border-t border-calma-ink/10 pt-8">
                  <h2 className="m-0 mb-4 text-[20px] font-bold text-calma-ink">
                    {t.svc.detailFeaturesTitle}
                  </h2>
                  <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-3 p-0 sm:grid-cols-2">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check size={17} className="mt-0.5 shrink-0 text-calma-olive" />
                        <span className="text-[14.5px] text-calma-ink">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {serviceReviews.length > 0 && (
                <div className="mt-8 border-t border-calma-ink/10 pt-8">
                  <h2 className="m-0 mb-4 flex items-center gap-3 text-[20px] font-bold text-calma-ink">
                    {t.svc.reviewsTitle}
                    {avgRating !== null && (
                      <span className="inline-flex items-center gap-1 text-[15px] font-semibold">
                        <Star size={16} className="fill-calma-gold text-calma-gold" />
                        {avgRating.toFixed(1)}
                        <span className="font-normal text-calma-taupe">
                          ({serviceReviews.length})
                        </span>
                      </span>
                    )}
                  </h2>
                  <div className="space-y-3">
                    {serviceReviews.map((r) => (
                      <div key={r.id} className="rounded-xl border border-calma-ink/10 p-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[14.5px] font-bold text-calma-ink">{r.name}</span>
                          <div className="flex items-center gap-0.5" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < r.rating
                                    ? "fill-calma-gold text-calma-gold"
                                    : "text-calma-ink/15"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="m-0 text-[14.5px] leading-relaxed text-calma-taupe">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-calma-ink/15 bg-white p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,.18)] lg:sticky lg:top-24">
              <div className="text-[13px] text-calma-taupe">{t.svc.fromLabel}</div>
              <div className="mb-4 text-[28px] font-bold leading-tight text-calma-ink">
                {service.price}
              </div>
              <button
                type="button"
                onClick={() => setShowBooking(true)}
                className="w-full rounded-full bg-calma-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive"
              >
                {t.svc.bookThis}
              </button>

              <ul className="m-0 mt-5 list-none space-y-3 border-t border-calma-ink/10 p-0 pt-5">
                {[
                  { icon: ShieldCheck, label: t.svc.trustSecure },
                  { icon: Zap, label: t.svc.trustConfirm },
                  { icon: Headset, label: t.svc.trustSupport },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-[13.5px] text-calma-ink"
                  >
                    <Icon size={18} strokeWidth={1.7} className="shrink-0 text-calma-olive" />
                    {label}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="m-0 mb-5 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
                {t.svc.relatedTitle}
              </h2>
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((s) => (
                  <ServiceCard key={s.id} service={s} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
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
