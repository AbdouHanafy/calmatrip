import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAdminEmails } from "@/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCOUNT_TYPES = new Set(["user", "artisan", "agency"]);

export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown; password?: unknown; accountType?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const accountType =
    typeof body.accountType === "string" && ACCOUNT_TYPES.has(body.accountType)
      ? body.accountType
      : "user";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters and include a letter and a number." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
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
