"use client";
import { use } from "react";
import AdminProductEditPage from "@/views/admin/AdminProductEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminProductEditPage id={id} />;
}
