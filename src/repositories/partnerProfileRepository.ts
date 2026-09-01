import { prisma } from "@/lib/prisma";
import type { PartnerOnboardingPatchInput } from "@/schemas/partnerOnboarding";

export async function getPartnerProfileByUserId(userId: string) {
  return prisma.partnerProfile.findUnique({
    where: { userId },
    include: { interests: true, socialProfiles: true },
  });
}

export async function ensurePartnerProfile(userId: string, partnerType: "ARTISAN" | "AGENCY") {
  return prisma.partnerProfile.upsert({
    where: { userId },
    create: { userId, partnerType, status: "DRAFT", currentStep: 2 },
    // Changing partner type mid-draft resets the type-specific interests
    // (an ARTISAN category is never valid once the profile becomes an AGENCY).
    update: { partnerType },
    include: { interests: true, socialProfiles: true },
  });
}

export async function updatePartnerProfile(userId: string, data: PartnerOnboardingPatchInput) {
  const { interests, socialProfiles, ...scalarFields } = data;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.partnerProfile.findUnique({ where: { userId } });
    if (!existing) return null;

    if (interests) {
      await tx.partnerInterest.deleteMany({ where: { profileId: existing.id } });
      if (interests.length > 0) {
        await tx.partnerInterest.createMany({
          data: interests.map((category) => ({ profileId: existing.id, category })),
        });
      }
    }

    if (socialProfiles) {
      await tx.partnerSocialProfile.deleteMany({ where: { profileId: existing.id } });
      if (socialProfiles.length > 0) {
        await tx.partnerSocialProfile.createMany({
          data: socialProfiles.map((p) => ({
            profileId: existing.id,
            platform: p.platform,
            url: p.url,
          })),
        });
      }
    }

    return tx.partnerProfile.update({
      where: { userId },
      data: scalarFields,
      include: { interests: true, socialProfiles: true },
    });
  });
}

export async function submitPartnerProfile(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({
    where: { userId },
    include: { interests: true, socialProfiles: true },
  });
  if (!profile) return { error: "not_found" as const };
  if (profile.status !== "DRAFT") return { error: "already_submitted" as const, profile };

  const missing: string[] = [];
  if (!profile.organizationName) missing.push("organizationName");
  if (!profile.contactFirstName) missing.push("contactFirstName");
  if (!profile.contactLastName) missing.push("contactLastName");
  if (!profile.phone) missing.push("phone");
  if (!profile.countryCode) missing.push("countryCode");
  if (!profile.city) missing.push("city");
  if (!profile.currency) missing.push("currency");
  if (profile.interests.length === 0) missing.push("interests");
  if (missing.length > 0) return { error: "incomplete" as const, missing };

  const updated = await prisma.partnerProfile.update({
    where: { userId },
    data: { status: "SUBMITTED", submittedAt: new Date(), currentStep: 6 },
    include: { interests: true, socialProfiles: true },
  });

  return { profile: updated };
}

/**
 * Called from admin moderation. Keeps the rich PartnerProfile lifecycle in
 * sync with the User.role/b2bType/b2bStatus fields that middleware and the
 * session callback already rely on, without altering that existing model.
 */
export async function reviewPartnerProfile(
  userId: string,
  decision: "APPROVED" | "REJECTED",
  rejectionReason?: string | null,
) {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.partnerProfile.update({
      where: { userId },
      data: {
        status: decision,
        reviewedAt: new Date(),
        rejectionReason: decision === "REJECTED" ? (rejectionReason ?? null) : null,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { b2bStatus: decision === "APPROVED" ? "approved" : "rejected" },
    });

    return profile;
  });
}
