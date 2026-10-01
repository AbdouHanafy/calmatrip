"use client";
import { Phone, Mail, MapPin, Clock, type LucideIcon } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";

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
    <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-5 rounded-xl border border-calma-ink/10 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {contactInfo.map((info, index) => (
          <li key={index} className="flex items-start gap-3">
            <info.icon size={22} strokeWidth={1.7} className="mt-0.5 shrink-0 text-calma-olive" />
            <div>
              <div className="text-[14.5px] font-bold text-calma-ink">{info.title}</div>
              {info.details.map((detail, idx) => (
                <div key={idx} className="text-[14px] leading-snug text-calma-ink">
                  {detail}
                </div>
              ))}
              <div className="mt-0.5 text-[13px] leading-snug text-calma-taupe">
                {info.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
