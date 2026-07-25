import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const VALID_TYPES = new Set(["artisan", "agency"]);

// POST /api/auth/apply-account-type — applied right after a Google sign-up,
// since the OAuth flow never passes through /api/auth/register where accountType
// is normally set. Only upgrades brand-new plain USER accounts — never touches
// an existing ADMIN or already-B2B account.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const type = typeof body.type === "string" ? body.type : "";
  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
  }

  if (session.user.role !== "USER") {
    // Already ADMIN or B2B — do not touch.
    return NextResponse.json({ applied: false });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "B2B",
      b2bType: type === "artisan" ? "ARTISAN" : "AGENCY",
      b2bStatus: "pending",
    },
  });

  return NextResponse.json({ applied: true });
}
