"use client";

import Link from "next/link";
import CalmaLogo from "@/components/calma/CalmaLogo";
import { motion, useReducedMotion } from "motion/react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import { PartnerOnboarding as PartnerOnboardingWizard } from "@/features/b2b/onboarding/PartnerOnboarding";

function LangSwitcher() {
  const { lang, setLang } = useCalmaLang();
  return (
    <div className="mx-auto flex w-fit overflow-hidden rounded-full border border-calma-ink/20 bg-white text-[11px] font-semibold uppercase tracking-wide">
      {(["fr", "en", "ar"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-3 py-1.5 transition-colors duration-200 ${
            lang === code
              ? "bg-calma-ink text-white"
              : "bg-transparent text-calma-taupe hover:text-calma-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function PartnerOnboardingContent() {
  const reduceMotion = useReducedMotion();
  const { t } = useCalmaLang();

  return (
    <div className="relative min-h-screen bg-white font-hanken">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[720px]">
          <motion.div
            className="mb-3 text-center"
            initial={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="inline-flex items-center justify-center">
              <CalmaLogo tone="navy" iconSize={30} />
            </Link>
            <p className="mx-auto mt-1.5 max-w-[420px] text-pretty text-[14px] leading-[1.5] text-calma-taupe">
              {t.pnr.pageSub}
            </p>
            <div className="mt-3">
              <LangSwitcher />
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-2xl border border-calma-ink/10 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,.18)] sm:p-8"
            initial={reduceMotion ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <PartnerOnboardingWizard />
          </motion.div>

          <motion.p
            className="mt-2.5 text-center"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/"
              className="text-[13px] text-calma-taupe no-underline transition-colors hover:text-calma-ink"
            >
              ← {t.pnr.successBackBtn}
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function PartnerOnboardingView() {
  return (
    <CalmaLangProvider>
      <PartnerOnboardingContent />
    </CalmaLangProvider>
  );
}
