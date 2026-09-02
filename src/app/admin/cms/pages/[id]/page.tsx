"use client";

import { use } from "react";
import CmsPageEditor from "@/features/cms/components/CmsPageEditor";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CmsPageEditor pageId={id} />;
}
