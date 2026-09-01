"use client";

import { Globe, Instagram, Facebook, Youtube, Linkedin, Link2, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/partners/constants";
import type { SocialProfileValue } from "../types";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

const PLATFORM_ICONS: Record<SocialPlatform, LucideIcon> = {
  WEBSITE: Globe,
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  TIKTOK: Music2,
  YOUTUBE: Youtube,
  LINKEDIN: Linkedin,
  OTHER: Link2,
};

const PLATFORM_LABEL_KEY: Record<SocialPlatform, keyof CalmaPartnerOnboardingDict> = {
  WEBSITE: "platformWebsite",
  INSTAGRAM: "platformInstagram",
  FACEBOOK: "platformFacebook",
  TIKTOK: "platformTiktok",
  YOUTUBE: "platformYoutube",
  LINKEDIN: "platformLinkedin",
  OTHER: "platformOther",
};

const PLATFORM_PLACEHOLDER: Record<SocialPlatform, string> = {
  WEBSITE: "https://example.com",
  INSTAGRAM: "https://instagram.com/example",
  FACEBOOK: "https://facebook.com/example",
  TIKTOK: "https://tiktok.com/@example",
  YOUTUBE: "https://youtube.com/@example",
  LINKEDIN: "https://linkedin.com/company/example",
  OTHER: "https://…",
};

interface SocialProfileFieldsProps {
  t: CalmaPartnerOnboardingDict;
  value: SocialProfileValue[];
  onChange: (value: SocialProfileValue[]) => void;
  errors: Partial<Record<SocialPlatform, string>>;
}

export function SocialProfileFields({ t, value, onChange, errors }: SocialProfileFieldsProps) {
  const byPlatform = new Map(value.map((v) => [v.platform, v.url]));

  const toggle = (platform: SocialPlatform) => {
    if (byPlatform.has(platform)) {
      onChange(value.filter((v) => v.platform !== platform));
    } else {
      onChange([...value, { platform, url: "" }]);
    }
  };

  const setUrl = (platform: SocialPlatform, url: string) => {
    onChange(value.map((v) => (v.platform === platform ? { ...v, url } : v)));
  };

  return (
    <div className="space-y-2.5">
      {SOCIAL_PLATFORMS.map((platform) => {
        const Icon = PLATFORM_ICONS[platform];
        const checked = byPlatform.has(platform);
        return (
          <div
            key={platform}
            className={`rounded-2xl border transition-colors ${
              checked
                ? "border-calma-terracotta/40 bg-calma-terracotta/[.04]"
                : "border-calma-olive/15 bg-white/70"
            }`}
          >
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(platform)}
                className="h-4 w-4 shrink-0 rounded border-calma-olive/30 accent-calma-terracotta"
              />
              <Icon size={17} className="shrink-0 text-calma-terracotta" />
              <span className="text-sm font-semibold text-calma-ink">
                {t[PLATFORM_LABEL_KEY[platform]]}
              </span>
            </label>
            {checked && (
              <div className="px-4 pb-3.5">
                <input
                  type="url"
                  value={byPlatform.get(platform) ?? ""}
                  onChange={(e) => setUrl(platform, e.target.value)}
                  placeholder={PLATFORM_PLACEHOLDER[platform]}
                  aria-label={t[PLATFORM_LABEL_KEY[platform]]}
                  className="h-11 w-full rounded-xl border border-calma-olive/15 bg-white px-3.5 text-sm text-calma-ink outline-none placeholder:text-calma-taupe/50 focus:border-calma-terracotta"
                />
                {errors[platform] && (
                  <p className="mt-1 text-xs text-red-600">{errors[platform]}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
      {value.length === 0 && <p className="text-xs text-calma-taupe">{t.presenceNone}</p>}
    </div>
  );
}
