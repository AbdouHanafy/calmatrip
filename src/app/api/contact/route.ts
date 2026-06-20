import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact  (visiteur: envoyer un message)
export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
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
  try {
    const { searchParams } = new URL(req.url);
    const isReadParam = searchParams.get("isRead");

    const where: any = {};
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