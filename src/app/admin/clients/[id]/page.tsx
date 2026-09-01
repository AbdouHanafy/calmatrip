"use client";
import { use } from "react";
import AdminClientEditPage from "@/views/admin/AdminClientEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminClientEditPage id={id} />;
}
