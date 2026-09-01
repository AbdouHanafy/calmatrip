"use client";
import { use } from "react";
import AdminServiceEditPage from "@/views/admin/AdminServiceEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminServiceEditPage id={id} />;
}
