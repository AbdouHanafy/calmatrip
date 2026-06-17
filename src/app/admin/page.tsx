import AdminOverview from '@/views/admin/AdminOverview';
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
