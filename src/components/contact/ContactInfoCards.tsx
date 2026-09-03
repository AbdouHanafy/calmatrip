"use client";
import { Phone, Mail, MapPin, Clock, type LucideIcon } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";
import { Reveal } from "./Reveal";

interface ContactInfo {
  icon: LucideIcon;
  title: string;
  details: string[];
  description: string;
}

export function ContactInfoCards() {
  const { t } = useCalmaLang();
  const settings = useSiteSettings();
  const contact = settings?.contact;

  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: t.cnt.infoPhoneTitle,
      details: [contact?.phone ?? "+216 21 622 972"],
      description: t.cnt.infoPhoneDesc,
    },
    {
      icon: Mail,
      title: t.cnt.infoEmailTitle,
      details: [contact?.email ?? "contact@calmatrip.com"],
      description: t.cnt.infoEmailDesc,
    },
    {
      icon: MapPin,
      title: t.cnt.infoAddressTitle,
      details: (contact?.address ?? "Avenue Habib Bourguiba, Hammamet, Tunisie").split(", "),
      description: t.cnt.infoAddressDesc,
    },
    {
      icon: Clock,
      title: t.cnt.infoHoursTitle,
      details: [t.cnt.infoHours1, t.cnt.infoHours2],
      description: t.cnt.infoHoursDesc,
    },
  ];

  return (
    <section className="bg-[#F1EBE1] pb-4 pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <div className="group h-full rounded-[20px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-20px_rgba(42,38,34,.28)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#F2994A]/20 bg-[#F2994A]/[.08] text-[#F2994A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F2994A] group-hover:text-white">
                  <info.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#726C64]">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p
                    key={idx}
                    className="mt-1.5 font-fraunces text-[17px] leading-snug text-[#2D2926]"
                  >
                    {detail}
                  </p>
                ))}
                <p className="mt-2 text-[12.5px] text-[#F2994A]">{info.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
