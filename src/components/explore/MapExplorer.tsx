'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse rounded-3xl bg-zinc-900" />
    ),
  }
);

export default LeafletMap;