"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { OTHER_CITY_VALUE, citiesForCountry } from "@/lib/partners/geo";
import type { PartnerType } from "@/lib/partners/constants";
import { EMPTY_FORM_STATE, type OnboardingFormState, type PartnerProfileDTO } from "../types";

export const TOTAL_STEPS = 6;

function hydrateFormFromProfile(profile: PartnerProfileDTO): OnboardingFormState {
  const knownCities = citiesForCountry(profile.countryCode);
  const savedCity = profile.city ?? "";
  const isKnownCity = savedCity !== "" && knownCities.includes(savedCity);
  return {
    partnerType: profile.partnerType,
    organizationName: profile.organizationName ?? "",
    contactFirstName: profile.contactFirstName ?? "",
    contactLastName: profile.contactLastName ?? "",
    phone: profile.phone ?? "",
    countryCode: profile.countryCode ?? "",
    city: savedCity === "" ? "" : isKnownCity ? savedCity : OTHER_CITY_VALUE,
    cityOther: isKnownCity ? "" : savedCity,
    currency: profile.currency ?? "",
    website: profile.website ?? "",
    interests: profile.interests.map((i) => i.category),
    socialProfiles: profile.socialProfiles,
  };
}

export function usePartnerOnboarding() {
  const { data: session, status: sessionStatus, update: updateSession } = useSession();
  const authenticated = sessionStatus === "authenticated";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfileDTO | null>(null);
  const [form, setForm] = useState<OnboardingFormState>(EMPTY_FORM_STATE);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (sessionStatus === "loading") return;
    if (!authenticated) {
      setStep(1);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/b2b/onboarding");
      if (res.ok) {
        const data = await res.json();
        const p: PartnerProfileDTO | null = data.profile;
        if (p) {
          setProfile(p);
          setForm(hydrateFormFromProfile(p));
          setStep(Math.min(Math.max(p.currentStep, 2), TOTAL_STEPS));
        } else {
          setStep(2);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [authenticated, sessionStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = useCallback(async (data: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/b2b/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        return false;
      }
      if (body.profile) setProfile(body.profile);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
      return true;
    } catch {
      setError("Something went wrong. Please check your connection.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const resolvedCity = (state: OnboardingFormState) =>
    state.city === OTHER_CITY_VALUE ? state.cityOther.trim() : state.city;

  const choosePartnerType = useCallback(
    async (type: PartnerType) => {
      setForm((f) => ({ ...f, partnerType: type }));

      // Upgrade a plain USER to a B2B applicant via the existing endpoint —
      // never touches an account that is already ADMIN or B2B.
      if (session?.user?.role === "USER") {
        await fetch("/api/auth/apply-account-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: type.toLowerCase() }),
        });
        await updateSession?.();
      }

      const ok = await patch({ partnerType: type, currentStep: 3 });
      if (ok) setStep(3);
      return ok;
    },
    [patch, session?.user?.role, updateSession],
  );

  const saveBusinessDetails = useCallback(async () => {
    const ok = await patch({
      organizationName: form.organizationName.trim(),
      contactFirstName: form.contactFirstName.trim(),
      contactLastName: form.contactLastName.trim(),
      phone: form.phone.trim(),
      countryCode: form.countryCode,
      city: resolvedCity(form),
      currency: form.currency,
      website: form.website.trim(),
      currentStep: 4,
    });
    if (ok) setStep(4);
    return ok;
  }, [form, patch]);

  const saveInterests = useCallback(async () => {
    const ok = await patch({ interests: form.interests, currentStep: 5 });
    if (ok) setStep(5);
    return ok;
  }, [form.interests, patch]);

  const savePresence = useCallback(async () => {
    const ok = await patch({ socialProfiles: form.socialProfiles, currentStep: 6 });
    if (ok) setStep(6);
    return ok;
  }, [form.socialProfiles, patch]);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/b2b/onboarding/submit", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        return false;
      }
      if (body.profile) setProfile(body.profile);
      setSubmitted(true);
      return true;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const onAccountCreated = useCallback(() => {
    setStep(2);
    // The session is populated asynchronously by NextAuth after signIn;
    // reload once it settles so the wizard picks up the fresh profile state.
    load();
  }, [load]);

  return {
    authenticated,
    sessionEmail: session?.user?.email ?? null,
    loading,
    profile,
    form,
    setForm,
    step,
    setStep,
    saving,
    justSaved,
    submitting,
    submitted,
    error,
    setError,
    choosePartnerType,
    saveBusinessDetails,
    saveInterests,
    savePresence,
    submit,
    onAccountCreated,
  };
}
