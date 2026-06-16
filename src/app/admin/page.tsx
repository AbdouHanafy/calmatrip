import { AdminOverview } from '@/pages/admin/AdminOverview';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Sahara Tunisia',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminOverviewPage() {
  return <AdminOverview />;
}
