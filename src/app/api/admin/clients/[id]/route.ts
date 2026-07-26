import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientById } from "@/repositories/clientRepository";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const client = await getClientById(id);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: "Client introuvable",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      {
        status: 500,
      },
    );
  }
}
