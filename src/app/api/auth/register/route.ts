import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAdminEmails } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { registerSchema } from "@/schemas/auth";

export async function POST(req: Request) {
  if (!checkRateLimit(`register:${getClientIp(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password, accountType, website } = parsed.data;

  // Honeypot: bots fill every field, real visitors never see this one.
  if (website && website.trim()) {
    return NextResponse.json({ user: { id: "", name: "", email: "" } }, { status: 201 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const isAdmin = getAdminEmails().includes(email);
  const isB2B = !isAdmin && accountType !== "user";

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: isAdmin ? "ADMIN" : isB2B ? "B2B" : "USER",
      b2bType: isB2B ? (accountType === "artisan" ? "ARTISAN" : "AGENCY") : null,
      b2bStatus: isB2B ? "pending" : null,
    },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
