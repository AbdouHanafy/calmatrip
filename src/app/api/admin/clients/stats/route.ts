import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientStats } from "@/repositories/clientRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getClientStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur serveur",
      },
      {
        status: 500,
      },
    );
  }
}
