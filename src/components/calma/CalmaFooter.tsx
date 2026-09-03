"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Send, Check, Facebook, Instagram, Youtube } from "lucide-react";
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
      <p className="flex items-center gap-2 text-sm font-medium text-calma-terracotta-soft">
        <Check className="h-4 w-4" />
        {t.newsletterSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-[320px] items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.newsletterPlaceholder}
        className="min-w-0 flex-1 rounded-full border border-calma-cream/20 bg-calma-cream/[.06] px-4 py-2.5 text-sm text-calma-cream placeholder:text-calma-cream/40 outline-none focus:border-calma-terracotta-soft"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label={t.newsletterCta}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-calma-terracotta text-calma-ink transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function CalmaFooter() {
  const { t } = useCalmaLang();
  const settings = useSiteSettings();
  const socialLinks = SOCIAL_ICONS.map((item) => ({
    ...item,
    href: settings?.social[item.key] ?? null,
  })).filter((item) => item.href);

  return (
    <footer className="mt-20 bg-calma-olive-deeper font-hanken text-calma-cream">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-6 pb-14 pt-[52px] sm:px-10">
        <div className="max-w-[280px]">
          <Link href="/" className="mb-4 flex items-center no-underline">
            <CalmaLogoOrCustom
              customUrl={settings?.branding.logoUrl}
              alt={settings?.general.siteName ?? "Calma Trip"}
              tone="cream"
              imgClassName="h-8 w-auto"
              iconSize={32}
            />
          </Link>
          <p className="m-0 text-[13.5px] leading-[1.55] text-calma-cream/[.68]">
            {settings?.footer.description || t.footTag}
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-calma-cream/20 text-calma-cream/80 transition-colors hover:border-calma-cream/40 hover:text-calma-cream"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-14">
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
              {t.footExplore}
            </div>
            <FooterPublicNavigation menuKey="footer-explore" />
          </div>
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
              {t.footCompany}
            </div>
            <FooterPublicNavigation menuKey="footer-company" />
          </div>
        </div>

        <div className="max-w-[300px]">
          <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
            {t.newsletterTitle}
          </div>
          <p className="mb-3.5 text-[13px] leading-[1.5] text-calma-cream/[.68]">
            {t.newsletterSub}
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-calma-cream/[.14]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-2.5 px-6 py-[18px] text-[12.5px] text-calma-cream/60 sm:px-10">
          <span>
            © {new Date().getFullYear()} {settings?.footer.copyrightText || "Calma Trip · Tunisie"}
          </span>
          <span>Paiement sécurisé · Support 24/7</span>
        </div>
      </div>
    </footer>
  );
}
