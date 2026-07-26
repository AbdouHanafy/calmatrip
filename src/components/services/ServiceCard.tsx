import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Check, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { htmlTextLength, DESCRIPTION_LIMIT, type MappedService } from "@/lib/services/mapService";

export function ServiceCard({
  service,
  onBook,
}: {
  service: MappedService;
  onBook: (id: string) => void;
}) {
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
          <Image
            key={imgIdx}
            src={service.images[imgIdx]}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Carousel nav */}
          {service.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setImgIdx((i) => (i - 1 + service.images.length) % service.images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % service.images.length)}
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
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">
              {t.svc.fromLabel}
            </p>
            <p className="text-base font-extrabold leading-none" style={{ color: c }}>
              {service.price}
            </p>
          </div>
        </div>
      ) : (
        /* No-image fallback: colored header band */
        <div
          className="relative h-24 flex items-end p-5"
          style={{ background: `linear-gradient(135deg, ${c}22, ${c}08)` }}
        >
          {service.badge && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow"
              style={{ background: c }}
            >
              {service.badge}
            </div>
          )}
          <div className="ml-auto bg-white rounded-xl px-3 py-1.5 text-right shadow-sm">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">
              {t.svc.fromLabel}
            </p>
            <p className="text-base font-extrabold leading-none" style={{ color: c }}>
              {service.price}
            </p>
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {service.subtitle}
            </p>
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
              onClick={() => setExpanded((p) => !p)}
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
