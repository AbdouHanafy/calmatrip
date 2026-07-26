import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { contactSchema } from "@/schemas/contact";

export const dynamic = "force-dynamic";

// POST /api/contact  (visiteur: envoyer un message)
export async function POST(req: NextRequest) {
  try {
    if (!checkRateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard." },
        { status: 429 },
      );
    }

    const rawBody = await req.json();
    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, phone, subject, message, website } = parsed.data;

    // Honeypot: bots fill every field, real visitors never see this one.
    if (website && website.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec de l'envoi du message" }, { status: 500 });
  }
}

// GET /api/contact?isRead=  (admin: liste des messages)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const isReadParam = searchParams.get("isRead");

    const where: Prisma.ContactWhereInput = {};
    if (isReadParam === "true" || isReadParam === "false") {
      where.isRead = isReadParam === "true";
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec du chargement des messages" }, { status: 500 });
  }
}
