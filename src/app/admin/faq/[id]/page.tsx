"use client";
import { use } from "react";
import AdminFAQEditPage from "@/views/admin/AdminFAQEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminFAQEditPage id={id} />;
}
