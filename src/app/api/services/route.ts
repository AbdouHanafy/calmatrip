import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";
import { createService, getPublicServices } from "@/repositories/serviceRepository";

export async function GET() {
  try {
    const services = await getPublicServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();

    const service = await createService({
      title: json.title,
      subtitle: json.subtitle,
      description: sanitizeHtml(json.description),
      price: json.price.toString(),
      category: json.category,
      duration: json.duration,
      icon: json.icon,
      color: json.color,
      image: json.image,
      active: json.active,
      popular: json.popular,
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
