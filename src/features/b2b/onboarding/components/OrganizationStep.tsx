"use client";

import { useMemo, useState } from "react";
import { Building2, User as UserIcon, Phone, Globe } from "lucide-react";
import { COUNTRIES, CURRENCIES, citiesForCountry, OTHER_CITY_VALUE } from "@/lib/partners/geo";
import { SearchableSelect } from "./SearchableSelect";
import { StepActions } from "./StepActions";
import type { OnboardingFormState } from "../types";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

interface OrganizationStepProps {
  t: CalmaPartnerOnboardingDict;
  form: OnboardingFormState;
  setForm: React.Dispatch<React.SetStateAction<OnboardingFormState>>;
  onBack: () => void;
  onContinue: () => Promise<boolean>;
  saving: boolean;
}

export function OrganizationStep({
  t,
  form,
  setForm,
  onBack,
  onContinue,
  saving,
}: OrganizationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputBoxClass =
    "flex h-12 items-center gap-2.5 rounded-xl border border-calma-olive/15 bg-white/80 px-3.5 transition-all duration-300 focus-within:border-calma-terracotta focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(242,153,74,.12)]";
  const inputFieldClass =
    "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/55";
  const labelClass = "mb-1.5 block text-[13px] font-semibold text-calma-ink";
  const errBorder = (key: string) => (errors[key] ? "border-red-300" : "");

  const countryOptions = useMemo(
    () => COUNTRIES.map((c) => ({ value: c.code, label: c.name, hint: c.callingCode })),
    [],
  );
  const currencyOptions = useMemo(
    () => CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` })),
    [],
  );
  const cities = citiesForCountry(form.countryCode);

  const set = <K extends keyof OnboardingFormState>(key: K, value: OnboardingFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.organizationName.trim().length < 2) next.organizationName = t.requiredError;
    if (form.contactFirstName.trim().length < 1) next.contactFirstName = t.requiredError;
    if (form.contactLastName.trim().length < 1) next.contactLastName = t.requiredError;
    if (!/^\+?[0-9 ()-]{6,20}$/.test(form.phone.trim())) next.phone = t.requiredError;
    if (!form.countryCode) next.countryCode = t.requiredError;
    if (!form.city) next.city = t.requiredError;
    if (form.city === OTHER_CITY_VALUE && form.cityOther.trim().length < 1)
      next.city = t.requiredError;
    if (!form.currency) next.currency = t.requiredError;
    if (form.website.trim()) {
      try {
        new URL(form.website.trim());
      } catch {
        next.website = t.invalidUrlError;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    await onContinue();
  };

  return (
    <div>
      <h2 className="mb-1 font-fraunces text-[22px] font-normal text-calma-ink">{t.bizTitle}</h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.bizSub}</p>

      <div className="space-y-3.5">
        <div>
          <label htmlFor="pnr-org" className={labelClass}>
            {t.bizOrgLabel}
          </label>
          <div className={`${inputBoxClass} ${errBorder("organizationName")}`}>
            <Building2 size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-org"
              value={form.organizationName}
              onChange={(e) => set("organizationName", e.target.value)}
              placeholder={t.bizOrgPh}
              className={inputFieldClass}
            />
          </div>
          {errors.organizationName && (
            <p className="mt-1 text-xs text-red-600">{errors.organizationName}</p>
          )}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="pnr-first" className={labelClass}>
              {t.bizFirstNameLabel}
            </label>
            <div className={`${inputBoxClass} ${errBorder("contactFirstName")}`}>
              <UserIcon size={18} className="shrink-0 text-calma-terracotta" />
              <input
                id="pnr-first"
                value={form.contactFirstName}
                onChange={(e) => set("contactFirstName", e.target.value)}
                className={inputFieldClass}
              />
            </div>
            {errors.contactFirstName && (
              <p className="mt-1 text-xs text-red-600">{errors.contactFirstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="pnr-last" className={labelClass}>
              {t.bizLastNameLabel}
            </label>
            <div className={`${inputBoxClass} ${errBorder("contactLastName")}`}>
              <UserIcon size={18} className="shrink-0 text-calma-terracotta" />
              <input
                id="pnr-last"
                value={form.contactLastName}
                onChange={(e) => set("contactLastName", e.target.value)}
                className={inputFieldClass}
              />
            </div>
            {errors.contactLastName && (
              <p className="mt-1 text-xs text-red-600">{errors.contactLastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="pnr-phone" className={labelClass}>
            {t.bizPhoneLabel}
          </label>
          <div className={`${inputBoxClass} ${errBorder("phone")}`}>
            <Phone size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+216 XX XXX XXX"
              className={inputFieldClass}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <SearchableSelect
            label={t.bizCountryLabel}
            value={form.countryCode}
            onChange={(v) => setForm((f) => ({ ...f, countryCode: v, city: "", cityOther: "" }))}
            options={countryOptions}
            placeholder={t.bizCountryPh}
            error={errors.countryCode}
          />

          {cities.length > 0 ? (
            <div>
              <label htmlFor="pnr-city" className={labelClass}>
                {t.bizCityLabel}
              </label>
              <select
                id="pnr-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={`h-12 w-full rounded-xl border bg-white/80 px-3.5 text-[15px] text-calma-ink outline-none transition-all duration-300 focus:border-calma-terracotta ${errBorder("city") || "border-calma-olive/15"}`}
              >
                <option value="" disabled>
                  {t.bizCityLabel}
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={OTHER_CITY_VALUE}>{t.bizCityOtherLabel}</option>
              </select>
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="pnr-city-free" className={labelClass}>
                {t.bizCityLabel}
              </label>
              <div className={`${inputBoxClass} ${errBorder("city")}`}>
                <input
                  id="pnr-city-free"
                  value={form.city === OTHER_CITY_VALUE ? form.cityOther : form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: OTHER_CITY_VALUE, cityOther: e.target.value }))
                  }
                  placeholder={t.bizCityOtherPh}
                  className={inputFieldClass}
                />
              </div>
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
          )}

          {form.city === OTHER_CITY_VALUE && cities.length > 0 && (
            <div className="sm:col-span-2">
              <label htmlFor="pnr-city-other" className={labelClass}>
                {t.bizCityOtherLabel}
              </label>
              <div className={inputBoxClass}>
                <input
                  id="pnr-city-other"
                  value={form.cityOther}
                  onChange={(e) => set("cityOther", e.target.value)}
                  placeholder={t.bizCityOtherPh}
                  className={inputFieldClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <SearchableSelect
            label={t.bizCurrencyLabel}
            value={form.currency}
            onChange={(v) => set("currency", v)}
            options={currencyOptions}
            placeholder={t.bizCurrencyLabel}
            error={errors.currency}
          />

          <div>
            <label htmlFor="pnr-website" className={labelClass}>
              {t.bizWebsiteLabel}{" "}
              <span className="font-normal text-calma-taupe">({t.bizWebsiteOptional})</span>
            </label>
            <div className={`${inputBoxClass} ${errBorder("website")}`}>
              <Globe size={18} className="shrink-0 text-calma-terracotta" />
              <input
                id="pnr-website"
                type="url"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder={t.bizWebsitePh}
                className={inputFieldClass}
              />
            </div>
            {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website}</p>}
          </div>
        </div>
      </div>

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        backLabel={t.backBtn}
        continueLabel={t.continueBtn}
        loading={saving}
      />
    </div>
  );
}
