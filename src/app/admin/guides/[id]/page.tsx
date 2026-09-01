"use client";
import { use } from "react";
import AdminGuideEditPage from "@/views/admin/AdminGuideEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminGuideEditPage id={id} />;
}
