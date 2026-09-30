"use client";
import { use } from "react";
import AdminDestinationEditPage from "@/views/admin/AdminDestinationEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminDestinationEditPage id={id} />;
}
