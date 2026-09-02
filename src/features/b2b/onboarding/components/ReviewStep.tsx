"use client";

import { Pencil, Loader2, ShieldCheck } from "lucide-react";
import { findCountry, CURRENCIES, OTHER_CITY_VALUE } from "@/lib/partners/geo";
import type { OnboardingFormState } from "../types";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

const CATEGORY_LABEL_KEY: Record<string, keyof CalmaPartnerOnboardingDict> = {
  Transport: "catTransport",
  Excursion: "catExcursion",
  Activity: "catActivity",
  "Food & Drink": "catFoodDrink",
  Sight: "catSight",
  "Hidden Gem": "catHiddenGem",
  Hotel: "catHotel",
};

const PLATFORM_LABEL_KEY: Record<string, keyof CalmaPartnerOnboardingDict> = {
  WEBSITE: "platformWebsite",
  INSTAGRAM: "platformInstagram",
  FACEBOOK: "platformFacebook",
  TIKTOK: "platformTiktok",
  YOUTUBE: "platformYoutube",
  LINKEDIN: "platformLinkedin",
  OTHER: "platformOther",
};

interface ReviewStepProps {
  t: CalmaPartnerOnboardingDict;
  email: string | null;
  form: OnboardingFormState;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

function Section({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit?: () => void;
  editLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-calma-olive/12 bg-white/70 p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-calma-taupe">
          {title}
        </h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-calma-terracotta transition-colors hover:text-calma-olive"
          >
            <Pencil size={12} />
            {editLabel}
          </button>
        )}
      </div>
      <div className="text-sm text-calma-ink">{children}</div>
    </div>
  );
}

export function ReviewStep({
  t,
  email,
  form,
  onEdit,
  onSubmit,
  submitting,
  error,
}: ReviewStepProps) {
  const country = findCountry(form.countryCode);
  const currency = CURRENCIES.find((c) => c.code === form.currency);
  const city = form.city === OTHER_CITY_VALUE ? form.cityOther : form.city;

  return (
    <div>
      <h2 className="mb-1 font-fraunces text-[22px] font-normal text-calma-ink">{t.reviewTitle}</h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.reviewSub}</p>

      <div className="space-y-3">
        {email && (
          <Section title={t.reviewSectionAccount}>
            <p>{email}</p>
          </Section>
        )}

        <Section
          title={t.reviewSectionPartner}
          onEdit={() => onEdit(2)}
          editLabel={t.reviewEditBtn}
        >
          <p className="font-semibold">
            {form.partnerType === "ARTISAN" ? t.typeArtisanLabel : t.typeAgencyLabel}
          </p>
        </Section>

        <Section
          title={t.reviewSectionBusiness}
          onEdit={() => onEdit(3)}
          editLabel={t.reviewEditBtn}
        >
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px]">
            <dt className="text-calma-taupe">{t.bizOrgLabel}</dt>
            <dd className="text-right font-medium">{form.organizationName || "—"}</dd>
            <dt className="text-calma-taupe">{t.bizFirstNameLabel}</dt>
            <dd className="text-right font-medium">
              {form.contactFirstName} {form.contactLastName}
            </dd>
            <dt className="text-calma-taupe">{t.bizPhoneLabel}</dt>
            <dd className="text-right font-medium">{form.phone || "—"}</dd>
            <dt className="text-calma-taupe">{t.bizCountryLabel}</dt>
            <dd className="text-right font-medium">{country?.name ?? "—"}</dd>
            <dt className="text-calma-taupe">{t.bizCityLabel}</dt>
            <dd className="text-right font-medium">{city || "—"}</dd>
            <dt className="text-calma-taupe">{t.bizCurrencyLabel}</dt>
            <dd className="text-right font-medium">{currency?.code ?? "—"}</dd>
            {form.website && (
              <>
                <dt className="text-calma-taupe">{t.bizWebsiteLabel}</dt>
                <dd className="truncate text-right font-medium">{form.website}</dd>
              </>
            )}
          </dl>
        </Section>

        <Section
          title={t.reviewSectionInterests}
          onEdit={() => onEdit(4)}
          editLabel={t.reviewEditBtn}
        >
          <div className="flex flex-wrap gap-1.5">
            {form.interests.map((c) => (
              <span
                key={c}
                className="rounded-full bg-calma-terracotta/10 px-2.5 py-1 text-xs font-semibold text-calma-terracotta"
              >
                {CATEGORY_LABEL_KEY[c] ? t[CATEGORY_LABEL_KEY[c]] : c}
              </span>
            ))}
          </div>
        </Section>

        <Section
          title={t.reviewSectionPresence}
          onEdit={() => onEdit(5)}
          editLabel={t.reviewEditBtn}
        >
          {form.socialProfiles.length === 0 ? (
            <p className="text-calma-taupe">{t.presenceNone}</p>
          ) : (
            <ul className="space-y-1">
              {form.socialProfiles.map((p) => (
                <li key={p.platform} className="flex items-center justify-between gap-3">
                  <span className="font-medium">{t[PLATFORM_LABEL_KEY[p.platform]]}</span>
                  <span className="truncate text-calma-taupe">{p.url}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="mt-6 rounded-2xl border border-calma-terracotta/25 bg-calma-terracotta/[.06] p-5 text-center">
        <ShieldCheck size={24} className="mx-auto mb-2 text-calma-terracotta" />
        <p className="font-fraunces text-[17px] font-normal text-calma-ink">{t.reviewReadyTitle}</p>
        <p className="mx-auto mt-1 max-w-[420px] text-[13px] text-calma-taupe">
          {t.reviewReadySub}
        </p>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-bold text-calma-cream shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-shadow duration-300 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)] disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "#F2994A" }}
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : t.reviewSubmitBtn}
        </button>
      </div>
    </div>
  );
}
