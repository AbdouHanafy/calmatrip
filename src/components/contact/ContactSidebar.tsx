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
        <div className="group relative h-80 overflow-hidden rounded-[26px] border border-[#15242E]/[.06] shadow-[0_24px_50px_-24px_rgba(21,36,46,.35)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-20px_rgba(21,36,46,.45)]">
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
            <p className="text-xs font-medium text-[#15242E]">{t.cnt.mapAddress}</p>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-[#15242E] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D2B38B] hover:text-white"
          >
            {t.cnt.openInMaps}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </Reveal>

      {/* Informations pratiques */}
      <Reveal delay={0.1}>
        <div className="rounded-[22px] border border-[#15242E]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(21,36,46,.1)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D2B38B]/[.08] text-[#D2B38B]">
              <CheckCircle className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-fraunces text-lg font-normal text-[#15242E]">
              {t.cnt.practicalTitle}
            </h3>
          </div>
          <ul className="space-y-3.5">
            {t.cnt.practicalItems.map((info, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D2B38B]" />
                <span className="text-sm leading-relaxed text-[#15242E]">{info}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Assistance immédiate */}
      <Reveal delay={0.15}>
        <div className="rounded-[22px] border border-[#15242E]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(21,36,46,.1)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D2B38B]/[.08] text-[#D2B38B]">
              <Headphones className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-fraunces text-lg font-normal text-[#15242E]">{t.cnt.helpTitle}</h3>
          </div>
          <div className="mb-5 flex items-center justify-between rounded-xl bg-[#F7F1E7] px-4 py-3.5">
            <div>
              <p className="text-[11.5px] text-[#5E7480]">{t.cnt.avgResponseLabel}</p>
              <p className="font-fraunces text-sm text-[#15242E]">{t.cnt.avgResponseValue}</p>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] text-[#5E7480]">{t.cnt.satisfactionLabel}</p>
              <p className="font-fraunces text-sm text-[#4C7A92]">98%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <a
              href="tel:+21621622972"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4C7A92] px-4 py-3 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-[#3A5F70]"
            >
              <Phone className="h-4 w-4" /> {t.cnt.callBtn}
            </a>
            <a
              href="https://wa.me/21621622972"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F0E2CE] px-4 py-3 text-[13.5px] font-semibold text-[#15242E] transition-colors duration-300 hover:border-[#D2B38B] hover:text-[#D2B38B]"
            >
              <MessageCircle className="h-4 w-4" /> {t.cnt.whatsappBtn}
            </a>
          </div>
        </div>
      </Reveal>

      {/* Réseaux sociaux */}
      <Reveal delay={0.2}>
        <div className="flex items-center gap-3 rounded-[22px] border border-[#15242E]/[.06] bg-white p-6 shadow-[0_2px_16px_-8px_rgba(21,36,46,.1)]">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5E7480]">
            {t.cnt.followUs}
          </span>
          <a
            href="https://www.facebook.com/profile.php?id=61590996770536"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#F0E2CE] text-[#15242E] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D2B38B] hover:text-[#D2B38B]"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="https://wa.me/21621622972"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F0E2CE] text-[#15242E] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D2B38B] hover:text-[#D2B38B]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
