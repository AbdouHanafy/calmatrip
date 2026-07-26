import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClients } from "@/repositories/clientRepository";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const search = req.nextUrl.searchParams.get("search") || "";
    const status = req.nextUrl.searchParams.get("status") || "all";

    const clients = await getClients({ search, status });

    return NextResponse.json({
      success: true,
      data: clients,
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
