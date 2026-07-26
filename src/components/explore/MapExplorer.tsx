"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full animate-pulse rounded-3xl bg-zinc-900 sm:h-[480px] lg:h-[600px]" />
  ),
});

export default LeafletMap;
