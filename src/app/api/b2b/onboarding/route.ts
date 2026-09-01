import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  partnerOnboardingPatchSchema,
  validateInterestsForType,
} from "@/schemas/partnerOnboarding";
import {
  getPartnerProfileByUserId,
  ensurePartnerProfile,
  updatePartnerProfile,
} from "@/repositories/partnerProfileRepository";
import { LOCKED_STATUSES } from "@/lib/partners/constants";

// GET /api/b2b/onboarding — the authenticated user's own onboarding record
// (or null if they haven't started). userId always comes from the session,
// never from a query param, so a partner can never read another partner's
// draft.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getPartnerProfileByUserId(session.user.id);
  return NextResponse.json({ profile });
}

// PATCH /api/b2b/onboarding — incremental autosave after each wizard step.
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !checkRateLimit(`b2b-onboarding:${session.user.id}:${getClientIp(req)}`, 60, 10 * 60 * 1000)
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = partnerOnboardingPatchSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const userId = session.user.id;
  const existing = await getPartnerProfileByUserId(userId);

  // First write for this user: partnerType is required to create the
  // profile at all (Step 2 of the wizard).
  if (!existing) {
    if (!parsed.data.partnerType) {
      return NextResponse.json({ error: "Please choose a partner type first." }, { status: 400 });
    }
    await ensurePartnerProfile(userId, parsed.data.partnerType);
  } else if (LOCKED_STATUSES.includes(existing.status as (typeof LOCKED_STATUSES)[number])) {
    return NextResponse.json(
      { error: "Your application has already been submitted and can no longer be edited." },
      { status: 409 },
    );
  } else if (parsed.data.partnerType && parsed.data.partnerType !== existing.partnerType) {
    await ensurePartnerProfile(userId, parsed.data.partnerType);
  }

  // Validate interests against whichever partner type will be active after
  // this save (never trust the client to have kept these consistent).
  if (parsed.data.interests) {
    const effectiveType = parsed.data.partnerType ?? existing?.partnerType;
    if (effectiveType !== "ARTISAN" && effectiveType !== "AGENCY") {
      return NextResponse.json(
        { error: "Choose a partner type before selecting interests." },
        { status: 400 },
      );
    }
    const err = validateInterestsForType(effectiveType, parsed.data.interests);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  try {
    const updated = await updatePartnerProfile(userId, parsed.data);
    return NextResponse.json({ profile: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save your progress." }, { status: 500 });
  }
}
