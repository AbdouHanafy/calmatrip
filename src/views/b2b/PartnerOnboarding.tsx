"use client";

import Link from "next/link";
import CalmaLogo from "@/components/calma/CalmaLogo";
import { motion, useReducedMotion } from "motion/react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import { PartnerOnboarding as PartnerOnboardingWizard } from "@/features/b2b/onboarding/PartnerOnboarding";

function LangSwitcher() {
  const { lang, setLang } = useCalmaLang();
  return (
    <div className="mx-auto flex w-fit overflow-hidden rounded-full border border-white/25 bg-white/10 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
      {(["fr", "en", "ar"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-3 py-1.5 transition-colors duration-200 ${
            lang === code
              ? "bg-white/25 text-white"
              : "bg-transparent text-white/65 hover:text-white/90"
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
    <div className="relative min-h-screen overflow-hidden font-hanken">
      <AuthBackground reduceMotion={reduceMotion} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[720px]">
          <motion.div
            className="mb-3 text-center"
            initial={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="inline-flex items-center justify-center">
              <CalmaLogo tone="cream" iconSize={30} />
            </Link>
            <p className="mx-auto mt-1.5 max-w-[420px] text-pretty font-fraunces text-[13px] italic leading-[1.4] text-white/80">
              {t.pnr.pageSub}
            </p>
            <div className="mt-3">
              <LangSwitcher />
            </div>
          </motion.div>

          <motion.div
            className="relative max-h-[88vh] overflow-y-auto rounded-[28px] border border-white/25 bg-calma-cream/95 p-6 backdrop-blur-2xl sm:p-8"
            style={{
              boxShadow:
                "0 40px 90px -30px rgba(15,12,8,.65), 0 1px 0 0 rgba(255,255,255,.4) inset",
            }}
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
            <Link href="/" className="text-xs text-white/70 transition-colors hover:text-white">
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
