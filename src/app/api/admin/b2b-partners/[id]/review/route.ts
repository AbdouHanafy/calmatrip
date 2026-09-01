import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reviewPartnerProfile } from "@/repositories/partnerProfileRepository";

// PATCH /api/admin/b2b-partners/[id]/review — approve or reject a partner's
// submitted PartnerProfile application; keeps User.b2bStatus in sync so
// middleware/session behavior driven by that field is unaffected.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const decision = body.decision;
  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { role: true, partnerProfile: { select: { status: true } } },
  });
  if (!target || target.role !== "B2B" || !target.partnerProfile) {
    return NextResponse.json({ error: "Partner application not found." }, { status: 404 });
  }
  if (
    target.partnerProfile.status !== "SUBMITTED" &&
    target.partnerProfile.status !== "UNDER_REVIEW"
  ) {
    return NextResponse.json({ error: "This application isn't awaiting review." }, { status: 409 });
  }

  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : null;
  const profile = await reviewPartnerProfile(id, decision, decision === "REJECTED" ? reason : null);

  return NextResponse.json({ profile });
}
