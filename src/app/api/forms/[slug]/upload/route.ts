import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImages, UploadValidationError } from "@/lib/mediaStorage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const formData = await request.formData();
  const fieldKey = formData.get("fieldKey");
  if (typeof fieldKey !== "string")
    return NextResponse.json({ error: "Field key is required" }, { status: 400 });
  const form = await prisma.formDefinition.findFirst({
    where: { slug: (await params).slug, status: "PUBLISHED" },
    include: {
      steps: { include: { fields: { where: { key: fieldKey, type: { in: ["FILE", "IMAGE"] } } } } },
    },
  });
  if (!form || !form.steps.some((step) => step.fields.length))
    return NextResponse.json({ error: "Upload field not found" }, { status: 404 });
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length !== 1)
    return NextResponse.json({ error: "Upload exactly one file" }, { status: 400 });
  try {
    const [url] = await uploadImages(files);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof UploadValidationError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
