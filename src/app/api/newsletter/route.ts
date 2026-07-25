import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    if (!existing.active) {
      await prisma.newsletterSubscriber.update({ where: { email }, data: { active: true } });
    }
    return NextResponse.json({ message: "Déjà inscrit" }, { status: 200 });
  }

  const subscriber = await prisma.newsletterSubscriber.create({ data: { email } });
  return NextResponse.json(subscriber, { status: 201 });
}
