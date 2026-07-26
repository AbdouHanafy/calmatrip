"use client";
import {
  CheckCircle,
  Headphones,
  Phone,
  MessageCircle,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { Reveal } from "./Reveal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba%2C+Hammamet%2C+Tunisie";

export function ContactSidebar() {
  const { t } = useCalmaLang();

  return (
    <div className="flex flex-col gap-6">
      {/* Carte interactive */}
      <Reveal delay={0.05}>
        <div className="group relative h-80 overflow-hidden rounded-[26px] border border-[#2D2926]/[.06] shadow-[0_24px_50px_-24px_rgba(42,38,34,.35)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-20px_rgba(42,38,34,.45)]">
          <iframe
            title="Localisation Calma Trip — Avenue Habib Bourguiba, Hammamet"
            src="https://maps.google.com/maps?q=Avenue%20Habib%20Bourguiba%2C%20Hammamet%2C%20Tunisie&z=15&output=embed"
            className="absolute inset-0 h-full w-full grayscale-[15%] transition-[filter] duration-300 group-hover:grayscale-0"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-black/[.06]" />
          <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-3.5 py-2 shadow-md backdrop-blur-sm">
            <p className="text-xs font-medium text-[#2D2926]">{t.cnt.mapAddress}</p>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-[#2D2926] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2994A] hover:text-white"
          >
            {t.cnt.openInMaps}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </Reveal>

      {/* Informations pratiques */}
      <Reveal delay={0.1}>
        <div className="rounded-[22px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2994A]/[.08] text-[#F2994A]">
              <CheckCircle className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-fraunces text-lg font-normal text-[#2D2926]">
              {t.cnt.practicalTitle}
            </h3>
          </div>
          <ul className="space-y-3.5">
            {t.cnt.practicalItems.map((info, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F2994A]" />
                <span className="text-sm leading-relaxed text-[#2D2926]">{info}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Assistance immédiate */}
      <Reveal delay={0.15}>
        <div className="rounded-[22px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2994A]/[.08] text-[#F2994A]">
              <Headphones className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-fraunces text-lg font-normal text-[#2D2926]">{t.cnt.helpTitle}</h3>
          </div>
          <div className="mb-5 flex items-center justify-between rounded-xl bg-[#FBF8F1] px-4 py-3.5">
            <div>
              <p className="text-[11.5px] text-[#726C64]">{t.cnt.avgResponseLabel}</p>
              <p className="font-fraunces text-sm text-[#2D2926]">{t.cnt.avgResponseValue}</p>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] text-[#726C64]">{t.cnt.satisfactionLabel}</p>
              <p className="font-fraunces text-sm text-[#4A667D]">98%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <a
              href="tel:+21621622972"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A667D] px-4 py-3 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-[#3A5164]"
            >
              <Phone className="h-4 w-4" /> {t.cnt.callBtn}
            </a>
            <a
              href="https://wa.me/21621622972"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F1EBE1] px-4 py-3 text-[13.5px] font-semibold text-[#2D2926] transition-colors duration-300 hover:border-[#F2994A] hover:text-[#F2994A]"
            >
              <MessageCircle className="h-4 w-4" /> {t.cnt.whatsappBtn}
            </a>
          </div>
        </div>
      </Reveal>

      {/* Réseaux sociaux */}
      <Reveal delay={0.2}>
        <div className="flex items-center gap-3 rounded-[22px] border border-[#2D2926]/[.06] bg-white p-6 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)]">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#726C64]">
            {t.cnt.followUs}
          </span>
          <a
            href="https://www.facebook.com/profile.php?id=61590996770536"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#F1EBE1] text-[#2D2926] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F2994A] hover:text-[#F2994A]"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="https://wa.me/21621622972"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F1EBE1] text-[#2D2926] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F2994A] hover:text-[#F2994A]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
