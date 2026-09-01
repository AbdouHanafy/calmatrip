"use client";
import { use } from "react";
import AdminEventEditPage from "@/views/admin/AdminEventEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminEventEditPage id={id} />;
}
