import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "USER",
      },
    });

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Registered Date",
      "Total Bookings",
    ];

    const rows = users.map((user) => [
      user.name ?? "",
      user.email ?? "",
      
      user.status ?? "active",
      user.createdAt.toISOString(),
      
      
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          `attachment; filename="clients-${new Date()
            .toISOString()
            .split("T")[0]}.csv`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Export failed",
      },
      { status: 500 }
    );
  }
}