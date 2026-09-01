"use client";

import { Loader2, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { usePartnerOnboarding } from "./hooks/usePartnerOnboarding";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { AccountStep } from "./components/AccountStep";
import { PartnerTypeStep } from "./components/PartnerTypeStep";
import { OrganizationStep } from "./components/OrganizationStep";
import { InterestsStep } from "./components/InterestsStep";
import { OnlinePresenceStep } from "./components/OnlinePresenceStep";
import { ReviewStep } from "./components/ReviewStep";
import { SuccessState } from "./components/SuccessState";
import { LockedState } from "./components/LockedState";

export function PartnerOnboarding() {
  const { t, dir } = useCalmaLang();
  const pnr = t.pnr;
  const onboarding = usePartnerOnboarding();

  if (onboarding.loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 size={26} className="animate-spin text-calma-terracotta" />
      </div>
    );
  }

  if (onboarding.submitted || onboarding.profile?.status === "SUBMITTED") {
    return <SuccessState t={pnr} />;
  }

  if (onboarding.profile && onboarding.profile.status !== "DRAFT") {
    return <LockedState t={pnr} profile={onboarding.profile} />;
  }

  const skipAccountStep = onboarding.authenticated;
  const step = onboarding.step;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <OnboardingProgress t={pnr} step={step} skipAccountStep={skipAccountStep} dir={dir} />
      </div>

      <AnimatePresence>
        {onboarding.justSaved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex items-center gap-1.5 text-xs font-medium text-calma-success"
          >
            <Check size={13} strokeWidth={3} />
            {pnr.savedIndicator}
          </motion.div>
        )}
        {onboarding.saving && !onboarding.justSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex items-center gap-1.5 text-xs font-medium text-calma-taupe"
          >
            <Loader2 size={13} className="animate-spin" />
            {pnr.savingIndicator}
          </motion.div>
        )}
      </AnimatePresence>

      {onboarding.error && !onboarding.saving && (
        <p className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {onboarding.error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && !skipAccountStep && (
            <AccountStep t={pnr} onCreated={onboarding.onAccountCreated} />
          )}

          {step === 2 && (
            <PartnerTypeStep
              t={pnr}
              value={onboarding.form.partnerType}
              onSelect={onboarding.choosePartnerType}
              loading={onboarding.saving}
            />
          )}

          {step === 3 && onboarding.form.partnerType && (
            <OrganizationStep
              t={pnr}
              form={onboarding.form}
              setForm={onboarding.setForm}
              onBack={() => onboarding.setStep(2)}
              onContinue={onboarding.saveBusinessDetails}
              saving={onboarding.saving}
            />
          )}

          {step === 4 && onboarding.form.partnerType && (
            <InterestsStep
              t={pnr}
              partnerType={onboarding.form.partnerType}
              selected={onboarding.form.interests}
              onChange={(interests) => onboarding.setForm((f) => ({ ...f, interests }))}
              onBack={() => onboarding.setStep(3)}
              onContinue={onboarding.saveInterests}
              saving={onboarding.saving}
            />
          )}

          {step === 5 && (
            <OnlinePresenceStep
              t={pnr}
              value={onboarding.form.socialProfiles}
              onChange={(socialProfiles) => onboarding.setForm((f) => ({ ...f, socialProfiles }))}
              onBack={() => onboarding.setStep(4)}
              onContinue={onboarding.savePresence}
              saving={onboarding.saving}
            />
          )}

          {step === 6 && (
            <ReviewStep
              t={pnr}
              email={onboarding.sessionEmail}
              form={onboarding.form}
              onEdit={onboarding.setStep}
              onSubmit={onboarding.submit}
              submitting={onboarding.submitting}
              error={onboarding.error}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
