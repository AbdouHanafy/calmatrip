"use client";
import { use } from "react";
import FormEditor from "@/features/cms/components/FormEditor";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FormEditor formId={use(params).id} />;
}
