"use client";
import { use } from "react";
import AdminMuseumEditPage from "@/views/admin/AdminMuseumEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminMuseumEditPage id={id} />;
}
