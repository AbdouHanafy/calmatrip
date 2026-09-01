import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { submitPartnerProfile } from "@/repositories/partnerProfileRepository";

// POST /api/b2b/onboarding/submit — finalizes the draft. Ownership is
// always derived from the session, never a client-supplied id.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !checkRateLimit(
      `b2b-onboarding-submit:${session.user.id}:${getClientIp(req)}`,
      10,
      10 * 60 * 1000,
    )
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const result = await submitPartnerProfile(session.user.id);

  if ("error" in result) {
    if (result.error === "not_found") {
      return NextResponse.json({ error: "No application found to submit." }, { status: 404 });
    }
    if (result.error === "already_submitted") {
      return NextResponse.json({ profile: result.profile }, { status: 200 });
    }
    return NextResponse.json(
      { error: "Please complete all required fields before submitting.", missing: result.missing },
      { status: 400 },
    );
  }

  return NextResponse.json({ profile: result.profile });
}
