import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { MappedService } from "@/lib/services/mapService";

/**
 * Portrait "visual menu" card — whole card links to the service's detail page,
 * where the full description/features live. The card itself only carries what
 * helps someone scan and choose: a photo, the category, the title, the duration
 * and the price. A small "Réserver" pill stays available without leaving the grid.
 */
export function ServiceCard({
  service,
  onBook,
}: {
  service: MappedService;
  onBook: (id: string) => void;
}) {
  const { t } = useCalmaLang();
  const [imgError, setImgError] = useState(false);
  const hasImage = service.images.length > 0 && !imgError;
  const c = service.color;

  return (
    <Link
      href={`/services/${service.id}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[22px] no-underline shadow-[0_24px_60px_-32px_rgba(42,16,8,.35)] transition-shadow duration-500 hover:shadow-[0_32px_70px_-28px_rgba(42,16,8,.5)]"
    >
      {hasImage ? (
        <Image
          src={service.images[0]}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.07]"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(150deg, ${c}, ${c}99)` }}
        >
          <service.icon className="h-14 w-14 text-white/25" />
        </div>
      )}

      {/* Asymmetric scrim — the photo stays readable up top, text stays legible at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,8,4,0) 40%, rgba(20,8,4,.55) 72%, rgba(20,8,4,.88) 100%)",
        }}
      />

      {service.badge && (
        <div
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow"
          style={{ background: c }}
        >
          {service.badge}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
          {service.subtitle}
        </p>
        <h3 className="font-fraunces text-[21px] font-normal leading-[1.15] text-white">
          {service.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-white/70">
          <Clock className="h-3.5 w-3.5" />
          {service.duration}
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
              {t.svc.fromLabel}
            </p>
            <p className="font-fraunces text-lg font-semibold text-white">{service.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBook(service.id);
              }}
              className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-calma-ink transition-colors hover:bg-white"
            >
              {t.svc.bookShort}
            </button>
            <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-calma-ink">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
