"use client";
import { CheckCircle, Phone, MessageCircle, Facebook, ExternalLink } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba%2C+Hammamet%2C+Tunisie";

const card = "rounded-2xl border border-calma-ink/10 bg-white p-6";
const cardTitle = "m-0 mb-4 text-[17px] font-bold text-calma-ink";

export function ContactSidebar() {
  const { t } = useCalmaLang();

  return (
    <div className="flex flex-col gap-5">
      <div className="relative h-72 overflow-hidden rounded-2xl border border-calma-ink/10">
        <iframe
          title="Localisation Calma Trip — Avenue Habib Bourguiba, Hammamet"
          src="https://maps.google.com/maps?q=Avenue%20Habib%20Bourguiba%2C%20Hammamet%2C%20Tunisie&z=15&output=embed"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-3 start-3 rounded-lg bg-white px-3 py-1.5 shadow-sm">
          <p className="m-0 text-[12px] font-medium text-calma-ink">{t.cnt.mapAddress}</p>
        </div>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-calma-ink no-underline shadow-sm hover:bg-calma-sand"
        >
          {t.cnt.openInMaps}
          <ExternalLink size={13} />
        </a>
      </div>

      <div className={card}>
        <h3 className={cardTitle}>{t.cnt.practicalTitle}</h3>
        <ul className="m-0 list-none space-y-3 p-0">
          {t.cnt.practicalItems.map((info, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-calma-olive" />
              <span className="text-[14px] leading-relaxed text-calma-ink">{info}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={card}>
        <h3 className={cardTitle}>{t.cnt.helpTitle}</h3>
        <div className="mb-4 flex items-center justify-between rounded-xl bg-calma-sand px-4 py-3">
          <div>
            <div className="text-[12px] text-calma-taupe">{t.cnt.avgResponseLabel}</div>
            <div className="text-[14px] font-bold text-calma-ink">{t.cnt.avgResponseValue}</div>
          </div>
          <div className="text-end">
            <div className="text-[12px] text-calma-taupe">{t.cnt.satisfactionLabel}</div>
            <div className="text-[14px] font-bold text-calma-ink">98%</div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <a
            href="tel:+21621622972"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-calma-ink px-4 py-2.5 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
          >
            <Phone size={16} /> {t.cnt.callBtn}
          </a>
          <a
            href="https://wa.me/21621622972"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-calma-ink/25 px-4 py-2.5 text-[14px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/60"
          >
            <MessageCircle size={16} /> {t.cnt.whatsappBtn}
          </a>
        </div>
      </div>

      <div className={`${card} flex items-center gap-3 !py-4`}>
        <span className="text-[13px] font-semibold text-calma-taupe">{t.cnt.followUs}</span>
        <a
          href="https://www.facebook.com/profile.php?id=61590996770536"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="ms-auto grid h-10 w-10 place-items-center rounded-full border border-calma-ink/20 text-calma-ink hover:border-calma-ink/60"
        >
          <Facebook size={16} />
        </a>
        <a
          href="https://wa.me/21621622972"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="grid h-10 w-10 place-items-center rounded-full border border-calma-ink/20 text-calma-ink hover:border-calma-ink/60"
        >
          <MessageCircle size={16} />
        </a>
      </div>
    </div>
  );
}
