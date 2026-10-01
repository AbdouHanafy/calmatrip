import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { MappedService } from "@/lib/services/mapService";

/**
 * Same card as the homepage's ActivityCard: 4:3 photo, category, title, duration,
 * price. The whole card links to the detail page; a small "Réserver" pill lets
 * people start a booking without leaving the grid.
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

  return (
    <Link href={`/services/${service.id}`} className="group block no-underline">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
        {hasImage ? (
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-calma-ink/35">
            <service.icon size={40} strokeWidth={1.4} />
          </div>
        )}
        {service.badge && (
          <span className="absolute start-2.5 top-2.5 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-calma-ink shadow-sm">
            {service.badge}
          </span>
        )}
      </div>

      <div className="pt-3">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
          {service.subtitle}
        </div>
        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
          {service.title}
        </h3>
        <div className="mt-1.5 inline-flex items-center gap-1 text-[13px] text-calma-taupe">
          <Clock size={13} /> {service.duration}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-[14px] text-calma-ink">
            {t.svc.fromLabel} <span className="text-[16px] font-bold">{service.price}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBook(service.id);
            }}
            className="rounded-full border border-calma-ink/25 px-3.5 py-1.5 text-[13px] font-semibold text-calma-ink transition-colors hover:border-calma-ink hover:bg-calma-ink hover:text-white"
          >
            {t.svc.bookShort}
          </button>
        </div>
      </div>
    </Link>
  );
}
