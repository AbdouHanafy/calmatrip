"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { FooterPublicNavigation } from "@/features/cms/components/navigation/PublicNavigation";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";
import { CalmaLogoOrCustom } from "@/components/calma/CalmaLogo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.62h-3.14v14.02c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 1 1 0-5.6c.29 0 .57.04.83.13V10.4a6.1 6.1 0 0 0-.83-.06c-3.28 0-5.94 2.66-5.94 5.94S6.02 22.2 9.3 22.2s5.94-2.66 5.94-5.94V9.01a8.3 8.3 0 0 0 4.86 1.56V7.43a4.85 4.85 0 0 1-3.5-1.61Z" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { key: "facebook" as const, icon: Facebook, label: "Facebook" },
  { key: "instagram" as const, icon: Instagram, label: "Instagram" },
  { key: "tiktok" as const, icon: TikTokIcon, label: "TikTok" },
  { key: "youtube" as const, icon: Youtube, label: "YouTube" },
];

const headingClass = "mb-3 text-[15px] font-bold text-calma-ink";
const linkClass = "text-calma-ink/75 no-underline hover:text-calma-ink hover:underline";

function NewsletterForm() {
  const { t } = useCalmaLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-calma-success">
        <Check className="h-4 w-4" />
        {t.newsletterSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-[340px] gap-2">
      <label htmlFor="footer-newsletter" className="sr-only">
        {t.newsletterPlaceholder}
      </label>
      <input
        id="footer-newsletter"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.newsletterPlaceholder}
        className="min-w-0 flex-1 rounded-full border border-calma-ink/20 bg-white px-4 py-2.5 text-sm text-calma-ink outline-none placeholder:text-calma-taupe focus:border-calma-ink/60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-calma-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-olive disabled:opacity-60"
      >
        {t.newsletterCta}
      </button>
    </form>
  );
}

export default function CalmaFooter() {
  const { t } = useCalmaLang();
  const l = t.layout;
  const settings = useSiteSettings();
  const contact = settings?.contact;
  const socialLinks = SOCIAL_ICONS.map((item) => ({
    ...item,
    href: settings?.social[item.key] ?? null,
  })).filter((item) => item.href);

  return (
    <footer className="border-t border-calma-ink/10 bg-calma-cream font-hanken text-calma-ink">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-6 gap-y-10 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr_1.4fr] lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="mb-3 inline-flex items-center no-underline">
            <CalmaLogoOrCustom
              customUrl={settings?.branding.logoUrl}
              alt={settings?.general.siteName ?? "Calma Trip"}
              tone="navy"
              imgClassName="h-10 w-auto"
              iconSize={38}
              textSize={19}
            />
          </Link>
          <p className="m-0 max-w-[280px] text-[14px] leading-relaxed text-calma-ink/70">
            {settings?.footer.description || t.footTag}
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-calma-ink/15 bg-white text-calma-ink/80 transition-colors hover:border-calma-ink/40 hover:text-calma-ink"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={headingClass}>{t.footExplore}</div>
          <FooterPublicNavigation menuKey="footer-explore" linkClassName={linkClass} />
        </div>

        <div>
          <div className={headingClass}>{t.footCompany}</div>
          <FooterPublicNavigation menuKey="footer-company" linkClassName={linkClass} />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className={headingClass}>{l.footContact}</div>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
            {contact?.phone && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <Phone size={15} className="shrink-0" />
                  <span dir="ltr">{contact.phone}</span>
                </a>
              </li>
            )}
            {contact?.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <MessageCircle size={15} className="shrink-0" />
                  WhatsApp
                </a>
              </li>
            )}
            {contact?.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-flex items-center gap-2 break-all ${linkClass}`}
                >
                  <Mail size={15} className="shrink-0" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact?.address && (
              <li className="flex items-start gap-2 text-calma-ink/75">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {contact.address}
              </li>
            )}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className={headingClass}>{l.footNewsletter}</div>
          <p className="mb-3 mt-0 text-[14px] leading-relaxed text-calma-ink/70">
            {t.newsletterSub}
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-calma-ink/10">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-[13px] text-calma-ink/65 sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {settings?.footer.copyrightText || "Calma Trip · Tunisie"}
          </span>
          <nav aria-label={l.legalNotice} className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Link href="/confidentialite" className={linkClass}>
              {l.privacy}
            </Link>
            <Link href="/conditions-generales-de-vente" className={linkClass}>
              {l.terms}
            </Link>
            <Link href="/mentions-legales" className={linkClass}>
              {l.legalNotice}
            </Link>
          </nav>
          <span>{l.footBottomNote}</span>
        </div>
      </div>
    </footer>
  );
}
