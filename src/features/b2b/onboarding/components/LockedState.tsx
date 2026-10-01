"use client";

import Link from "next/link";
import { Clock, CheckCircle2, XCircle, PauseCircle } from "lucide-react";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";
import type { PartnerProfileDTO } from "../types";

interface LockedStateProps {
  t: CalmaPartnerOnboardingDict;
  profile: PartnerProfileDTO;
}

const CONFIG: Record<
  Exclude<PartnerProfileDTO["status"], "DRAFT">,
  {
    icon: typeof Clock;
    titleKey: keyof CalmaPartnerOnboardingDict;
    subKey: keyof CalmaPartnerOnboardingDict;
    tone: string;
  }
> = {
  SUBMITTED: {
    icon: Clock,
    titleKey: "lockedSubmittedTitle",
    subKey: "lockedSubmittedSub",
    tone: "text-calma-terracotta bg-calma-terracotta/15",
  },
  UNDER_REVIEW: {
    icon: Clock,
    titleKey: "lockedUnderReviewTitle",
    subKey: "lockedUnderReviewSub",
    tone: "text-calma-terracotta bg-calma-terracotta/15",
  },
  APPROVED: {
    icon: CheckCircle2,
    titleKey: "lockedApprovedTitle",
    subKey: "lockedApprovedSub",
    tone: "text-calma-success bg-calma-success/15",
  },
  REJECTED: {
    icon: XCircle,
    titleKey: "lockedRejectedTitle",
    subKey: "lockedRejectedSub",
    tone: "text-red-500 bg-red-50",
  },
  SUSPENDED: {
    icon: PauseCircle,
    titleKey: "lockedSuspendedTitle",
    subKey: "lockedSuspendedSub",
    tone: "text-red-500 bg-red-50",
  },
};

export function LockedState({ t, profile }: LockedStateProps) {
  if (profile.status === "DRAFT") return null;
  const cfg = CONFIG[profile.status];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${cfg.tone}`}>
        <Icon size={30} strokeWidth={2} />
      </div>
      <h2 className="mb-2 text-[22px] font-bold tracking-[-0.01em] text-calma-ink">
        {t[cfg.titleKey]}
      </h2>
      <p className="mx-auto max-w-[380px] text-[14px] leading-relaxed text-calma-taupe">
        {t[cfg.subKey]}
      </p>
      {profile.status === "REJECTED" && profile.rejectionReason && (
        <p className="mx-auto mt-3 max-w-[380px] rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
          {profile.rejectionReason}
        </p>
      )}
      <Link
        href={profile.status === "APPROVED" ? "/b2b" : "/"}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-calma-sand px-6 py-2.5 text-sm font-semibold text-calma-ink transition-colors hover:bg-calma-border"
      >
        {profile.status === "APPROVED" ? t.goToDashboardBtn : t.successBackBtn}
      </Link>
    </div>
  );
}
