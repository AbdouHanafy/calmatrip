import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientsForExport } from "@/repositories/clientRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await getClientsForExport();

    const headers = ["Name", "Email", "Phone", "Status", "Registered Date", "Total Bookings"];

    const rows = users.map((user) => [
      user.name ?? "",
      user.email ?? "",

      user.status ?? "active",
      user.createdAt.toISOString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clients-${
          new Date().toISOString().split("T")[0]
        }.csv`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Export failed",
      },
      { status: 500 },
    );
  }
}
